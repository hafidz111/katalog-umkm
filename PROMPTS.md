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
Ini penyesuaian UI tambahan dari pengguna. US-07 kemudian dikerjakan pada bagian tersendiri di jurnal ini; US-08 juga telah dikerjakan pada bagian tersendiri; US-09 juga telah dikerjakan pada bagian tersendiri; US-10 telah dikerjakan pada bagian tersendiri; US-11 (pencarian) telah dikerjakan pada bagian tersendiri; US-12 (jumlah) telah dikerjakan pada bagian tersendiri; US-13 telah dikerjakan pada bagian tersendiri; US-14 telah diimplementasikan pada bagian tersendiri; panggilan Gemini asli belum terverifikasi.

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


## US-10 Hapus produk

**Prompt:**
Aktifkan tombol Hapus dengan konfirmasi nama produk, verifikasi login dan ID bigint di Server Action, hapus hanya baris yang sesuai, tampilkan hasil melalui Sonner sekali, serta revalidate admin/katalog/detail. Uji memakai produk khusus pengujian tanpa menghapus produk asli toko.

**Hasil:**
`TombolHapusProduk` mempertahankan tombol dan tampilan tabel. Konfirmasi browser menyebut nama produk karena dialog shadcn belum tersedia. Pembatalan berhenti sebelum pemanggilan Action. Tombol dinonaktifkan selama proses dan pengunci tambahan mencegah pengiriman berulang. `hapusProdukAdmin` memakai koneksi sesi cookie dengan publishable key, memverifikasi `getUser()`, dan memvalidasi ID menggunakan helper bigint yang sudah ada sebelum query delete dengan filter ID.

**Perbaikan:**
Delete meminta ID baris yang benar-benar dihapus; hasil kosong, termasuk produk yang sudah dihapus, tidak dianggap berhasil. Setelah sukses, `/admin`, `/`, dan `/produk/<id>` direvalidate serta daftar admin direfresh. Hasil ditampilkan langsung melalui helper Sonner dengan ID stabil agar toast tetap muncul ketika baris tabel dilepas dan tidak berlipat. Tidak ada penghapusan foto/Storage, perubahan RLS/skema, paket baru, atau perintah Git.

**Verifikasi:**
Build `npm run build -- --webpack` berhasil. Pengujian Action dengan Supabase simulasi lulus untuk tanpa login, ID invalid/melebihi batas bigint, filter ID tunggal, kegagalan database, hasil kosong/sudah dihapus, sukses, dan revalidation ketiga halaman. Pengujian handler tombol dengan React/konfirmasi/Action simulasi lulus untuk konfirmasi nama produk, batal tanpa Action, pencegahan submit ganda, satu pemanggilan toast per hasil, refresh sukses, serta gagal tanpa refresh. Data uji bernama “Produk uji hapus simulasi”, ID 42, hanya berada pada simulasi; tidak ada produk Supabase asli yang dihapus.

**Batas pengujian browser:**
Tabel dan produk uji berhasil dimuat di browser lokal. Saat tombol membuka konfirmasi bawaan, kendali browser mengalami timeout sehingga alur dialog serta toast setelah penghapusan belum terverifikasi di browser. Pengujian handler simulasi digunakan untuk memeriksa alur tersebut. Penghapusan dengan akun dan database Supabase asli belum diuji.

**File diubah:**
`app/admin/actions.js`, `components/TabelProduk.jsx`, `components/TombolHapusProduk.jsx`, dan `PROMPTS.md`.

**Cara tes manual:**
Login dan buat produk khusus pengujian. Klik Hapus, pastikan nama produk muncul, lalu Batal: produk harus tetap ada tanpa toast sukses. Ulangi dan setujui: tombol nonaktif selama proses, produk hilang dari daftar, dan satu toast sukses muncul. Periksa katalog serta detail produk yang dihapus. Untuk gagal database, ID invalid, serta pemanggilan Action tanpa login, pengujian simulasi memastikan tidak ada keberhasilan palsu atau penghapusan tanpa sesi.


## US-11 Pencarian nama produk dan pagination katalog

**Prompt:**
Tambahkan pencarian nama pada katalog publik melalui URL dan query database di server, validasi karakter/panjang, pagination server dengan urutan stabil, pesan kosong yang sesuai, satu toast kegagalan, serta periksa tampilan 390 px. Filter kategori tidak diperlukan.

