import { createSolanaRpc, address } from "@solana/kit";

const RPC_ENDPOINT =
  "https://devnet.helius-rpc.com/?api-key=2a3fc6c2-631b-422c-8138-4db22f85ece0"; //"http://127.0.0.1:8899"

interface SmartContractHook {
  getSolBalance: (walletAddress: string) => Promise<number>;
}

const useSmartContract = (): SmartContractHook => {
  const getSolBalance = async (wallet_address: string): Promise<number> => {
    try {
      const rpc = createSolanaRpc(RPC_ENDPOINT);
      const result = await rpc.getBalance(address(wallet_address)).send();
      console.log(result);

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
