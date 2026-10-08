export default function IlustrasiProdukKosong({ pencarian = false }) {
  return <svg viewBox="0 0 240 160" fill="none" aria-hidden="true" className="h-40 w-60 max-w-full text-utama">
    <ellipse cx="120" cy="142" rx="88" ry="10" className="fill-permukaan" />
    <path d="M52 49h128v88H52z" className="fill-latar stroke-garis" strokeWidth="2" />
    <path d="M45 49 59 24h114l14 25" className="fill-permukaan stroke-garis" strokeWidth="2" strokeLinejoin="round" />
    <path d="M45 49v8c0 8 16 8 16 0 0 8 16 8 16 0 0 8 16 8 16 0 0 8 16 8 16 0 0 8 16 8 16 0 0 8 16 8 16 0 0 8 16 8 16 0 0 8 16 8 16 0 0 8 14 8 14 0v-8" className="stroke-utama" strokeWidth="2" />
    <path d="M67 77h96v34H67z" className="fill-permukaan" />
    <path d="M77 97h76M83 87h17m29 0h18" className="stroke-garis" strokeWidth="3" strokeLinecap="round" />
    <path d="M97 137v-13h37v13" className="stroke-garis" strokeWidth="2" />
    {pencarian ? <g><circle cx="170" cy="104" r="24" className="fill-latar stroke-utama" strokeWidth="3" /><path d="m188 122 19 19M161 104h18" className="stroke-utama" strokeWidth="4" strokeLinecap="round" /></g>
      : <g><path d="m114 82 13 7v18l-13 7-13-7V89z" className="fill-latar stroke-utama" strokeWidth="2" /><path d="m101 89 13 7 13-7m-13 7v18" className="stroke-utama" strokeWidth="2" strokeLinejoin="round" /></g>}
  </svg>;
}
