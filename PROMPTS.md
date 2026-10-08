# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Katalog `/` mengambil data tabel `produk` di server melalui `lib/supabase/server.js`, memakai `SUPABASE_URL` dan `SUPABASE_SECRET_KEY`. Produk ditampilkan dengan `KartuProduk` yang sama, diurutkan dari yang terbaru. Tabel kosong menampilkan “Belum ada produk”; `CatatanBelumAktif` dihapus. Build melalui Webpack berhasil, dan kondisi kosong serta kegagalan koneksi diperiksa di browser.

**Perbaikan:**
Menghapus penggunaan `produkContoh` pada katalog dan memakai render dinamis agar data dibaca saat halaman diminta. Sesuai prompt tambahan pengguna, pesan kegagalan katalog kemudian dipindahkan ke Sonner tanpa pesan error inline ganda. Pemeriksaan konfigurasi kunci dibahas terpisah pada bagian debugging.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
Halaman `/produk/[id]` mengambil satu produk dari Supabase di server dengan `.eq("id", id).maybeSingle()`. Foto, kategori, nama, harga rupiah, deskripsi, dan tombol WhatsApp tetap ditampilkan dengan tata letak yang sama. `CatatanBelumAktif` dihapus. Detail produk ID `1` diperiksa langsung dari database; ID yang tidak ada menghasilkan 404.

**Perbaikan:**
Menggunakan `await params` sesuai Next.js 16. ID yang bukan angka atau melebihi batas kolom bigint langsung memanggil `notFound()`. Kegagalan query dipisahkan dari produk yang tidak ditemukan: error diteruskan ke penanganan error halaman melalui Sonner.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
`TombolWhatsApp` menjadi tautan `https://wa.me/<nomor>?text=<pesan>` memakai nomor dari `lib/toko.js`. Pesan berisi nama produk dan harga dari `formatRupiah`, lalu di-encode dengan `encodeURIComponent`. Tautan membuka tab baru dan memakai komponen Button shadcn/ui dengan gaya tombol semula. Build berhasil; pengiriman pesan lewat layanan WhatsApp belum diuji langsung.

**Perbaikan:**
Menambahkan `target="_blank"` dan `rel="noopener noreferrer"`. Catatan US-03 sudah dihapus dari halaman detail pada pengerjaan US-02, sehingga tidak perlu dihapus ulang.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
Login email/password diproses oleh `masukAdmin` di `app/admin/actions.js` melalui Supabase Auth. `lib/supabase/session.js` memakai `@supabase/ssr`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, dan cookie sesi. Login berhasil menuju `/admin`; tombol Keluar mengakhiri sesi saat ini dan kembali ke `/admin/login`. Tampilan dipertahankan dan catatan login belum aktif dihapus. Build serta alur login/logout di browser berhasil diuji dengan Auth simulasi; akun Supabase asli belum diuji.

**Perbaikan:**
Menambahkan validasi email/password di server, pesan untuk kredensial salah, email belum dikonfirmasi, terlalu banyak percobaan, dan gangguan koneksi. Cookie menggunakan HttpOnly, SameSite Lax, dan Secure pada produksi. Form menggunakan `useActionState`, tombol dinonaktifkan selama proses, dan hasil error memakai ID toast stabil supaya tidak ganda. Pemeriksaan sesi sebelum Keluar ditambahkan pada US-06.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
`gantiPasswordAdmin` memverifikasi pengguna yang sedang login dengan `supabase.auth.getUser()` sebelum memanggil `updateUser({ password })`. Server memvalidasi isian wajib, panjang minimal 8 karakter, dan kecocokan konfirmasi. Form di `/admin/password` tersambung tanpa perubahan tata letak, catatan belum aktif dihapus, dan hasil sukses/error tampil melalui Sonner. Build dan pengujian Auth simulasi berhasil; password akun asli tidak diubah untuk pengujian.

**Perbaikan:**
Password tidak di-trim dan tidak dikembalikan dalam hasil Server Action. Menambahkan pesan untuk sesi tidak valid, password terlalu lemah, password sama dengan sebelumnya, kebutuhan verifikasi ulang, batas percobaan, dan gangguan layanan. Toast hasil memakai satu ID yang sama agar hasil sukses menggantikan hasil gagal; efek React yang dijalankan ulang tidak menggandakan toast.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
`proxy.js` melindungi `/admin` dan seluruh turunannya, dengan pengecualian tepat `/admin/login`. Sesi diverifikasi ke Supabase menggunakan `getUser()`; pengguna tanpa sesi valid diarahkan ke halaman login. Cookie hasil refresh diteruskan ke permintaan server dan respons browser. `CatatanBelumAktif` di halaman `/admin` dihapus. Build, pemeriksaan redirect HTTP, serta alur browser sebelum login dan setelah logout berhasil dengan Auth simulasi.

