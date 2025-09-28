#![allow(deprecated)]
#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

use anchor_lang::solana_program::system_instruction;
declare_id!("A4tegPx6662aYdJANarfVQufCwtWcELiGtR56KhqogR9");

#[program]
pub mod smart_contract {

    use super::*;

    pub fn initialize_feature(ctx: Context<InitializeFeature>, min_bid: u64) -> Result<()> {
        let feature = &mut ctx.accounts.feature;
        feature.min_bid = min_bid;
        feature.bidders = Vec::new();
        Ok(())
    }

    // pub fn place_bid() {
    //     //transfer SOL from bidder to escrow PDA

    //     //record bid

    //     Ok(())
    // }

    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        let feature = &mut ctx.accounts.feature;
        let bidder_key = ctx.accounts.bidder.key();
        let bid_account = &mut ctx.accounts.bid_account;

        // Only allow withdrawal if bidding round ended
        let clock = Clock::get()?;
        require!(
            clock.unix_timestamp > feature.end_time,
            FeatureError::BiddingStillActive
        );

        // Prevent withdrawal if still in Top 3
        if feature.bidders.iter().any(|b| b.pubkey == bidder_key) {
            return err!(FeatureError::StillInTop3);
        }

        // Ensure the bidder actually placed a bid
        require!(bid_account.amount > 0, FeatureError::NoBidFound);
        require!(!bid_account.withdrawn, FeatureError::AlreadyWithdrawn);

        let amount = bid_account.amount;

        // Transfer lamports from escrow PDA → bidder
        let feature_key = feature.key();

        let escrow_seeds: &[&[u8]] = &[b"escrow", feature_key.as_ref(), &[feature.escrow_bump]];
        let escrow_pubkey = ctx.accounts.escrow.key();
        let bidder_pubkey = ctx.accounts.bidder.key();

        let transfer_ix = system_instruction::transfer(&escrow_pubkey, &bidder_pubkey, amount);
        anchor_lang::solana_program::program::invoke_signed(
            &transfer_ix,
            &[
                ctx.accounts.escrow.to_account_info(),
                ctx.accounts.bidder.to_account_info(),
            ],
            &[escrow_seeds],
        )?;

        // Mark bid account as withdrawn
        bid_account.withdrawn = true;

        emit!(WithdrawalAllowed {
            bidder: bidder_key,
            amount,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeFeature<'info> {
    #[account(init, payer = authority, space = 8 + Feature::LEN)]
    pub feature: Account<'info, Feature>,

    /// PDA escrow account to hold SOL
    #[account(
        init,
        payer = authority,
        seeds = [b"escrow", feature.key().as_ref()],
        bump,
        space = 8
    )]
    pub escrow: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBid<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,
    #[account(mut)]
    pub feature: Account<'info, Feature>,
    #[account(mut, seeds = [b"escrow", feature.key().as_ref()], bump)]
    pub escrow: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]

pub struct Withdraw<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,

    #[account(mut)]
    pub feature: Account<'info, Feature>,

    #[account(mut, seeds = [b"escrow", feature.key().as_ref()], bump = feature.escrow_bump)]
    pub escrow: AccountInfo<'info>,

    #[account(mut, has_one = bidder, has_one = feature)]
    pub bid_account: Account<'info, BidAccount>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct BidAccount {
    pub bidder: Pubkey,
    pub feature: Pubkey,
    pub amount: u64,
    pub withdrawn: bool,
}

impl BidAccount {
    pub const LEN: usize = 32 + 32 + 8 + 1;
}

#[account]
pub struct Feature {
    pub min_bid: u64,
    pub end_time: i64,
    pub bidders: Vec<BidderEntry>,
    pub escrow_bump: u8,
}

impl Feature {
    pub const LEN: usize = 8 + (3 * BidderEntry::LEN);
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct BidderEntry {
    pub bid_section_id: u8,
    pub pubkey: Pubkey,
    pub amount: u64,
}

impl BidderEntry {
    pub const LEN: usize = 32 + 8;
}

#[event]
pub struct NewTopBidders {
    pub bidders: Vec<BidderEntry>,
}

#[event]
pub struct WithdrawalAllowed {
    pub bidder: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum FeatureError {
    #[msg("Bid is too small")]
    BidTooSmall,
    #[msg("You cannot withdraw while still in Top 3")]
    StillInTop3,
    #[msg("No bid found for this bidder")]
    NoBidFound,
    #[msg("Bid already withdrawn")]
    AlreadyWithdrawn,
    #[msg("Bidding still active")]
    BiddingStillActive,
    #[msg("Bidding has ended")]
    BiddingEnded,
    #[msg("Overflow when adding bid amounts")]
    Overflow,
    #[msg("Unauthorized / mismatch")]
    Unauthorized,
    #[msg("BidAccount does not belong to this feature")]
    FeatureMismatch,
}
