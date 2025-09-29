import {
  Program,
  AnchorProvider,
  setProvider,
  workspace,
  web3,
  BN,
} from "@coral-xyz/anchor";
import { BidToFeatureSmartContract } from "../target/types/bid_to_feature_smart_contract";
import { expect } from "chai";

describe("bid-to-feature-smart-contract", () => {
  const provider = AnchorProvider.env();
  setProvider(provider);
  const program = workspace
    .BidToFeatureSmartContract as Program<BidToFeatureSmartContract>;

  // PDAs
  const [escrowPDA] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  const categoryName = "Music";
  const [categoryPDA] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("featured_category"), Buffer.from(categoryName)],
    program.programId
  );

  const [bidderPDA] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("bidder_account"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  it("Initializes escrow", async () => {
    const amount = new BN(1_000_000_000);
    await program.methods
      .initialize(amount)
      .accounts({
        initializer: provider.wallet.publicKey,
      })
      .rpc();

    const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA);

    expect(escrowAccount.isActive).to.be.true;
    expect(escrowAccount.initializer.toBase58()).to.equal(
      provider.wallet.publicKey.toBase58()
    );
    expect(escrowAccount.amount.toString()).to.equal(amount.toString());
  });

  it("Creates a category", async () => {
    await program.methods
      .createCategory(categoryName)
      .accounts({
        featuredCategory: categoryPDA,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const category = await program.account.featuredCategory.fetch(categoryPDA);

    expect(category.name).to.equal(categoryName);
    expect(category.top3Bids.length).to.equal(0);
  });

  it("Places a bid", async () => {
    const amount = new BN(500);
    await program.methods
      .placeBid(categoryName, amount)
      .accounts({
        bidder: provider.wallet.publicKey,
        featuredCategory: categoryPDA,
      })
      .rpc();

    const bidderAcc = await program.account.bidderAccount.fetch(bidderPDA);
    expect(bidderAcc.amount.toNumber()).to.equal(amount.toNumber());

    const category = await program.account.featuredCategory.fetch(categoryPDA);
    expect(category.top3Bids.length).to.equal(1);
    expect(category.top3Bids[0].amount.toNumber()).to.equal(amount.toNumber());
  });

  it("Withdraws from bidder account", async () => {
    const withdrawAmount = new BN(200);
    await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        bidder: provider.wallet.publicKey,
      })
      .rpc();

    const bidderAcc = await program.account.bidderAccount.fetch(bidderPDA);
    expect(bidderAcc.amount.toNumber()).to.equal(300); // 500 - 200
  });

  it("Closes bid (moves top 3 to main category)", async () => {
    const baseCategoryName = "MainCategory";
    const [mainCategoryPDA] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("featured_category"), Buffer.from(baseCategoryName)],
      program.programId
    );

    // create the main category
    await program.methods
      .createCategory(baseCategoryName)
      .accounts({
        featuredCategory: mainCategoryPDA,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    await program.methods
      .closeBid(categoryName, baseCategoryName)
      .accounts({
        tempCategory: categoryPDA,
        mainCategory: mainCategoryPDA,
        bidder1: bidderPDA,
        bidder2: bidderPDA,
        bidder3: bidderPDA,
      })
      .rpc();

    const mainCategory = await program.account.featuredCategory.fetch(
      mainCategoryPDA
    );
    expect(mainCategory.top3Bids.length).to.be.greaterThan(0);
  });
});
