import { Address } from "viem";
import { sepolia } from "viem/chains";

export const chainConfig = {
  chain: sepolia,
  contracts: {
    marketplace: "0xFd5298030e11AF7Fa90b868C82be164cAC12213f" as Address,
  },
};
