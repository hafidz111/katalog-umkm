import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const env = { NINEROUTER_URL: "https://router.example.test", NINEROUTER_TOKEN: "token-simulasi", NINEROUTER_MODEL: "combo" };
let mode = "ok", requests = [];
const context = vm.createContext({ process: { env }, URL, AbortController, TypeError, SyntaxError,
  setTimeout: callback => { if (mode === "timeout") callback(); return 1; }, clearTimeout: () => {},
  fetch: async (url, options) => {
    requests.push({ url, options });
    if (options.signal.aborted || mode === "network") throw new TypeError("mock network");
    const status = { limit: 429, access: 401, missing: 404, failure: 503 }[mode] ?? 200;
    return { status, ok: status === 200, json: async () => ({ choices: [{ finish_reason: mode === "blocked" ? "content_filter" : "stop", message: { content: mode === "empty" ? "" : "Pilihan minuman untuk menemani waktu santai." } }] }) };
  },
});
const stub = values => new vm.SyntheticModule(Object.keys(values), function () {
  for (const [key, value] of Object.entries(values)) this.setExport(key, value);
}, { context });
const errors = new vm.SourceTextModule(await readFile("lib/ai/error.js", "utf8"), { context });
await errors.link(() => stub({})); await errors.evaluate();
const module = new vm.SourceTextModule(await readFile("lib/ai/deskripsi.js", "utf8"), { context });
await module.link(name => name === "server-only" ? stub({}) : errors); await module.evaluate();
const generate = module.namespace.buatDeskripsiAI;
assert.match(await generate(" Kopi ", " Minuman "), /Pilihan/);
assert.equal(requests[0].url, "https://router.example.test/v1/chat/completions");
assert.equal(requests[0].options.headers.Authorization, "Bearer token-simulasi");
assert.equal(requests[0].options.redirect, "error");
assert.equal(requests[0].options.cache, "no-store");
assert.equal(JSON.parse(requests[0].options.body).model, "combo");
assert.deepEqual(JSON.parse(JSON.parse(requests[0].options.body).messages[1].content), { nama: "Kopi", kategori: "Minuman" });
env.NINEROUTER_URL += "/v1/";
await generate("Kopi", "Minuman");
assert.equal(requests[1].url, requests[0].url);
const count = requests.length;
await assert.rejects(generate(" ", "Minuman"), /wajib/);
await assert.rejects(generate("x".repeat(151), "Minuman"), /maksimal/);
assert.equal(requests.length, count);
env.NINEROUTER_TOKEN = "";
await assert.rejects(generate("Kopi", "Minuman"), /belum dikonfigurasi/);
env.NINEROUTER_TOKEN = "token-simulasi";
env.NINEROUTER_URL = "http://router.example.test";
await assert.rejects(generate("Kopi", "Minuman"), /HTTPS/);
env.NINEROUTER_URL = "https://router.example.test";
for (const [test, pattern] of Object.entries({ limit: /Batas/, access: /ditolak/, missing: /tidak tersedia/, failure: /503/, empty: /kosong/, blocked: /memblokir/, timeout: /terlalu lama/, network: /koneksi/ })) {
  mode = test; await assert.rejects(generate("Kopi", "Minuman"), pattern);
}
console.log("Lulus (simulasi): request 9router, combo, token server, validasi, konfigurasi, limit, gagal akses/API/jaringan, kosong, blokir, timeout.");