**Hasil:**
`app/page.jsx` membaca `await searchParams`, menampilkan form GET dengan komponen Input dan Tombol yang tersedia, serta mempertahankan kata pencarian dari URL saat refresh. Form hanya mengirim q sehingga pencarian baru dimulai dari halaman pertama. Tautan Hapus pencarian kembali ke katalog normal. Tampilan KartuProduk tidak diubah.

**Perbaikan:**
Helper server `lib/katalog.js` memvalidasi q sebagai satu string maksimal 100 karakter, menolak karakter kontrol dan parameter berulang, melakukan trim, serta memvalidasi nomor halaman sebagai bilangan bulat positif maksimal enam digit. Pencarian tidak peka huruf besar/kecil memakai filter database `nama imatch` dengan seluruh metakarakter regex di-escape. %, _, *, backslash, tanda kurung, koma, dan kutip diperlakukan sebagai teks literal, bukan wildcard atau ekspresi pencarian. Query mengambil maksimal 12 baris melalui range dan count exact, dengan urutan created_at lalu id menurun. Tautan pagination memakai URLSearchParams untuk mempertahankan q dan encoding. Halaman melebihi jumlah hasil mengambil ulang halaman terakhir dengan query terbatas. Katalog kosong menampilkan “Belum ada produk”; pencarian tanpa hasil menampilkan “Tidak ada produk yang cocok dengan pencarian”. Validasi/query gagal menggunakan ErrorToast dan helper Sonner ber-ID stabil tanpa error inline.

**Verifikasi:**
Build `npm run build -- --webpack` berhasil. Pengujian helper dengan database simulasi lulus untuk hasil/tanpa hasil, q kosong, panjang berlebihan/karakter kontrol/parameter berulang, nomor halaman invalid, karakter khusus literal, pagination 12 baris, urutan ID stabil, halaman di luar rentang, encoding tautan, dan kegagalan query. Browser memakai aplikasi hasil build dan Supabase API simulasi dengan 25 produk: pencarian kopi menghasilkan 14 produk dalam dua halaman (12 dan 2); pindah halaman mempertahankan q dan refresh mempertahankan halaman/isian; perubahan pencarian memulai halaman pertama; karakter khusus cocok satu produk; tanpa hasil menampilkan pesan yang sesuai; Hapus pencarian mengembalikan katalog normal. Kegagalan API menampilkan tepat satu toast Sonner. Pada viewport 390 × 844, screenshot diperiksa dan lebar konten tetap 390 px tanpa overflow horizontal. Pengujian ini tidak membaca atau mengubah database Supabase asli; kecocokan filter pada database asli belum diuji.

**File diubah:**
`app/page.jsx`, `lib/katalog.js`, dan `PROMPTS.md`.

**Cara tes manual:**
Buka `/?q=kopi`, cocokkan hasil dengan nama produk di database, pindah ke Berikutnya lalu refresh. Coba kata yang tidak ada serta nama berisi %, _, *, atau tanda kurung. Ubah kata pencarian dari halaman kedua dan pastikan kembali ke halaman pertama; klik Hapus pencarian untuk katalog normal. Periksa juga layar HP sekitar 390 px. Pagination muncul jika hasil melebihi 12 produk.

## Perbaikan US-11: hapus tombol tambahan dan filter nama/harga

**Prompt:**
Hapus tombol “Hapus pencarian” dan buat filter berdasarkan harga, nama produk, atau keduanya.

**Hasil:**
Tombol Hapus pencarian dihapus; kolom search tetap menyediakan kontrol hapus bawaan browser. FormPencarian memakai Input dan Tombol shadcn yang tersedia, dengan pilihan Nama produk, Harga, dan Keduanya. Pilihan harga membuka kolom nominal rupiah, pilihan keduanya membuka nama serta harga. Harga dicocokkan persis melalui eq di database; keduanya menggabungkan kecocokan nama dan harga (AND). Kolom kosong tidak membatasi hasil. Mode, nama, harga, dan halaman tersimpan dalam URL; submit pencarian kembali ke halaman pertama.

**Perbaikan:**
Validasi server membatasi mode yang diterima, harga bulat 0–2.147.483.647, serta menolak harga negatif/pecahan/melebihi batas. Harga 0 tetap diterapkan sebagai filter. Filter yang tidak sesuai mode diabaikan. Pagination mempertahankan mode dan harga. Error tetap melalui Sonner, query Supabase tetap di server, dan KartuProduk tidak diubah.

