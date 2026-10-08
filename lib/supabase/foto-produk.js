import "server-only";

export class ErrorFotoProduk extends Error {}
const bucket = () => process.env.SUPABASE_STORAGE_BUCKET?.trim() || "foto-produk";

export async function unggahFotoProduk(supabase, userId, formData) {
  const files = formData.getAll("foto");
  if (files.length > 1) throw new ErrorFotoProduk("Pilih satu foto produk saja.");
  const file = files[0];
  if (!file || (typeof file !== "string" && file.size === 0 && !file.name)) return null;
  if (typeof file === "string" || typeof file.arrayBuffer !== "function") throw new ErrorFotoProduk("Format foto tidak valid. Pilih ulang gambar.");
  const extensions = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  if (!extensions[file.type] || file.size < 1 || file.size > 3 * 1024 * 1024) throw new ErrorFotoProduk("Pilih gambar JPG, PNG, atau WebP, maksimal 3 MB.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const png = bytes.slice(0, 8).join(",") === "137,80,78,71,13,10,26,10";
  const jpg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp = String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (!({ "image/png": png, "image/jpeg": jpg, "image/webp": webp })[file.type]) throw new ErrorFotoProduk("Isi file tidak sesuai format gambar. Pilih ulang foto yang valid.");
  const path = `${userId}/${crypto.randomUUID()}.${extensions[file.type]}`;
  const storage = supabase.storage.from(bucket());
  const { error } = await storage.upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) {
    const status = Number(error.statusCode ?? error.status);
    if (status === 404 || /bucket.*not found/i.test(error.message ?? "")) throw new ErrorFotoProduk(`Bucket ${bucket()} belum tersedia. Buat bucket dan izin upload sesuai docs/storage.sql, lalu coba lagi.`);
    if (status === 401 || status === 403 || /row.level.security|unauthorized/i.test(error.message ?? "")) throw new ErrorFotoProduk("Upload foto ditolak oleh izin Storage. Pastikan sudah login dan policy upload dari docs/storage.sql sudah dipasang.");
    throw new ErrorFotoProduk(`Gagal mengunggah foto. Periksa koneksi, bucket ${bucket()}, dan izin Storage, lalu coba lagi.`);
  }
  const { data } = storage.getPublicUrl(path);
  return { url: data.publicUrl, path };
}

// Hanya untuk membatalkan upload baru ketika penyimpanan produk ditolak.
export async function batalkanUploadFoto(supabase, foto) {
  if (foto) await supabase.storage.from(bucket()).remove([foto.path]).catch(() => {});
}
