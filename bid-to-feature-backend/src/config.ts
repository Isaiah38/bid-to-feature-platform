import dotenv from 'dotenv';

dotenv.config();

const config = {
  useMockListener: process.env.USE_MOCK_LISTENER === 'true',

  useLlmNotifier: process.env.USE_LLM_NOTIFIER === 'true',

  auctionDurationMinutes: parseInt(
    process.env.AUCTION_DURATION_MINUTES || '5',
    10
  ),

  openaiApiKey: process.env.OPENAI_API_KEY || '',
};

export default Object.freeze(config);
