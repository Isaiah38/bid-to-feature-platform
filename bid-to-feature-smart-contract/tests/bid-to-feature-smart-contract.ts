import {
  Program,
  AnchorProvider,
  setProvider,
  workspace,
  web3,
  BN,
} from '@coral-xyz/anchor';
import { BidToFeatureSmartContract } from '../target/types/bid_to_feature_smart_contract';
import { expect } from 'chai';

describe('bid-to-feature-smart-contract', () => {
  const provider = AnchorProvider.env();
  setProvider(provider);
  const program =
    workspace.BidToFeatureSmartContract as Program<BidToFeatureSmartContract>;

  const bidder1 = provider.wallet;
  const bidder2 = web3.Keypair.generate();
  const bidder3 = web3.Keypair.generate();

  const [escrowPDA] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('escrow'), bidder1.publicKey.toBuffer()],
    program.programId
  );

  const categoryName = 'Music';
  const [categoryPDA] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('featured_category'), Buffer.from(categoryName)],
    program.programId
  );

  const [bidder1PDA] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('bidder_account'), bidder1.publicKey.toBuffer()],
    program.programId
  );

  const [bidder2PDA] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('bidder_account'), bidder2.publicKey.toBuffer()],
    program.programId
  );

  const [bidder3PDA] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('bidder_account'), bidder3.publicKey.toBuffer()],
    program.programId
  );

  const baseCategoryName = 'MainCategory';
  const [mainCategoryPDA] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('featured_category'), Buffer.from(baseCategoryName)],
    program.programId
  );

  before(async () => {
    const tx = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: bidder2.publicKey,
        lamports: web3.LAMPORTS_PER_SOL,
      }),
      web3.SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: bidder3.publicKey,
        lamports: web3.LAMPORTS_PER_SOL,
      })
    );
    await provider.sendAndConfirm(tx, [bidder1.payer]);
  });

  it('Initializes escrow', async () => {
    const amount = new BN(1_000_000_000);
    await program.methods
      .initialize(amount)
      .accounts({
        initializer: bidder1.publicKey,
        EscrowAccount: escrowPDA,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA);

    expect(escrowAccount.isActive).to.be.true;
    expect(escrowAccount.initializer.toBase58()).to.equal(
      bidder1.publicKey.toBase58()
    );
    expect(escrowAccount.amount.toString()).to.equal(amount.toString());
  });

  it('Creates a category', async () => {
    await program.methods
      .createCategory(categoryName)
      .accounts({
        FeaturedCategory: categoryPDA,
        authority: bidder1.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    const category = await program.account.featuredCategory.fetch(categoryPDA);

    expect(category.name).to.equal(categoryName);
    expect(category.top3Bids.length).to.equal(0);
    expect(category.authority.toBase58()).to.equal(
      bidder1.publicKey.toBase58()
    );
  });

  it('Places a bid', async () => {
    const amount = new BN(500);
    await program.methods
      .placeBid(categoryName, amount)
      .accounts({
        bidder: bidder1.publicKey,
        BidderAccount: bidder1PDA,
        FeaturedCategory: categoryPDA,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([bidder1.payer])
      .rpc();

    const bidderAcc = await program.account.bidderAccount.fetch(bidder1PDA);
    expect(bidderAcc.amount.toNumber()).to.equal(amount.toNumber());

    const category = await program.account.featuredCategory.fetch(categoryPDA);
    expect(category.top3Bids.length).to.equal(1);
    expect(category.top3Bids[0].amount.toNumber()).to.equal(amount.toNumber());
  });

  it('Places additional bids for close_bid test', async () => {
    const amount2 = new BN(400);
    await program.methods
      .placeBid(categoryName, amount2)
      .accounts({
        bidder: bidder2.publicKey,
        BidderAccount: bidder2PDA,
        FeaturedCategory: categoryPDA,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([bidder2])
      .rpc();

    const amount3 = new BN(300);
    await program.methods
      .placeBid(categoryName, amount3)
      .accounts({
        bidder: bidder3.publicKey,
        BidderAccount: bidder3PDA,
        FeaturedCategory: categoryPDA,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([bidder3])
      .rpc();

    const category = await program.account.featuredCategory.fetch(categoryPDA);
    expect(category.top3Bids.length).to.equal(3);
    expect(category.top3Bids[0].amount.toNumber()).to.equal(500);
    expect(category.top3Bids[1].amount.toNumber()).to.equal(400);
    expect(category.top3Bids[2].amount.toNumber()).to.equal(300);
  });

  it('Withdraws from bidder account', async () => {
    const withdrawAmount = new BN(200);
    await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        bidder: bidder1.publicKey,
        BidderAccount: bidder1PDA,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([bidder1.payer])
      .rpc();

    const bidderAcc = await program.account.bidderAccount.fetch(bidder1PDA);
    expect(bidderAcc.amount.toNumber()).to.equal(300);
  });

  it('Closes bid (moves top 3 to main category)', async () => {
    await program.methods
      .createCategory(baseCategoryName)
      .accounts({
        FeaturedCategory: mainCategoryPDA,
        authority: bidder1.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([bidder1.payer])
      .rpc();

    await program.methods
      .closeBid(categoryName, baseCategoryName)
      .accounts({
        TempCategory: categoryPDA,
        MainCategory: mainCategoryPDA,
        bidder1Account: bidder1PDA,
        bidder2Account: bidder2PDA,
        bidder3Account: bidder3PDA,
        authority: bidder1.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([bidder1.payer])
      .rpc();

    const mainCategory = await program.account.featuredCategory.fetch(
      mainCategoryPDA
    );
    expect(mainCategory.top3Bids.length).to.equal(3);
    expect(mainCategory.top3Bids[0].amount.toNumber()).to.equal(500);
    expect(mainCategory.top3Bids[1].amount.toNumber()).to.equal(400);
    expect(mainCategory.top3Bids[2].amount.toNumber()).to.equal(300);

    const bidder1Acc = await program.account.bidderAccount.fetch(bidder1PDA);
    const bidder2Acc = await program.account.bidderAccount.fetch(bidder2PDA);
    const bidder3Acc = await program.account.bidderAccount.fetch(bidder3PDA);
    expect(bidder1Acc.amount.toNumber()).to.equal(0);
    expect(bidder2Acc.amount.toNumber()).to.equal(0);
    expect(bidder3Acc.amount.toNumber()).to.equal(0);
  });
});
