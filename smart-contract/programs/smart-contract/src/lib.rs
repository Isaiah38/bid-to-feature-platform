use anchor_lang::prelude::*;

declare_id!("A4tegPx6662aYdJANarfVQufCwtWcELiGtR56KhqogR9");

#[program]
pub mod smart_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