**Perbaikan:**
Proteksi juga menolak akses ketika konfigurasi Auth tidak lengkap atau layanan Auth gagal diverifikasi. Cookie dan header cache tetap dibawa saat redirect; respons admin memakai cache privat tanpa penyimpanan. Aksi ganti password sudah memeriksa login, dan aksi Keluar ditambah pemeriksaan login sebelum `signOut`. Aksi tambah/ubah/hapus produk belum dibuat; pemeriksaan login wajib diterapkan saat fitur tersebut dikerjakan.

## Debugging, tambahan, dan fitur bonus

### Komponen shadcn/ui dan Sonner

**Prompt:**
gunakan shadecn, semua error ditampilkan untuk sonner, dan jangan menampilkan error double ingat ini. eksekusi

**Hasil:**
Menambahkan konfigurasi shadcn/ui di `components.json`, komponen Button/Input/Textarea/Toaster di `components/ui`, dan dependensi pendukung. Komponen `Tombol` dan `Input` memakai komponen UI tersebut sambil mempertahankan token warna proyek. Satu Toaster dipasang di `app/layout.jsx`. Error katalog, error halaman, serta validasi form memakai Sonner. Preferensi ini dicatat di `AGENTS.md`.

**Perbaikan:**
Pesan error inline katalog diganti dengan toast. `lib/toast.js` menjadi tempat pemanggilan toast, sementara `ErrorToast` memakai ID stabil dan penjagaan efek agar tidak tampil dua kali. `FormDenganToast` menonaktifkan popup validasi bawaan dan hanya melaporkan field invalid pertama. Validasi form kosong dan login salah berulang diperiksa di browser: hanya satu toast untuk kejadian yang sama.

**Status bonus:**
Ini penyesuaian UI tambahan dari pengguna. US-07 kemudian dikerjakan pada bagian tersendiri di jurnal ini; US-08 juga telah dikerjakan pada bagian tersendiri; US-09 juga telah dikerjakan pada bagian tersendiri; US-10 sampai US-14 belum dikerjakan.

### Diagnosis produk tidak muncul: jenis kunci Supabase salah

**Prompt:**
kenapa produk tidak muncul?

**Hasil:**
Pemeriksaan menemukan `SUPABASE_SECRET_KEY` berisi publishable key. Dengan aturan RLS proyek ini, kunci tersebut tanpa sesi login tidak boleh membaca produk. Ini dapat membuat hasil query kosong walaupun tabel berisi data.

**Perbaikan:**
Pengguna diarahkan mengganti nilai `SUPABASE_SECRET_KEY` dengan secret key proyek Supabase yang sama, lalu menjalankan ulang aplikasi. Nilai rahasia tidak dicetak atau dicatat dalam jurnal. Agent tidak mengganti kunci sendiri. Pemeriksaan query pada saat diagnosis terhambat jaringan; pada pengerjaan US-02 berikutnya, detail produk ID `1` berhasil dibaca dari database.

### Build Turbopack terhambat izin port lingkungan

**Prompt terkait:**
Pengerjaan dan pemeriksaan US-01.

**Hasil:**
`npm run build` dengan Turbopack gagal pada pemrosesan CSS karena lingkungan menolak pembukaan port lokal (`Operation not permitted`). Pengulangan dengan izin eksekusi yang lebih luas masih mengalami kendala yang sama.

**Perbaikan:**
Menjalankan `npm run build -- --webpack` sebagai alternatif pemeriksaan build. Build berhasil, termasuk setelah fitur-fitur berikutnya dikerjakan. Ini solusi untuk pemeriksaan di lingkungan tersebut; script build bawaan pada `package.json` tidak diganti.

### Penanganan ID detail produk tidak valid

**Prompt terkait:**
US-02: produk tidak ditemukan harus memanggil `notFound()`.

**Hasil:**
URL seperti `/produk/abc` atau ID di atas batas bigint tidak diteruskan ke query database dan menampilkan halaman tidak ditemukan.

