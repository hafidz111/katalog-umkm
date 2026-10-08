export function idProdukValid(id) {
  return typeof id === "string" && /^\d{1,19}$/.test(id) && BigInt(id) > 0n && BigInt(id) <= 9223372036854775807n;
}