**Verifikasi:**
Build Webpack berhasil. Pengujian query simulasi lulus untuk nama, harga, kombinasi AND, harga nol, harga invalid, mode invalid, tautan pagination, dan seluruh pemeriksaan pencarian sebelumnya. Browser dengan database simulasi memverifikasi pergantian mode, pencarian keduanya, pagination/refresh yang mempertahankan filter, submit harga yang kembali ke halaman pertama, dan hasil kosong harga 0. Screenshot viewport 390 × 844 diperiksa tanpa overflow horizontal. Database Supabase asli belum diuji atau diubah.

**File diubah:**
`app/page.jsx`, `lib/katalog.js`, `components/FormPencarian.jsx`, dan `PROMPTS.md`.

**Cara tes:**
Pilih Harga, isi nominal tanpa pemisah (contoh 15000), lalu Cari. Pilih Keduanya, isi nama dan harga, lalu periksa hanya produk yang cocok dengan kedua isian. Pindah halaman dan refresh untuk memastikan isian tetap tersimpan. Kosongkan kolom lalu Cari untuk menghapus batasan pencarian.

## Perbaikan US-11: ikon filter dan checkbox urutan

**Prompt:**
Filter berupa ikon Phosphor sejajar pencarian; klik ikon membuka checkbox urutan nama dan harga.

**Hasil:**
Pilihan mode/kolom harga diganti dengan ikon Funnel SVG lokal bergaya Phosphor tanpa paket tambahan. Ikon berada satu baris dengan kolom pencarian dan tombol Cari. Panel membuka checkbox Nama (A–Z) dan Harga (termurah); keduanya dapat dipilih. Tekan Cari untuk menerapkan. Jika keduanya aktif, prioritas urutan nama kemudian harga, dengan ID sebagai pengikat urutan stabil. Tanpa pilihan, urutan terbaru tetap dipakai. Pencarian nama, urutan, dan pagination tetap melalui server/database dan URL.

**Perbaikan:**
Server hanya menerima urutan nama/harga, menolak nilai tidak dikenal/duplikat, serta menormalkan prioritas. Panel menyediakan label aksesibel, status expanded, dapat ditutup dengan Escape atau perpindahan fokus keluar. Parameter mode/harga lama tidak lagi menjadi filter nominal. Tampilan KartuProduk dipertahankan.

**Verifikasi:**
Build Webpack berhasil. Pengujian helper simulasi memeriksa urutan database nama, harga, kombinasi, ID stabil, validasi urutan, URL pagination, serta pengujian pencarian sebelumnya. Browser simulasi memverifikasi buka panel, centang dua checkbox, submit ke URL, checkbox tetap terpilih setelah pemuatan halaman, dan tautan pagination membawa pilihan. Screenshot 390 px diperiksa dengan lebar konten 390 px tanpa overflow. Mock browser tidak mensimulasikan sortir data; susunan query database diperiksa lewat pengujian helper. Database Supabase asli belum diuji.

**File diubah:**
`components/FormPencarian.jsx`, `components/IkonFilter.jsx`, `app/page.jsx`, `lib/katalog.js`, dan `PROMPTS.md`.

**Cara tes:**
Klik ikon filter di sebelah kolom pencarian, centang Nama atau Harga lalu Cari. Centang keduanya untuk urutan nama kemudian harga. Pindah halaman atau refresh untuk memeriksa pilihan tetap tersimpan. Hapus centang keduanya untuk kembali ke urutan terbaru.

## Perbaikan US-11: checkbox otomatis, debounce, dan label ringkas

**Prompt:**
Checkbox langsung menerapkan filter, pencarian menggunakan debounce, dan hapus teks “Cari nama produk”.

**Hasil:**
Checkbox urutan langsung memanggil navigasi server lewat router.replace; pencarian otomatis setelah 400 ms berhenti mengetik. Timer sebelumnya dibatalkan saat mengetik lagi, memilih urutan, submit, atau komponen dilepas. Tombol Cari/Enter tetap menerapkan segera. URL tetap memuat q dan urutan, perubahan memulai halaman pertama, dan posisi scroll dipertahankan. Label terlihat dihapus; aria-label tetap tersedia untuk aksesibilitas. Instruksi menekan Cari pada panel dihapus/dipersingkat.

