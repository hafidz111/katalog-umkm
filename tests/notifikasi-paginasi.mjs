import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

const cookie = new Map();
let options;
const context = vm.createContext({ crypto: webcrypto, process: { env: { NODE_ENV: "production" } } });
const stub = values => new vm.SyntheticModule(Object.keys(values), function () {
  for (const [key, value] of Object.entries(values)) this.setExport(key, value);
}, { context });
const flash = new vm.SourceTextModule(await readFile("lib/notifikasi-admin.js", "utf8"), { context });
await flash.link(name => name === "server-only" ? stub({}) : stub({ cookies: async () => ({
  get: key => cookie.has(key) ? { value: cookie.get(key) } : undefined,
  set: (key, value, config) => { options = config; cookie.set(key, value); },
  delete: key => cookie.delete(key),
}) }));
await flash.evaluate();
for (const kode of ["masuk", "keluar", "tambah", "ubah"]) {
  await flash.namespace.simpanNotifikasiAdmin(kode);
  assert.equal(options.httpOnly, true);
  assert.equal(options.secure, true);
  assert.equal(options.maxAge, 60);
  const hasil = await flash.namespace.konsumsiNotifikasiAdmin();
  assert.match(hasil.pesan, /[Bb]erhasil/);
  assert.equal(hasil.id.length, 36);
  assert.equal(await flash.namespace.konsumsiNotifikasiAdmin(), null);
}
for (const value of ["broken-json", JSON.stringify({ kode: "__proto__", id: "bad" }), JSON.stringify({ kode: "masuk", id: "bad" })]) {
  cookie.set("notifikasi-admin", value);
  assert.equal(await flash.namespace.konsumsiNotifikasiAdmin(), null);
  assert.equal(cookie.size, 0);
}

const pagination = new vm.SourceTextModule(await readFile("lib/paginasi-admin.js", "utf8"), { context });
await pagination.link(() => stub({}));
await pagination.evaluate();
for (const value of ["0", "-1", "1.5", "1000000", ["1"], ""]) assert.equal(pagination.namespace.bacaHalamanAdmin(value), null);
assert.equal(pagination.namespace.bacaHalamanAdmin(), 1);
const ranges = [], orders = [];
let total = 25, fail = false;
const client = { from: () => ({ select: (columns, config) => {
  assert.equal(config.count, "exact");
  assert.ok(!columns.includes("deskripsi"));
  const request = {
    order: (column, config) => { orders.push([column, config.ascending]); return request; },
    range: async (from, to) => {
      ranges.push([from, to]);
      return { count: total, data: Array.from({ length: Math.max(0, Math.min(to + 1, total) - from) }, (_, i) => ({ id: from + i + 1 })), error: fail ? new Error("mock error") : null };
    },
  };
  return request;
} }) };
let result = await pagination.namespace.ambilProdukAdmin(client, 2);
assert.equal(result.daftarProduk.length, 12);
assert.equal(result.jumlahHalaman, 3);
assert.deepEqual(ranges[0], [12, 23]);
assert.deepEqual(orders.slice(0, 2), [["created_at", false], ["id", false]]);
result = await pagination.namespace.ambilProdukAdmin(client, 999);
assert.equal(result.halaman, 3);
assert.equal(result.daftarProduk.length, 1);
total = 0;
result = await pagination.namespace.ambilProdukAdmin(client, 2);
assert.equal(result.halaman, 1);
assert.equal(result.daftarProduk.length, 0);
fail = true;
await assert.rejects(pagination.namespace.ambilProdukAdmin(client, 1), /mock error/);
console.log("Lulus (simulasi): notifikasi sekali pakai/whitelist/cookie, pagination 12 data, urutan stabil, ID halaman invalid, halaman terakhir/kosong/gagal.");

const notifications = [];
let authGagal = false;
const user = { id: "admin-test" };
const response = () => ({ data: { id: 1 }, error: null });
const actionClient = {
  auth: {
    getUser: async () => ({ data: { user: authGagal ? null : user }, error: null }),
    signInWithPassword: async () => ({ data: { user, session: {} }, error: authGagal ? { code: "invalid_credentials" } : null }),
    signOut: async () => ({ error: null }),
    updateUser: async () => ({ data: { user }, error: null }),
  },
  from: () => {
    const request = { insert: () => request, update: () => request, delete: () => request, eq: () => request, select: () => request, single: async () => response(), maybeSingle: async () => response() };
    return request;
  },
};
const actions = new vm.SourceTextModule(await readFile("app/admin/actions.js", "utf8"), { context });
await actions.link(name => ({
  "@/lib/notifikasi-admin": stub({ simpanNotifikasiAdmin: async kode => notifications.push(kode), konsumsiNotifikasiAdmin: async () => null }),
  "@/lib/supabase/session": stub({ buatSupabaseSession: async () => actionClient }),
  "@/lib/supabase/foto-produk": stub({ unggahFotoProduk: async () => ({ url: "https://test.invalid/foto.png" }), batalkanUploadFoto: async () => {}, ErrorFotoProduk: class extends Error {} }),
  "@/lib/validasi-produk": stub({ validasiProduk: () => ({ data: { nama: "Uji", harga: 0, kategori: "Minuman", deskripsi: "Uji" } }) }),
  "@/lib/validasi-id-produk": stub({ idProdukValid: () => true }),
  "@/lib/ai/error": stub({ ErrorDeskripsi: class extends Error {} }),
  "@/lib/ai/deskripsi": stub({ buatDeskripsiAI: async () => "" }),
  "next/cache": stub({ revalidatePath: () => {} }),
  "next/navigation": stub({ redirect: path => { throw new Error(`redirect:${path}`); } }),
})[name]);
await actions.evaluate();
const form = new FormData();
form.set("email", "admin@example.test"); form.set("password", "test-password");
form.set("password_baru", "test-password"); form.set("konfirmasi_password", "test-password");
await assert.rejects(actions.namespace.masukAdmin({}, form), /redirect:\/admin$/);
await assert.rejects(actions.namespace.keluarAdmin(), /redirect:\/admin\/login$/);
await assert.rejects(actions.namespace.tambahProdukAdmin({}, form), /redirect:\/admin$/);
await assert.rejects(actions.namespace.ubahProdukAdmin("1", {}, form), /redirect:\/admin$/);
assert.deepEqual(notifications, ["masuk", "keluar", "tambah", "ubah"]);
assert.equal((await actions.namespace.hapusProdukAdmin("1")).berhasil, true);
assert.equal((await actions.namespace.gantiPasswordAdmin({}, form)).berhasil, true);
authGagal = true;
assert.ok((await actions.namespace.masukAdmin({}, form)).pesan);
assert.ok((await actions.namespace.tambahProdukAdmin({}, form)).pesan);
assert.ok((await actions.namespace.ubahProdukAdmin("1", {}, form)).pesan);
assert.ok((await actions.namespace.hapusProdukAdmin("1")).pesan);
assert.ok((await actions.namespace.gantiPasswordAdmin({}, form)).pesan);
assert.equal(notifications.length, 4);
console.log("Lulus (simulasi): enam Action berhasil, flash sebelum redirect, penolakan Auth tidak menampilkan sukses.");