**Perbaikan:**
Menambahkan pemeriksaan format ID dan batas bigint sebelum query. Pemeriksaan HTTP menunjukkan respons 404 untuk ID tidak valid maupun ID valid yang tidak memiliki produk. Gangguan koneksi database tetap diperlakukan sebagai error layanan, bukan sebagai produk tidak ditemukan.

### Format respons Auth simulasi tidak sesuai SDK

**Prompt terkait:**
Pengujian US-04: login gagal harus menampilkan pesan yang jelas.

**Hasil:**
Pada pengujian browser awal, layanan Auth simulasi mengembalikan kode kesalahan pada field `code` tanpa header versi API, sehingga SDK tidak mengenalinya sebagai `invalid_credentials` dan menampilkan pesan login gagal umum.

**Perbaikan:**
Memperbaiki respons layanan simulasi menjadi `error_code` sesuai dukungan SDK yang terpasang. Pengujian ulang menampilkan “Email atau password salah. Silakan periksa dan coba lagi.” dengan tepat satu toast. Perubahan ini hanya pada alat uji sementara, bukan pada konfigurasi Supabase asli.

### Pemeriksaan redirect Next.js memakai URL relatif

**Prompt terkait:**
Pengujian US-06: rute admin tanpa login diarahkan ke `/admin/login`.

**Hasil:**
Pemeriksaan HTTP awal mengharapkan header Location berupa URL absolut, sedangkan Next.js mengembalikan `/admin/login` sebagai URL relatif. Status redirect sudah benar, tetapi assertion alat uji terlalu ketat.

**Perbaikan:**
Menormalisasi nilai Location terhadap alamat server lokal sebelum memeriksa tujuan redirect. Pengujian ulang lulus untuk `/admin`, `/admin/password`, `/admin/produk/baru`, `/admin/produk/1/ubah`, dan `/admin/login/extra`. `/admin/login` tetap bisa dibuka tanpa login. Tidak ada perubahan perilaku aplikasi untuk koreksi alat uji ini.

## US-07 List produk admin dari database

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-07.

hubungan produk dengan database di halaman admin

**Hasil:**
Halaman `/admin` mengambil daftar tabel `produk` dari Supabase di server memakai koneksi sesi admin, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, dan cookie login. Pengguna diverifikasi dengan `getUser()` sebelum query; query tetap mengikuti RLS. Data ditampilkan dengan `TabelProduk` yang sudah ada, diurutkan berdasarkan `created_at` dari yang terbaru, tanpa mengubah tampilannya. Data contoh tidak lagi digunakan pada daftar admin.

**Perbaikan:**
Menambahkan mode `readOnly` pada `lib/supabase/session.js` agar Server Component tidak mencoba menulis cookie; penulisan dan refresh cookie tetap ditangani Server Action serta proxy. Tabel kosong menampilkan “Belum ada produk”. Kegagalan query menampilkan satu toast Sonner tanpa error inline atau fallback data contoh.

**Verifikasi:**
Build `npm run build -- --webpack` berhasil. Pengujian login/logout dan ganti password simulasi tetap lulus setelah perubahan koneksi sesi. Browser dengan Auth dan database simulasi memperlihatkan produk dari API, pesan tabel kosong, serta tepat satu toast saat query gagal. Daftar admin dengan sesi akun Supabase asli belum diuji pada pengerjaan US-07 ini.

**File diubah:**
`app/admin/page.jsx`, `lib/supabase/session.js`, dan `PROMPTS.md`.


## US-08 Tambah produk

**Prompt:**
Hubungkan form tambah produk ke tabel `produk` melalui Server Action. Gunakan sesi cookie admin dan publishable key, verifikasi login sebelum insert, validasi nama/harga/link foto di server, pertahankan isian saat gagal, tampilkan satu toast error, lalu revalidate katalog/admin dan kembali ke `/admin` setelah berhasil. Jangan mengubah skema/RLS, memasang paket, atau menjalankan Git.

**Hasil:**
`tambahProdukAdmin` di `app/admin/actions.js` memakai `buatSupabaseSession`, memanggil `getUser()` sebelum insert, dan menyimpan hanya `nama`, `harga`, `deskripsi`, `foto_url`, serta `kategori`. ID dan waktu dibuat diisi database. Hasil insert diperiksa sebelum revalidate `/admin` dan `/`, kemudian redirect ke `/admin`. Catatan belum aktif pada halaman tambah dihapus.

