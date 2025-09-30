import { envConfig } from '~/config/env';
import idl from './bid_to_feature_smart_contract.json';
import type { Idl } from '@coral-xyz/anchor';
import { BorshAccountsCoder, BorshInstructionCoder } from '@coral-xyz/anchor';
import { createSolanaRpc, address } from '@solana/kit';
import {
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
  Connection,
} from '@solana/web3.js';

interface Wallet {
  sendTransaction: (
    transaction: Transaction,
    connection: Connection
  ) => Promise<{ signature: string }>;
}

interface SmartContractHook {
  getSolBalance: (walletAddress: string) => Promise<number>;
  getBidderBalance: (bidder: PublicKey) => Promise<number>;
  getFeaturedCategoryTopBidders: (
    categoryName: string
  ) => Promise<{ categoryPda: PublicKey; categoryAccount: any }>;
  createCategory: (payer: PublicKey, name: string) => Promise<Transaction>;
  placeBid: (
    bidder: PublicKey,
    categoryName: string,
    amount: bigint
  ) => Promise<Transaction>;
  initializeEscrow: (
    initializer: PublicKey,
    amount: bigint
  ) => Promise<Transaction>;
  withdraw: (bidder: PublicKey, amount: bigint) => Promise<Transaction>;
  closeBid: (
    authority: PublicKey,
    categoryName: string,
    baseName: string,
    bidder1: PublicKey,
    bidder2: PublicKey,
    bidder3: PublicKey
  ) => Promise<Transaction>;
  sendTransaction: (
    transaction: Transaction,
    connection: Connection,
    wallet: Wallet
  ) => Promise<string>;
}

