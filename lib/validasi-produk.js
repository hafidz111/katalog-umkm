export function validasiProduk(formData) {
  const values = {};
  for (const field of ["nama", "harga", "deskripsi", "kategori"]) {
    const entries = formData.getAll(field);
    if (entries.length > 1 || (entries.length === 1 && typeof entries[0] !== "string")) {
      return { error: "Format isian produk tidak valid. Periksa kembali form." };
    }
    values[field] = (entries[0] ?? "").trim();
  }

  if (!values.nama) return { error: "Nama produk wajib diisi." };
  if (!values.harga) return { error: "Harga produk wajib diisi." };
  if (!values.kategori) return { error: "Kategori produk wajib diisi." };
  if (!values.deskripsi) return { error: "Deskripsi produk wajib diisi." };
  const harga = Number(values.harga);
  if (!/^\d+$/.test(values.harga) || !Number.isSafeInteger(harga) || harga > 2147483647) {
    return { error: "Harga harus berupa bilangan bulat antara 0 dan 2.147.483.647 rupiah." };
  }

  return {
    data: {
      nama: values.nama,
      harga,
      deskripsi: values.deskripsi || null,
      kategori: values.kategori || null,
    },
  };
}