**Perbaikan:**
Key yang menyebabkan FormPencarian dimuat ulang setiap URL berubah dihapus agar fokus dan panel tetap terjaga. Isian dikendalikan di client tanpa akses Supabase; query dan validasi tetap pada server. Perubahan URL memakai replace untuk menghindari penumpukan riwayat tiap kata yang diketik.

**Verifikasi:**
Build Webpack berhasil. Browser dengan database simulasi memverifikasi hasil dan URL berubah setelah mengetik tanpa submit, checkbox nama dan harga langsung masuk URL tanpa tombol Cari, panel tetap terbuka setelah centang, dan pengetikan cepat te → teh berakhir pada hasil/URL teh dengan filter tetap aktif. Tampilan 390 px diperiksa melalui screenshot; label terlihat sudah hilang dan fokus kolom tetap ada saat hasil berubah. Database asli belum diuji.

**File diubah:**
`components/FormPencarian.jsx`, `app/page.jsx`, dan `PROMPTS.md`.

## Perbaikan US-11: empat pilihan urutan tanpa checkbox

**Prompt:**
Ganti checkbox dengan pilihan nama A–Z, Z–A, harga termurah, dan harga termahal.

**Hasil:**
Panel ikon filter sekarang menampilkan empat tombol pilihan tunggal. Klik langsung menerapkan, menutup panel, dan mengembalikan fokus ke ikon. Pilihan aktif diberi warna utama. Pencarian debounce 400 ms tetap berlaku. URL menyimpan satu urut: nama-az, nama-za, harga-asc, atau harga-desc. Pagination membawa pilihan tersebut. Server melakukan order nama/harga naik/turun sesuai pilihan, kemudian ID sebagai pengikat stabil. Nilai urut invalid atau berulang ditolak melalui Sonner.

**Verifikasi:**
Build Webpack berhasil. Pengujian helper simulasi lulus untuk keempat pasangan kolom/arah order, ID stabil, validasi pilihan tunggal, tautan pagination, dan seluruh pengujian pencarian sebelumnya. Browser simulasi memverifikasi menu empat pilihan, klik Nama Z–A dan Harga termahal langsung memperbarui URL, panel tertutup, serta pilihan aktif saat dibuka lagi. Screenshot 390 px diperiksa. Mock browser tidak mengurutkan data; query order diverifikasi melalui pengujian helper. Database Supabase asli belum diuji.

**File diubah:**
`components/FormPencarian.jsx`, `lib/katalog.js`, `app/page.jsx`, dan `PROMPTS.md`.

**Cara tes:**
Klik ikon filter lalu pilih salah satu urutan; hasil langsung diperbarui. Coba semua pilihan dan refresh/pindah halaman untuk memastikan pilihan bertahan.


## US-12 Pilihan jumlah sebelum pesan WhatsApp

**Prompt:**
Tambahkan jumlah awal 1, validasi bilangan bulat 1–99, dan sertakan nama, harga satuan, jumlah, total dalam pesan WhatsApp. Pisahkan interaksi dari Server Component, pertahankan tampilan, serta uji tanpa mengirim pesan ke toko.

**Hasil:**
Halaman detail tetap mengambil produk dari Supabase di server dan memberikan id/nama/harga kepada PesananProduk. Komponen client ini hanya menyimpan input jumlah dengan nilai awal 1 memakai Input yang tersedia. Tombol WhatsApp mempertahankan tampilan, nomor toko, encodeURIComponent, target _blank, dan rel noopener noreferrer. Helper pesan menghitung total dari harga server × jumlah valid dan memformat harga satuan serta total dalam rupiah.

**Perbaikan:**
Input disimpan sebagai string agar kosong tidak otomatis menjadi nol dan pecahan/negatif tidak diam-diam dibulatkan. Helper hanya menerima jumlah bulat 1–99. Input kosong, 0, 100, negatif, pecahan, notasi eksponen, atau teks menghasilkan tautan null; tombol tanpa href mencegah navigasi saat klik/Enter/Space serta menampilkan satu error Sonner dengan ID stabil per produk. Tidak ada error inline. Tidak menambah varian, kolom database, penyimpanan pesanan, keranjang, checkout, paket, atau perubahan RLS.

