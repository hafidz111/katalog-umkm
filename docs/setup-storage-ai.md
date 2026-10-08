# Konfigurasi foto dan deskripsi AI

## Foto Supabase Storage

Isi `.env` pada proyek yang sama dengan akun admin:

```dotenv
SUPABASE_URL=https://ID-PROYEK.supabase.co
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
SUPABASE_STORAGE_BUCKET=foto-produk
```

URL dan keys diambil dari dashboard Supabase, bagian Project Settings/API Keys. Jangan memasukkan kunci ke kode atau memakai awalan NEXT_PUBLIC_. Publishable key dipakai upload melalui sesi admin; secret key hanya membaca katalog publik.

Di dashboard Supabase buka SQL Editor, lalu jalankan isi `docs/storage.sql`. Skrip membuat bucket publik `foto-produk`, batas 3 MB, format JPG/PNG/WebP, serta policy yang membatasi upload ke folder ID pengguna yang sedang login. Skrip ini tidak mengubah tabel produk. Tidak perlu menambahkan key Storage terpisah.

Jika bucket sudah pernah dibuat, periksa di Storage bahwa namanya persis `foto-produk`, status Public aktif, batas 3 MB dan format gambar sesuai. Skrip tidak menimpa pengaturan bucket yang sudah ada. Pastikan policy insert/select/delete dari skrip sudah terpasang.

Restart server pengembangan setelah mengisi environment, lalu keluar dan login kembali. Tambahkan satu produk uji dengan PNG/JPG/WebP di bawah 3 MB. Pastikan gambar tampil di katalog. Pada Vercel, isi variabel yang sama melalui Settings > Environment Variables dan deploy ulang.

Jika pesan menyebut bucket belum tersedia, periksa nama bucket. Jika izin ditolak, periksa policy dan sesi login. Jangan menonaktifkan RLS atau menggunakan secret key untuk upload.

Dokumentasi: https://supabase.com/docs/guides/storage/buckets/creating-buckets dan https://supabase.com/docs/guides/storage/security/access-control.

## 9router

```dotenv
NINEROUTER_URL=https://router.titiksenyapstudio.id
NINEROUTER_TOKEN=
NINEROUTER_MODEL=combo
```

Isi token dari dashboard 9router. `combo` harus sama persis dengan ID combo yang tersedia di router; jika nama combonya berbeda, isi nama sebenarnya. URL dasar boleh berakhiran `/v1`; jangan menambahkan `/chat/completions`. Semua variabel hanya digunakan server. Gemini key tidak digunakan lagi.

Permintaan memakai POST `/v1/chat/completions`, Authorization Bearer, messages dan stream false. Hasil mengisi textarea tanpa otomatis menyimpan. Token sesi/email admin tidak dikirim ke router. Restart server atau deploy ulang setelah mengubah konfigurasi.

Dokumentasi: https://github.com/decolua/9router/blob/master/skills/9router-chat/SKILL.md.
