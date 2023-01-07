export const shortenWalletAddress = (address: string) =>
  `0x${address.slice(2, 5)}....${address.slice(-4)}`;