**Verifikasi:**
Build npm run build -- --webpack berhasil. Pengujian helper simulasi lulus untuk jumlah 1, 2, 99, invalid/kosong/pecahan/negatif/di luar batas, harga 0, nomor toko, karakter khusus nama, dan isi pesan decoded. Browser dengan database simulasi memverifikasi jumlah awal 1, jumlah 2 menghasilkan total Rp30.000 dari harga Rp15.000, jumlah 99 menghasilkan Rp1.485.000, input invalid menghilangkan href, serta klik invalid menghasilkan tepat satu toast dan tetap di detail. Atribut tab baru dan rel diperiksa. Harga 0 diverifikasi dari data server simulasi dan pesan decoded (harga satuan/total Rp0). Screenshot detail pada 390 px diperiksa. Tidak ada tautan valid yang diklik, tidak ada pesan dikirim ke toko, dan database Supabase asli tidak diubah.

**File diubah:**
app/produk/[id]/page.jsx, components/PesananProduk.jsx, components/TombolWhatsApp.jsx, lib/pesan-whatsapp.js, dan PROMPTS.md.

**Cara tes:**
Buka detail, periksa jumlah awal 1, ubah menjadi 2 atau 99, lalu periksa href tombol dan decode parameter text untuk mencocokkan harga satuan/jumlah/total. Kosongkan atau isi 0, -1, 1.5, 100 lalu klik tombol: halaman tetap dan satu toast error tampil. Periksa tampilan HP; tidak perlu membuka WhatsApp atau mengirim pesan untuk menguji isi tautan.

## Perbaikan US-12: counter jumlah tersambung dengan input

**Prompt:**
Tambahkan counter; ketika pengguna sedang mengetik, klik tombol counter juga memperbarui jumlah.

**Hasil dan perbaikan:**
PesananProduk menambahkan tombol minus/plus shadcn di sisi input yang dikendalikan satu state. Tombol menggunakan nilai terbaru yang diketik, sehingga mengetik 12 lalu plus menjadi 13, minus menjadi 12; tautan dan total WhatsApp langsung diperbarui. Minus nonaktif pada 1 dan plus nonaktif pada 99. Input invalid tidak dibulatkan atau dikoreksi diam-diam: klik counter menampilkan satu toast melalui ID yang sama dengan validasi pemesanan. Tampilan lain tetap.

**Verifikasi:**
Build Webpack berhasil. Browser database simulasi memverifikasi input 12 → plus 13 (total Rp195.000) → minus 12 (Rp180.000), minus nonaktif pada jumlah awal 1, plus nonaktif pada 99, input kosong menghasilkan tepat satu toast, serta tampilan counter 390 px. Tidak membuka WhatsApp atau mengirim pesan ke toko.

**File diubah:**
components/PesananProduk.jsx dan PROMPTS.md.


## US-13 PWA katalog

**Prompt:**
Jadikan katalog PWA memakai identitas toko, manifest App Router, ikon yang tersedia, service worker tanpa paket, offline fallback network-first, cache aman tanpa admin/Auth/Server Action/sesi, dan versi cache. Bedakan pemeriksaan localhost dari instalasi HTTPS perangkat.

**Hasil:**
app/manifest.js menghasilkan /manifest.webmanifest dengan nama/tagline dari lib/toko.js, start_url dan scope /, display standalone, lang id, warna latar #ffffff dan tema #1f6b4f sesuai token desain. Ikon PNG diperiksa nyata: 192×192 dan 512×512; purpose any, tidak mengklaim maskable. Layout menghubungkan manifest, ikon/aplikasi Apple, themeColor, dan satu komponen registrasi tanpa mengubah tampilan halaman. Registrasi hanya pada production agar pengembangan tidak terpengaruh cache.

**Perbaikan:**
public/sw.js memakai cache katalog-publik-v1, hanya precache offline.html dan dua ikon dengan credentials omit. Navigasi dokumen katalog/detail selalu fetch network-first dengan cache no-store, tanpa menyimpan produk. Network gagal memakai halaman offline yang menyatakan koneksi diperlukan untuk katalog/harga terbaru. HTTP error asli tetap diteruskan. /admin dan turunannya, POST/Server Action, header Next-Action/RSC, API/Auth/Supabase/Gemini, origin lain, serta aset di luar whitelist tidak diintersep/cache. Worker baru membersihkan versi cache milik katalog yang lama, tanpa menghapus cache aplikasi lain. Tidak skipWaiting, tidak ada handler yang memaksa reload, dan tidak ada toast offline berulang. Header sw.js mencegah cache HTTP worker lama. Halaman offline mandiri tanpa dependensi jaringan.

