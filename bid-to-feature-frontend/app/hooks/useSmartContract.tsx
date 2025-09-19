import { createSolanaRpc, address } from "@solana/kit";
import { envConfig } from "~/config/env";
interface SmartContractHook {
  getSolBalance: (walletAddress: string) => Promise<number>;
}

const useSmartContract = (): SmartContractHook => {
  const getSolBalance = async (wallet_address: string): Promise<number> => {
    try {
      const rpc = createSolanaRpc(envConfig.RPC_ENDPOINT);
      const result = await rpc.getBalance(address(wallet_address)).send();

      const lamports = result.value;

      const sol = Number(lamports) / 1_000_000_000;

      return sol;
    } catch (error) {
      console.error("Error fetching balance:", error);
      throw error;
    }
  };

  return {
    getSolBalance,
  };
};

export default useSmartContract;
