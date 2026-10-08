export function validasiProduk(formData) {
  const values = {};
  for (const field of ["nama", "harga", "deskripsi", "foto_url", "kategori"]) {
    const entries = formData.getAll(field);
    if (entries.length > 1 || (entries.length === 1 && typeof entries[0] !== "string")) {
      return { error: "Format isian produk tidak valid. Periksa kembali form." };
    }
    values[field] = (entries[0] ?? "").trim();
  }

  if (!values.nama) return { error: "Nama produk wajib diisi." };
  if (!values.harga) return { error: "Harga produk wajib diisi." };
  const harga = Number(values.harga);
  if (!/^\d+$/.test(values.harga) || !Number.isSafeInteger(harga) || harga > 2147483647) {
    return { error: "Harga harus berupa bilangan bulat antara 0 dan 2.147.483.647 rupiah." };
  }

  if (values.foto_url) {
    try {
      if (/[\\\u0000-\u0020\u007f]/.test(values.foto_url)) throw new Error();
      if (values.foto_url.startsWith("/produk/")) {
        const url = new URL(values.foto_url, "https://lokal.invalid");
        if (url.origin !== "https://lokal.invalid" || !url.pathname.startsWith("/produk/") || url.pathname === "/produk/") throw new Error();
      } else {
        const url = new URL(values.foto_url);
        if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error();
      }
    } catch {
      return { error: "Link foto harus berupa URL HTTP/HTTPS atau path lokal /produk/nama-file." };
    }
  }

  return {
    data: {
      nama: values.nama,
      harga,
      deskripsi: values.deskripsi || null,
      foto_url: values.foto_url || null,
      kategori: values.kategori || null,
    },
  };
}
