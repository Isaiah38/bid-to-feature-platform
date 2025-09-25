import OpenAI from 'openai';

const USE_LLM_NOTIFIER = true;
// --------------------

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export enum NotificationType {
  Start = 'Start',
  MidDay = 'Mid-day',
  End = 'End',
  NewTopBid = 'NewTopBid',
  NewBidActivity = 'NewBidActivity',
}

const generateLlmNotification = async (prompt: string): Promise<string> => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
    console.warn("OpenAI API key not found. Falling back to static notification.");
    return `(LLM Mock) ${prompt}`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
    });
    return completion.choices[0]?.message?.content?.trim() || "We have a new update on the auction!";
  } catch (error) {
    console.error("Error fetching from OpenAI:", error);
    return "Error generating notification. Please check the server logs.";
  }
};

export const generateNotification = async (type: NotificationType, data: any): Promise<string> => {
  const bidderShort = data.bidder ? `${data.bidder.slice(0, 4)}...${data.bidder.slice(-4)}` : 'Someone';
  const amountFormatted = data.amount ? parseFloat(data.amount).toFixed(2) : 'a certain amount';

  if (USE_LLM_NOTIFIER) {
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
        prompt = "There's a new event in the auction. Announce it.";
        break;
    }
    return generateLlmNotification(prompt);
  } else {
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
  }
};
