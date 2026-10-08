-- Jalankan manual di Supabase SQL Editor setelah memeriksa hasil SELECT.
-- Hanya cocok dengan nama, harga, dan foto persis dari seed lama proyek.
-- Tidak menghapus produk lain atau objek Storage.
select id, nama, harga, foto_url from public.produk
where (nama, harga, foto_url) in (
  ('Kopi Bubuk Robusta 250 g', 45000, '/produk/kopi.svg'),
  ('Keripik Singkong Balado', 15000, '/produk/keripik.svg'),
  ('Sambal Bawang Botol 150 ml', 25000, '/produk/sambal.svg'),
  ('Kue Nastar Toples 500 g', 85000, '/produk/nastar.svg'),
  ('Tas Anyaman Pandan', 120000, '/produk/tas.svg'),
  ('Kain Batik Cap 2 m', 175000, '/produk/batik.svg')
);

-- Jika baris di atas benar-benar data dummy, jalankan bagian ini saja.
delete from public.produk
where (nama, harga, foto_url) in (
  ('Kopi Bubuk Robusta 250 g', 45000, '/produk/kopi.svg'),
  ('Keripik Singkong Balado', 15000, '/produk/keripik.svg'),
  ('Sambal Bawang Botol 150 ml', 25000, '/produk/sambal.svg'),
  ('Kue Nastar Toples 500 g', 85000, '/produk/nastar.svg'),
  ('Tas Anyaman Pandan', 120000, '/produk/tas.svg'),
  ('Kain Batik Cap 2 m', 175000, '/produk/batik.svg')
)
returning id, nama;
