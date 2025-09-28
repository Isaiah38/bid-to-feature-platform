import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BidToFeatureSmartContract } from "../target/types/bid_to_feature_smart_contract";

describe("bid-to-feature-smart-contract", () => {
  // Configure the client to use the local cluster.

  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.BidToFeatureSmartContract as Program<BidToFeatureSmartContract>;

  // Generate a PDA for the escrow account

  const [escrowPDA, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  it("Initializes an escrow PDA and funds it!", async () => {
    const amount = new anchor.BN(1_000_000_000); // 1 SOL in lamports

    const tx = await program.methods
      .initialize(amount)
      .accounts({
        initializer: provider.wallet.publicKey,
      })
      .rpc();

    console.log("Transaction signature:", tx);

    // Fetch the escrow account data
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA);
    console.log("Escrow account data:", escrowAccount);

    // Optional: assert values
    if (!escrowAccount.isActive) {
      throw new Error("Escrow not active!");
    }
    if (!escrowAccount.initializer.equals(provider.wallet.publicKey)) {
      throw new Error("Initializer mismatch!");
    }
    if (!escrowAccount.amount.eq(amount)) {
      throw new Error("Amount mismatch!");
    }

    console.log("Escrow initialized successfully!");
  });
});