**Verifikasi:**
Build npm run build -- --webpack berhasil. HTTP localhost memverifikasi manifest, nama/display/lang/start_url, metadata, ukuran ikon dari byte PNG, tipe JavaScript/header cache-control worker, dan offline HTML. Simulasi lifecycle worker memverifikasi install whitelist dengan credentials omit, pembersihan versi lama, klaim client tanpa reload, navigasi network-first tanpa menyimpan produk, fallback offline, pengecualian admin/Auth/API/POST/RSC/origin lain, dan ikon cached. Simulasi registrasi memeriksa production-only, scope root, dan updateViaCache none.

Browser memuat aplikasi production dengan Supabase simulasi di localhost, lalu server lokal dihentikan. Refresh / dan navigasi /produk/1 benar-benar menampilkan halaman offline dari service worker, membuktikan registrasi/aktivasi dan cache fallback bekerja pada browser lokal. Navigasi /admin/login saat server mati ditolak koneksi (bukan halaman login tersimpan/fallback), sesuai pengecualian. Screenshot offline 390 px diperiksa. Tidak ada perubahan database asli. Ini pengujian localhost, bukan deployment HTTPS atau instalasi nyata pada HP; pemasangan perangkat dan perilaku instalasi browser/platform belum diuji. Fallback HTML berlaku untuk navigasi dokumen; permintaan RSC navigasi client tetap tidak dicache atau diganti HTML.

**File diubah:**
app/manifest.js, app/layout.jsx, components/DaftarServiceWorker.jsx, public/sw.js, public/offline.html, next.config.mjs, dan PROMPTS.md.

**Cara tes manual:**
Jalankan aplikasi hasil build, buka katalog sekali dengan koneksi, periksa manifest dan worker aktif di DevTools Application. Putuskan jaringan lalu reload katalog/detail: halaman offline muncul tanpa produk lama. Periksa Cache Storage hanya berisi offline.html dan kedua ikon; halaman admin/login dan request POST/Auth tidak boleh masuk. Pada deployment HTTPS, buka di browser HP yang mendukung, gunakan Install/Tambahkan ke layar utama, lalu periksa nama/ikon/standalone. Pengujian instalasi tersebut masih perlu dilakukan pada perangkat nyata.


## US-14 Deskripsi produk AI melalui Gemini

**Prompt:**
Tambahkan Buat deskripsi AI pada form tambah/ubah, Action server wajib getUser, env GEMINI_API_KEY/GEMINI_MODEL, fetch tanpa SDK, validasi input, timeout/error lengkap, konfirmasi penggantian, penolakan hasil lama, dan isian tetap saat gagal. Pertahankan US-08/09 tanpa perubahan database/RLS.

**Hasil:**
Action buatDeskripsiProdukAdmin memeriksa sesi admin melalui getUser sebelum helper Gemini melakukan fetch. Helper hanya mengirim nama/kategori sebagai data JSON, bukan email/password/token admin. Nama wajib terisi setelah trim; panjang maksimal nama 150 dan kategori 100 karakter, karakter kontrol ditolak. API key hanya ada pada header x-goog-api-key di server; endpoint tetap milik Google, model berasal dari env dan dibatasi format ID. Tidak ada SDK/paket baru.

**Dokumentasi resmi diperiksa:**
https://ai.google.dev/api/generate-content dan https://ai.google.dev/gemini-api/docs/models. Endpoint POST v1beta/models/{model}:generateContent memakai contents/parts dan systemInstruction. Contoh model teks gemini-3.5-flash-lite disebut di komentar .env.example; kedua variabel tetap kosong agar pengelola mengisi konfigurasi yang berlaku untuk proyeknya. Tidak memakai NEXT_PUBLIC_.

**Perbaikan:**
Timeout 15 detik mencakup fetch dan pembacaan body; timer dibersihkan. Pesan terkontrol menangani konfigurasi kosong, model/key invalid atau tidak tersedia, limit 429, jaringan, HTTP gagal, respons kosong, prompt diblokir, finishReason tidak tuntas, dan format output tidak sesuai. ErrorDeskripsi memisahkan pesan aman dari exception mentah sehingga rahasia tidak bocor. Prompt meminta 2–3 kalimat Indonesia teks biasa dan melarang mengarang komposisi, sertifikasi, manfaat kesehatan, stok, asal, atau klaim lain yang tidak diberikan. Bagian thought tidak dimasukkan sebagai deskripsi.

