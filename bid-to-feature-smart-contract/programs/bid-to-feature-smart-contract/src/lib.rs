use anchor_lang::prelude::*;

declare_id!("2EjhzjMZGBKJsEPDAqYALCcsWn12knJGydCso1YpAGBf");

#[program]
pub mod bid_to_feature_smart_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        
    let escrow = &mut ctx.accounts.escrow_account;
    escrow.initializer = *ctx.accounts.initializer.key;
    escrow.amount = amount;
    escrow.is_active = true;

    // transfer lamports from initializer to the escrow PDA
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

#[account]
pub struct EscrowAccount {
    pub initializer: Pubkey,
    pub amount: u64,
    pub is_active: bool,
}
