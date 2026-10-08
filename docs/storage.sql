-- Konfigurasi foto katalog. Jalankan manual di SQL Editor Supabase.
-- Tidak mengubah skema atau RLS tabel produk. Foto di bucket ini bersifat publik.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('foto-produk', 'foto-produk', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Path foto: <id pengguna>/<uuid>.<ext>, hanya sesi pemilik yang boleh menulis.
drop policy if exists "foto_produk_insert_pemilik" on storage.objects;
create policy "foto_produk_insert_pemilik" on storage.objects
for insert to authenticated with check (
  bucket_id = 'foto-produk' and (storage.foldername(name))[1] = (select auth.uid())::text
);
drop policy if exists "foto_produk_select_pemilik" on storage.objects;
create policy "foto_produk_select_pemilik" on storage.objects
for select to authenticated using (
  bucket_id = 'foto-produk' and (storage.foldername(name))[1] = (select auth.uid())::text
);
drop policy if exists "foto_produk_delete_pemilik" on storage.objects;
create policy "foto_produk_delete_pemilik" on storage.objects
for delete to authenticated using (
  bucket_id = 'foto-produk' and (storage.foldername(name))[1] = (select auth.uid())::text
);