Tombol kecil terpisah menonaktifkan dirinya dan memakai guard ref selama proses. Hasil mengisi textarea untuk ditinjau/diedit saja; tidak insert/update otomatis. Jika deskripsi terisi, konfirmasi diperlukan sebelum API; pembatalan mempertahankan teks tanpa Action. Revisi nama/kategori/deskripsi dilacak, termasuk perubahan lalu dikembalikan, agar hasil lama tidak menimpa isian terbaru. Harga/foto terbaru juga dipertahankan saat hasil dimasukkan. Simpan tetap menggunakan Action US-08/09 dan nonaktif selama AI berjalan. Semua kegagalan memakai satu toast ID deskripsi-ai tanpa inline.

**Verifikasi:**
Build npm run build -- --webpack berhasil setelah seluruh perubahan. Simulasi Action/API lulus untuk login wajib tanpa fetch, nama kosong, batas panjang, request minimal/header/endpoint no-store, sukses, timeout, limit, respons kosong, diblokir, jaringan, HTTP gagal, dan konfigurasi kosong. Simulasi handler UI lulus untuk batal konfirmasi tanpa Action, guard permintaan berulang, hasil mengisi textarea saja, revisi berubah ditolak, dan gagal mempertahankan isian dengan ID toast stabil. Pengujian ulang Action US-08 dan US-09 lulus dengan Supabase simulasi.

Browser memakai Auth/database simulasi memverifikasi tombol pada halaman tambah serta ubah; kegagalan konfigurasi menampilkan tepat satu toast dan nama/harga 0/kategori tetap utuh. Screenshot form 390 px diperiksa. GEMINI_API_KEY dan GEMINI_MODEL belum diisi dalam konfigurasi lokal; tidak ada panggilan Gemini asli, perubahan data asli, atau klaim kualitas keluaran model nyata. Prompt membatasi klaim, tetapi admin tetap perlu meninjau hasil sebelum menyimpan.

**File diubah:**
components/FormProduk.jsx, components/TombolDeskripsiAI.jsx, app/admin/actions.js, lib/gemini/deskripsi.js, lib/gemini/error.js, .env.example, dan PROMPTS.md.

**Cara tes manual:**
Isi kedua env server lalu restart aplikasi. Login, buka tambah/ubah, isi nama/kategori, klik Buat deskripsi AI; tinjau/edit textarea lalu gunakan Simpan produk seperti biasa. Saat deskripsi sudah terisi, batalkan konfirmasi untuk memastikan teks bertahan. Ubah nama/kategori saat AI berjalan: hasil lama tidak dimasukkan. Tanpa login Action menolak sebelum API. Error tidak boleh menghapus isian atau muncul dua kali. Ketersediaan model/key dan keluaran Gemini nyata masih perlu diverifikasi setelah konfigurasi tersedia.

## Perbaikan US-14: diagnosis error generate yang terlalu umum

**Laporan:**
Generate gagal dengan “Gemini gagal membuat deskripsi. Silakan coba lagi nanti.”

**Pemeriksaan:**
Konfigurasi lokal kini sudah berisi GEMINI_API_KEY dan GEMINI_MODEL; nilainya tidak ditampilkan. Model gemini-3.8-flash sesuai dokumentasi resmi https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash. Pemeriksaan GET metadata model dengan key lokal menghasilkan HTTP 200 dan generateContent didukung. Ini memverifikasi akses key/model, bukan keberhasilan generate deskripsi. Respons gagal generate yang dilaporkan belum memuat status HTTP, sehingga penyebab pastinya belum bisa ditetapkan.

**Perbaikan:**
lib/gemini/deskripsi.js sekarang menangani alasan API_KEY_INVALID/EXPIRED/SERVICE_BLOCKED dari body error tanpa menampilkan body mentah, key, atau data admin. HTTP 400 menampilkan penolakan request/config, HTTP 5xx menampilkan gangguan layanan beserta kode, dan status lain juga dicantumkan. Tetap satu toast Sonner. Tidak mengubah model/env secara otomatis.

**Verifikasi:**
Build Webpack berhasil. Simulasi API/UI sebelumnya tetap lulus; tambahan tes key invalid HTTP 400, request invalid HTTP 400, dan server HTTP 500 lulus. Pemeriksaan metadata model asli berhasil; generateContent asli belum diuji dari sesi admin pada pengerjaan diagnosis ini. Restart aplikasi dan ulangi tombol AI untuk mendapatkan status error yang spesifik jika kegagalan berlanjut.
