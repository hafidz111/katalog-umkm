// Jumlah kontrol tetap kecil meskipun katalog memiliki ribuan halaman.
export function halamanPagination(halaman, jumlahHalaman) {
  if (jumlahHalaman <= 5) return Array.from({ length: jumlahHalaman }, (_, i) => i + 1);
  if (halaman <= 3) return [1, 2, 3, "akhir", jumlahHalaman];
  if (halaman >= jumlahHalaman - 2) return [1, "awal", jumlahHalaman - 2, jumlahHalaman - 1, jumlahHalaman];
  return [1, "awal", halaman, "akhir", jumlahHalaman];
}