const useSmartContract = (): SmartContractHook => {
  const rpc = createSolanaRpc(envConfig.RPC_ENDPOINT);
  const coder = new BorshAccountsCoder(idl as Idl);
  const ixCoder = new BorshInstructionCoder(idl as Idl);

  const getSolBalance = async (walletAddress: string): Promise<number> => {
    try {
      if (!PublicKey.isOnCurve(new PublicKey(walletAddress))) {
        throw new Error('Invalid wallet address');
      }
      const result = await rpc.getBalance(address(walletAddress)).send();
      return Number(result.value) / 1_000_000_000;
    } catch (error) {
      throw new Error(
        `Failed to fetch balance: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const getBidderBalance = async (bidder: PublicKey): Promise<number> => {
    try {
      const [bidderPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('bidder_account'), bidder.toBuffer()],
        new PublicKey(idl.address)
      );
      const accountInfo = await rpc
        .getAccountInfo(address(bidderPda.toString()), {
          encoding: 'base64',
        })
        .send();
      if (!accountInfo.value) throw new Error('Bidder account not found');
      const [data] = accountInfo.value.data;
      const rawData = Buffer.from(data, 'base64');
      const bidderAccount = coder.decode('bidderAccount', rawData);
      return Number(bidderAccount.amount);
    } catch (error) {
      throw new Error(
        `Failed to fetch bidder balance: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const getFeaturedCategoryTopBidders = async (categoryName: string) => {
    try {
      if (categoryName.length > 50) throw new Error('Category name too long');
      const [categoryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('featured_category'), Buffer.from(categoryName)],
        new PublicKey(idl.address)
      );

      const accountInfo = await rpc
        .getAccountInfo(address(categoryPda.toString()), {
          encoding: 'base64',
        })
        .send();

      if (!accountInfo.value) throw new Error('Category account not found');

      const [data] = accountInfo.value.data;
      const rawData = Buffer.from(data, 'base64');
      const categoryAccount = coder.decode('featuredCategory', rawData);

      return { categoryPda, categoryAccount };
    } catch (error) {
      throw new Error(
        `Failed to fetch category data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const createCategory = async (payer: PublicKey, name: string) => {
    try {
      if (name.length > 50) throw new Error('Category name too long');
      const [categoryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('featured_category'), Buffer.from(name)],
        new PublicKey(idl.address)
      );

      const data = ixCoder.encode('createCategory', { name });
      const ix = new TransactionInstruction({
        programId: new PublicKey(idl.address),
        keys: [
          { pubkey: categoryPda, isSigner: false, isWritable: true },
          { pubkey: payer, isSigner: true, isWritable: true },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        data,
      });

      return new Transaction().add(ix);
    } catch (error) {
      throw new Error(
        `Failed to create category transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const placeBid = async (
    bidder: PublicKey,
    categoryName: string,
    amount: bigint
  ) => {
    try {
      if (categoryName.length > 50) throw new Error('Category name too long');
      if (amount <= 0) throw new Error('Bid amount must be positive');
      const [bidderPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('bidder_account'), bidder.toBuffer()],
        new PublicKey(idl.address)
      );
      const [categoryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('featured_category'), Buffer.from(categoryName)],
        new PublicKey(idl.address)
      );

      const data = ixCoder.encode('placeBid', { categoryName, amount });
      const ix = new TransactionInstruction({
        programId: new PublicKey(idl.address),
        keys: [
          { pubkey: bidder, isSigner: true, isWritable: true },
          { pubkey: bidderPda, isSigner: false, isWritable: true },
          { pubkey: categoryPda, isSigner: false, isWritable: true },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        data,
      });

      return new Transaction().add(ix);
    } catch (error) {
      throw new Error(
        `Failed to create bid transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const initializeEscrow = async (initializer: PublicKey, amount: bigint) => {
    try {
      if (amount <= 0) throw new Error('Escrow amount must be positive');
      const [escrowPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('escrow'), initializer.toBuffer()],
        new PublicKey(idl.address)
      );

      const data = ixCoder.encode('initialize', { amount });
      const ix = new TransactionInstruction({
        programId: new PublicKey(idl.address),
        keys: [
          { pubkey: initializer, isSigner: true, isWritable: true },
          { pubkey: escrowPda, isSigner: false, isWritable: true },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        data,
      });

      return new Transaction().add(ix);
    } catch (error) {
      throw new Error(
        `Failed to create escrow transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const withdraw = async (bidder: PublicKey, amount: bigint) => {
    try {
      if (amount <= 0) throw new Error('Withdrawal amount must be positive');
      const [bidderPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('bidder_account'), bidder.toBuffer()],
        new PublicKey(idl.address)
      );

      const data = ixCoder.encode('withdraw', { amount });
      const ix = new TransactionInstruction({
        programId: new PublicKey(idl.address),
        keys: [
          { pubkey: bidder, isSigner: true, isWritable: true },
          { pubkey: bidderPda, isSigner: false, isWritable: true },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        data,
      });

      return new Transaction().add(ix);
    } catch (error) {
      throw new Error(
        `Failed to create withdraw transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const closeBid = async (
    authority: PublicKey,
    categoryName: string,
    baseName: string,
    bidder1: PublicKey,
    bidder2: PublicKey,
    bidder3: PublicKey
  ) => {
    try {
      if (categoryName.length > 50 || baseName.length > 50)
        throw new Error('Category name too long');
      const [tempCategoryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('featured_category'), Buffer.from(categoryName)],
        new PublicKey(idl.address)
      );
      const [mainCategoryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('featured_category'), Buffer.from(baseName)],
        new PublicKey(idl.address)
      );
      const [bidderPda1] = PublicKey.findProgramAddressSync(
        [Buffer.from('bidder_account'), bidder1.toBuffer()],
        new PublicKey(idl.address)
      );
      const [bidderPda2] = PublicKey.findProgramAddressSync(
        [Buffer.from('bidder_account'), bidder2.toBuffer()],
        new PublicKey(idl.address)
      );
      const [bidderPda3] = PublicKey.findProgramAddressSync(
        [Buffer.from('bidder_account'), bidder3.toBuffer()],
        new PublicKey(idl.address)
      );

      const data = ixCoder.encode('closeBid', { categoryName, baseName });
      const ix = new TransactionInstruction({
        programId: new PublicKey(idl.address),
        keys: [
          { pubkey: tempCategoryPda, isSigner: false, isWritable: true },
          { pubkey: mainCategoryPda, isSigner: false, isWritable: true },
          { pubkey: bidderPda1, isSigner: false, isWritable: true },
          { pubkey: bidderPda2, isSigner: false, isWritable: true },
          { pubkey: bidderPda3, isSigner: false, isWritable: true },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
          { pubkey: authority, isSigner: true, isWritable: false },
        ],
        data,
      });

      return new Transaction().add(ix);
    } catch (error) {
      throw new Error(
        `Failed to create close bid transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const sendTransaction = async (
    transaction: Transaction,
    connection: Connection,
    wallet: Wallet
  ): Promise<string> => {
    try {
      const { signature } = await wallet.sendTransaction(
        transaction,
        connection
      );

      const latestBlockhash = await connection.getLatestBlockhash();

      await connection.confirmTransaction(
        {
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        'confirmed'
      );

      return signature;
    } catch (error) {
      throw new Error(
        `Failed to send transaction: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  return {
    getSolBalance,
    getBidderBalance,
    getFeaturedCategoryTopBidders,
    createCategory,
    placeBid,
    initializeEscrow,
    withdraw,
    closeBid,
    sendTransaction,
  };
};

export default useSmartContract;
