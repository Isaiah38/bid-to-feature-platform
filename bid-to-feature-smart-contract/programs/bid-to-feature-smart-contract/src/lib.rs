#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

declare_id!("2EjhzjMZGBKJsEPDAqYALCcsWn12knJGydCso1YpAGBf");

#[allow(deprecated)]
#[program]
pub mod bid_to_feature_smart_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow_account;
        require!(amount > 0, CustomError::InvalidAmount);
        escrow.initializer = *ctx.accounts.initializer.key;
        escrow.amount = amount;
        escrow.is_active = true;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.initializer.to_account_info(),
                to: ctx.accounts.escrow_account.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_ctx, amount)?;

        Ok(())
    }

    pub fn get_bidder_balance(ctx: Context<GetBidderBalance>) -> Result<u64> {
        let bidder_account = &ctx.accounts.bidder_account;
        Ok(bidder_account.amount)
    }

    pub fn place_bid(ctx: Context<PlaceBid>, category_name: String, amount: u64) -> Result<()> {
        require!(amount > 0, CustomError::InvalidAmount);
        require!(
            category_name.len() <= FeaturedCategory::MAX_NAME_LEN,
            CustomError::InvalidCategoryName
        );

        // Perform CPI transfer first to avoid borrow conflict
        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.bidder.to_account_info(),
                to: ctx.accounts.bidder_account.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_ctx, amount)?;

        // Now take mutable reference to bidder_account
        let bidder_account = &mut ctx.accounts.bidder_account;
        let category = &mut ctx.accounts.featured_category;

        bidder_account.amount += amount;

        let new_bid = Bid {
            bidder: ctx.accounts.bidder.key(),
            category: category_name.clone(),
            amount,
        };

        category.top_3_bids.push(new_bid);
        category.top_3_bids.sort_by(|a, b| b.amount.cmp(&a.amount));
        if category.top_3_bids.len() > FeaturedCategory::MAX_BIDS {
            category.top_3_bids.pop();
        }

        Ok(())
    }

    pub fn create_category(ctx: Context<CreateFeaturedCategory>, name: String) -> Result<()> {
        require!(name.len() <= FeaturedCategory::MAX_NAME_LEN, CustomError::InvalidCategoryName);
        let category = &mut ctx.accounts.featured_category;

        category.authority = ctx.accounts.authority.key();
        category.name = name;
        category.top_3_bids = Vec::new();

        Ok(())
    }

    pub fn close_bid<'info>(
        ctx: Context<CloseBid>,
        _category_name: String,
        _base_name: String,
    ) -> Result<()> {
        let temp_category = &ctx.accounts.temp_category;
        let main_category = &mut ctx.accounts.main_category;

        require!(
            ctx.accounts.authority.key() == temp_category.authority,
            CustomError::Unauthorized
        );

        let mut bidders = vec![
            &mut ctx.accounts.bidder_1,
            &mut ctx.accounts.bidder_2,
            &mut ctx.accounts.bidder_3,
        ];

        let num_winners = temp_category.top_3_bids.len().min(FeaturedCategory::MAX_BIDS);
        for i in 0..num_winners {
            let winner = &temp_category.top_3_bids[i];
            let bidder = &mut bidders[i];

            require!(bidder.owner == winner.bidder, CustomError::InvalidBidder);
            require!(bidder.amount >= winner.amount, CustomError::InsufficientBalance);
            bidder.amount -= winner.amount;
            main_category.top_3_bids.push(winner.clone());
        }

        Ok(())
    }

    pub fn withdraw<'info>(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let bidder_account = &mut ctx.accounts.bidder_account;

        require!(amount > 0, CustomError::InvalidAmount);
        require!(bidder_account.amount >= amount, CustomError::InsufficientBalance);

        bidder_account.amount -= amount;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.bidder_account.to_account_info(),
                to: ctx.accounts.bidder.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_ctx, amount)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct GetBidderBalance<'info> {
    #[account(mut)]
    pub bidder_account: Account<'info, BidderAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    #[account(
        init,
        seeds = [b"escrow", initializer.key().as_ref()],
        bump,
        payer = initializer,
        space = 8 + 32 + 8 + 1,
    )]
    pub escrow_account: Account<'info, EscrowAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(category_name: String)]
pub struct PlaceBid<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,
    #[account(
        init_if_needed,
        seeds = [b"bidder_account", bidder.key().as_ref()],
        bump,
        payer = bidder,
        space = 8 + 32 + 8,
    )]
    pub bidder_account: Account<'info, BidderAccount>,
    #[account(
        mut,
        seeds = [b"featured_category", category_name.as_bytes()],
        bump
    )]
    pub featured_category: Account<'info, FeaturedCategory>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateFeaturedCategory<'info> {
    #[account(
        init,
        payer = authority,
        space = FeaturedCategory::SPACE,
        seeds = [b"featured_category", name.as_bytes()],
        bump
    )]
    pub featured_category: Account<'info, FeaturedCategory>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct FeaturedCategory {
    pub authority: Pubkey,
    pub name: String,
    pub top_3_bids: Vec<Bid>,
}

impl FeaturedCategory {
    const MAX_NAME_LEN: usize = 50;
    const MAX_BIDS: usize = 3;
    const BID_SIZE: usize = 32 + 4 + Self::MAX_NAME_LEN + 8; 
    pub const SPACE: usize = 8 +
        32 + 
        4 + Self::MAX_NAME_LEN + 
        4 + (Self::MAX_BIDS * Self::BID_SIZE); 
}

#[account]
pub struct BidderAccount {
    pub owner: Pubkey,
    pub amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Bid {
    pub bidder: Pubkey,
    pub category: String,
    pub amount: u64,
}

#[account]
pub struct EscrowAccount {
    pub initializer: Pubkey,
    pub amount: u64,
    pub is_active: bool,
}

#[derive(Accounts)]
#[instruction(category_name: String, base_name: String)]
pub struct CloseBid<'info> {
    #[account(
        mut,
        seeds = [b"featured_category", category_name.as_bytes()],
        bump
    )]
    pub temp_category: Account<'info, FeaturedCategory>,
    #[account(
        mut,
        seeds = [b"featured_category", base_name.as_bytes()],
        bump
    )]
    pub main_category: Account<'info, FeaturedCategory>,
    #[account(mut)]
    pub bidder_1: Account<'info, BidderAccount>,
    #[account(mut)]
    pub bidder_2: Account<'info, BidderAccount>,
    #[account(mut)]
    pub bidder_3: Account<'info, BidderAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(category_name: String)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,
    #[account(
        mut,
        seeds = [b"bidder_account", bidder.key().as_ref()],
        bump
    )]
    pub bidder_account: Account<'info, BidderAccount>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum CustomError {
    #[msg("Insufficient Balance")]
    InsufficientBalance,
    #[msg("Invalid Bidder")]
    InvalidBidder,
    #[msg("Invalid Amount")]
    InvalidAmount,
    #[msg("Invalid Category Name")]
    InvalidCategoryName,
    #[msg("Unauthorized")]
    Unauthorized,
}