**Perbaikan:**
`lib/validasi-produk.js` memvalidasi nama setelah trim dan harga bulat 0–2.147.483.647, dengan harga kosong tetap ditolak. Link foto dibatasi HTTP/HTTPS atau path `/produk/...`; path keluar direktori, protokol lain, dan format field yang tidak valid ditolak. Field opsional kosong disimpan sebagai null. `FormProduk` menerima Action agar dapat dipakai kembali pada US-09; field terkontrol mempertahankan isian saat gagal. Tombol Simpan dinonaktifkan selama proses, error tampil sekali lewat Sonner. Form ubah yang belum tersambung tidak memakai Action tambah.

**Verifikasi:**
Build Webpack berhasil. Pengujian Supabase simulasi memeriksa penolakan tanpa login, harga kosong/pecahan/negatif/melebihi integer, link foto tidak valid, field opsional, kolom insert, kegagalan insert, revalidate, serta redirect. Browser simulasi membuktikan harga 0 diterima, seluruh isian tetap tersimpan ketika insert gagal, tepat satu toast tampil, dan insert berhasil kembali ke `/admin`. Pengujian tidak menambahkan produk ke Supabase asli.

**File diubah:**
`app/admin/actions.js`, `app/admin/produk/baru/page.jsx`, `components/FormProduk.jsx`, `lib/validasi-produk.js`, dan `PROMPTS.md`.

**Cara tes database asli:**
Login, buka `/admin/produk/baru`, isi produk uji dengan nama yang jelas, harga 0 atau harga valid lain, lalu Simpan produk. Cocokkan baris pada `/admin`, katalog, dan Supabase. Tanpa login, halaman harus dialihkan ke login; pengujian Action simulasi juga memastikan insert tidak dipanggil tanpa sesi valid.


## US-09 Ubah produk

**Prompt:**
Hubungkan halaman `/admin/produk/[id]/ubah` dan form ke Supabase dengan sesi admin, validasi ID bigint serta login di server, gunakan validasi field US-08, pertahankan isian saat gagal, lalu revalidate admin/katalog/detail dan kembali ke `/admin` setelah update berhasil. Hapus catatan belum aktif, pertahankan tampilan serta tombol Batal, dan jangan mengubah RLS/skema.

**Hasil:**
Halaman ubah tetap Server Component, memakai `await params`, koneksi cookie admin read-only, dan query produk berdasarkan ID. Form terisi dari database dan Action `ubahProdukAdmin` dihubungkan melalui bind ID. Harga 0 dan field opsional kosong didukung oleh FormProduk yang sudah ada. Catatan US-09 dihapus.

**Perbaikan:**
Helper `lib/validasi-id-produk.js` memvalidasi string ID positif dalam batas bigint, digunakan oleh halaman serta Action. ID invalid atau produk tidak ada memanggil `notFound()` di halaman. Action memverifikasi `getUser()` sebelum update, memakai helper validasi field US-08, dan memperbarui hanya kolom produk yang diizinkan dengan filter ID; ID dan created_at tidak diubah. Update tanpa hasil tidak dianggap berhasil. Error memakai satu toast dan isian tetap tersimpan. Setelah berhasil, `/admin`, `/`, serta `/produk/<id>` direvalidate sebelum redirect.

**Verifikasi:**
Build Webpack berhasil. Pengujian Action dengan Supabase simulasi memeriksa login wajib, ID invalid/melebihi bigint, validasi field, kolom yang diperbarui dan filter ID, kegagalan query, produk hilang, revalidation dan redirect. Browser simulasi memverifikasi pengisian harga 0 serta field kosong, isian tetap utuh saat update gagal, satu toast error, redirect sukses, dan halaman tidak ditemukan untuk produk yang tidak tersedia. US-08 diuji ulang untuk memastikan tambah produk tetap bekerja. Tidak ada produk pada Supabase asli yang diubah dalam pengujian ini.

**File diubah:**
`app/admin/actions.js`, `app/admin/produk/[id]/ubah/page.jsx`, `lib/validasi-id-produk.js`, dan `PROMPTS.md`.

**Cara tes database asli:**
Login, pilih Ubah pada produk uji, ubah nama/harga/deskripsi, lalu simpan. Periksa perubahan pada admin, katalog, dan detail produk. Coba ID tidak valid/tidak ada, harga invalid, serta akses tanpa login. Gunakan produk uji untuk menghindari perubahan produk toko yang sedang dipakai.
