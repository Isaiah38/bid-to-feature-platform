import OpenAI from 'openai';
import config from '../config';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

export enum NotificationType {
  Start = 'Start',
  MidDay = 'Mid-day',
  End = 'End',
  NewTopBid = 'NewTopBid',
  NewBidActivity = 'NewBidActivity',
}

const getStaticNotification = (type: NotificationType, data: any): string => {
  const bidderShort = data.bidder ? `${data.bidder.slice(0, 4)}...${data.bidder.slice(-4)}` : 'Someone';
  const amountFormatted = data.amount ? parseFloat(data.amount).toFixed(2) : 'a certain amount';

  switch (type) {
    case NotificationType.Start:
      return `🚀 Bidding has started! Place your bid now.`;
    case NotificationType.MidDay:
      return `⏳ Bidding is halfway through! Don't miss out.`;
    case NotificationType.End:
      return `🔔 Bidding is ending soon! Last chance to bid.`;
    case NotificationType.NewTopBid:
      return `🏆 New Top Bid! ${bidderShort} is now in the lead with ${amountFormatted} SOL.`;
    case NotificationType.NewBidActivity:
      return `⚡️ New Bid! ${bidderShort} just placed a bid of ${amountFormatted} SOL.`;
    default:
      return 'New event received.';
  }
};

const generateLlmNotification = async (prompt: string, fallback: string): Promise<string> => {
  if (!config.openaiApiKey || config.openaiApiKey === "your_openai_api_key_here") {
    console.warn("OpenAI API key not found. Using static notification.");
    return fallback;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
    });
    return completion.choices[0]?.message?.content?.trim() || fallback;
  } catch (error) {
    console.error("Error fetching from OpenAI. Falling back to static notification:", error);
    return fallback;
  }
};

export const generateNotification = async (type: NotificationType, data: any): Promise<string> => {
  if (!config.useLlmNotifier) {
    return getStaticNotification(type, data);
  }

  const bidderShort = data.bidder ? `${data.bidder.slice(0, 4)}...${data.bidder.slice(-4)}` : 'Someone';
  const amountFormatted = data.amount ? parseFloat(data.amount).toFixed(2) : 'a certain amount';
  const staticFallback = getStaticNotification(type, data);
  
  let prompt = '';
  switch (type) {
    case NotificationType.Start:
      prompt = "The bidding for a featured spot has just started. Write a short, exciting notification to kick things off.";
      break;
    case NotificationType.MidDay:
      prompt = "The bidding is halfway through. Write a short, encouraging notification to keep the momentum going.";
      break;
    case NotificationType.End:
      prompt = "The bidding is ending in 5 minutes. Write a short, urgent notification to encourage last-minute bids.";
      break;
    case NotificationType.NewTopBid:
      prompt = `There's a new top bidder! ${bidderShort} just bid ${amountFormatted} SOL. Write a short, impactful notification about this change.`;
      break;
    case NotificationType.NewBidActivity:
      prompt = `${bidderShort} just placed a new bid of ${amountFormatted} SOL. Write a short notification to announce this activity.`;
      break;
    default:
      return staticFallback;
  }

  return generateLlmNotification(prompt, staticFallback);
};
