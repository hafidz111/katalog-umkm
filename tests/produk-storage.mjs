import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
const context = vm.createContext({crypto:webcrypto, process:{env:{}}, Uint8Array, String, Error, Number, BigInt, URL});
const stub = values => new vm.SyntheticModule(Object.keys(values),function(){for(const [key,value] of Object.entries(values))this.setExport(key,value)}, {context});
const load = async path => new vm.SourceTextModule(await readFile(path,'utf8'),{context});
const foto = await load('lib/supabase/foto-produk.js'); await foto.link(()=>stub({})); await foto.evaluate();
const valid = await load('lib/validasi-produk.js'); await valid.link(()=>{}); await valid.evaluate();
const id = await load('lib/validasi-id-produk.js'); await id.link(()=>{}); await id.evaluate();
let mode='ok', upload=0, writes=0, removed=0, payload;
const invalidated=[];
const client={auth:{getUser:async()=>({data:{user:mode==='logout'?null:{id:'admin-test'}},error:null})},storage:{from(name){assert.equal(name,'foto-produk');return {upload:async(path,bytes,options)=>{upload++;assert.match(path,/^admin-test\/[\w-]+\.png$/);assert.equal(options.upsert,false);return {error:mode==='storage-error'?{}:null}},getPublicUrl:path=>({data:{publicUrl:`https://storage.test/${path}`}}),remove:async()=>{removed++;return {error:null}}}}},from(table){assert.equal(table,'produk');return {select:()=>({eq:()=>({maybeSingle:async()=>({data:mode==='missing'?null:{id:1,foto_url:mode==='no-photo'?null:'/produk/kopi.svg'},error:null})})}),insert(data){writes++;payload=data;return {select:()=>({single:async()=>({data:mode==='db-error'?null:{id:1},error:mode==='db-error'?{}:null})})}},update(data){writes++;payload=data;return {eq:()=>({select:()=>({maybeSingle:async()=>({data:mode==='db-error'?null:{id:1},error:mode==='db-error'?{}:null})})})}}}}};
const actions = await load('app/admin/actions.js'); await actions.link(name=>({
 '@/lib/notifikasi-admin':stub({simpanNotifikasiAdmin:async()=>{},konsumsiNotifikasiAdmin:async()=>null}),
 '@/lib/supabase/foto-produk':foto, '@/lib/validasi-produk':valid, '@/lib/validasi-id-produk':id,
 '@/lib/supabase/session':stub({buatSupabaseSession:async()=>client}),
 '@/lib/ai/error':stub({ErrorDeskripsi:class extends Error{}}), '@/lib/ai/deskripsi':stub({buatDeskripsiAI:async()=>''}),
 'next/cache':stub({revalidatePath:path=>invalidated.push(path)}), 'next/navigation':stub({redirect:path=>{throw new Error(`redirect:${path}`)}})
})[name]);await actions.evaluate();
const form=(file=true)=>{const f=new FormData();f.set('nama',' Produk uji ');f.set('harga','0');f.set('kategori','Minuman');f.set('deskripsi','Deskripsi produk uji');if(file)f.set('foto',new Blob([new Uint8Array([137,80,78,71,13,10,26,10,1])],{type:'image/png'}),'foto.png');return f;};
const add=actions.namespace.tambahProdukAdmin, edit=actions.namespace.ubahProdukAdmin;
mode='logout';assert.match((await add({},form())).pesan,/masuk kembali/);assert.match((await edit('1',{},form())).pesan,/masuk kembali/);assert.equal(upload,0);assert.equal(writes,0);
mode='ok';assert.match((await edit('invalid',{},form())).pesan,/ID/);assert.equal(upload,0);
for(const [field,value] of [['nama',' '],['harga',''],['harga','-1'],['harga','1.2'],['harga','2147483648'],['kategori',' '],['deskripsi',' ']]){const f=form();f.set(field,value);assert.ok((await add({},f)).pesan)}assert.equal(upload,0);
const spoof=form();spoof.set('foto',new Blob(['not png'],{type:'image/png'}),'fake.png');assert.match((await add({},spoof)).pesan,/Isi file/);assert.equal(upload,0);
const large=form();large.set('foto',new Blob([new Uint8Array(3145729)],{type:'image/png'}),'large.png');assert.match((await add({},large)).pesan,/3 MB/);assert.equal(upload,0);
const svg=form();svg.set('foto',new Blob(['<svg/>'],{type:'image/svg+xml'}),'file.svg');assert.match((await add({},svg)).pesan,/JPG/);
assert.match((await add({},form(false))).pesan,/Foto produk wajib/);
mode='no-photo';assert.match((await edit('1',{},form(false))).pesan,/Foto produk wajib/);
mode='ok';const removedPhoto=form(false);removedPhoto.set('hapus_foto','1');assert.match((await edit('1',{},removedPhoto)).pesan,/Foto produk wajib/);
mode='storage-error';assert.match((await add({},form())).pesan,/mengunggah/);assert.equal(writes,0);
mode='ok';await assert.rejects(add({},form()),/redirect:\/admin/);assert.equal(payload.harga,0);assert.equal(payload.nama,'Produk uji');assert.match(payload.foto_url,/storage.test/);assert.equal(payload.kategori,'Minuman');
await assert.rejects(edit('1',{},form(false)),/redirect:\/admin/);assert.ok(!('foto_url' in payload));
mode='missing';const before=upload;assert.match((await edit('1',{},form())).pesan,/tidak ditemukan/);assert.equal(upload,before);
mode='db-error';assert.match((await add({},form())).pesan,/Gagal menyimpan/);assert.equal(removed,1);
mode='ok';await assert.rejects(edit('1',{},form()),/redirect:\/admin/);assert.match(payload.foto_url,/storage.test/);assert.ok(invalidated.includes('/produk/1'));
console.log('Lulus (simulasi): auth, ID, seluruh field wajib, foto wajib tambah/ubah, harga 0, file palsu/ukuran/tipe, upload gagal, insert/update, mempertahankan foto lama, produk hilang, cleanup upload baru, revalidate.');
