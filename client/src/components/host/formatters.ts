export const formatShortRupiah = (amount: number): string => {
  if (amount >= 1000000) {
    const jt = amount / 1000000;
    return `Rp ${jt % 1 === 0 ? jt : jt.toFixed(1)}jt`;
  }
  if (amount >= 1000) {
    return `Rp ${amount / 1000}rb`;
  }
  return `Rp ${amount}`;
};
