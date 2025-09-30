import { envConfig } from "~/config/env";
import idl from "./bid_to_feature_smart_contract.json";
import type { Idl } from "@coral-xyz/anchor";
import { BorshAccountsCoder, BorshInstructionCoder } from "@coral-xyz/anchor";
import { createSolanaRpc, address } from "@solana/kit";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

interface SmartContractHook {
  getSolBalance: (walletAddress: string) => Promise<number>;
  getFeaturedCategoryTopBidders: (
    categoryName: string
  ) => Promise<{ categoryPda: PublicKey; categoryAccount: any }>;
  createCategory: (payer: PublicKey, name: string) => Promise<Transaction>;
  placeBid: (
    bidder: PublicKey,
    categoryName: string,
    amount: number
  ) => Promise<Transaction>;
  initializeEscrow: (
    initializer: PublicKey,
    amount: number
  ) => Promise<Transaction>;
}

const useSmartContract = (): SmartContractHook => {
  const rpc = createSolanaRpc(envConfig.RPC_ENDPOINT);
  const coder = new BorshAccountsCoder(idl as Idl);
  const ixCoder = new BorshInstructionCoder(idl as Idl);

  const getSolBalance = async (wallet_address: string): Promise<number> => {
    const result = await rpc.getBalance(address(wallet_address)).send();
    return Number(result.value) / 1_000_000_000;
  };

  const getFeaturedCategoryTopBidders = async (categoryName: string) => {
    const [categoryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("featured_category"), Buffer.from(categoryName)],
      new PublicKey(idl.address)
    );

    const accountInfo = await rpc.getAccountInfo(address(categoryPda.toString()), {
      encoding: "base64",
    }).send();

    if (!accountInfo.value) throw new Error("Account not found");

    const [data] = accountInfo.value.data;
    const rawData = Buffer.from(data, "base64");
    const categoryAccount = coder.decode("featuredCategory", rawData);

    return { categoryPda, categoryAccount };
  };

  // build instruction for "create_category"
  const createCategory = async (payer: PublicKey, name: string) => {
    const [categoryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("featured_category"), Buffer.from(name)],
      new PublicKey(idl.address)
    );

    const data = ixCoder.encode("createCategory", { name });
    const ix = new TransactionInstruction({
      programId: new PublicKey(idl.address),
      keys: [
        { pubkey: categoryPda, isSigner: false, isWritable: true },
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data,
    });

    return new Transaction().add(ix);
  };

  // build instruction for "place_bid"
  const placeBid = async (bidder: PublicKey, categoryName: string, amount: number) => {
    const [bidderPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("bidder_account"), bidder.toBuffer()],
      new PublicKey(idl.address)
    );
    const [categoryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("featured_category"), Buffer.from(categoryName)],
      new PublicKey(idl.address)
    );

    const data = ixCoder.encode("placeBid", { categoryName, amount: BigInt(amount) });
    const ix = new TransactionInstruction({
      programId: new PublicKey(idl.address),
      keys: [
        { pubkey: bidder, isSigner: true, isWritable: true },
        { pubkey: bidderPda, isSigner: false, isWritable: true },
        { pubkey: categoryPda, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data,
    });

    return new Transaction().add(ix);
  };

  // build instruction for "initialize"
  const initializeEscrow = async (initializer: PublicKey, amount: number) => {
    const [escrowPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), initializer.toBuffer()],
      new PublicKey(idl.address)
    );

    const data = ixCoder.encode("initialize", { amount: BigInt(amount) });
    const ix = new TransactionInstruction({
      programId: new PublicKey(idl.address),
      keys: [
        { pubkey: initializer, isSigner: true, isWritable: true },
        { pubkey: escrowPda, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data,
    });

    return new Transaction().add(ix);
  };

  return {
    getSolBalance,
    getFeaturedCategoryTopBidders,
    createCategory,
    placeBid,
    initializeEscrow,
  };
};

export default useSmartContract;
