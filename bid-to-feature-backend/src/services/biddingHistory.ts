import * as fs from 'fs';
import * as path from 'path';

const historyFilePath = path.join(__dirname, '../../bidding-history.json');

interface Bid {
  bidder: string;
  amount: number;
  timestamp: number;
}

export const appendToHistory = (bid: Bid) => {
  let history: Bid[] = [];
  if (fs.existsSync(historyFilePath)) {
    const fileContent = fs.readFileSync(historyFilePath, 'utf-8');
    history = JSON.parse(fileContent);
  }
  history.push(bid);
  fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
};

export const getHistory = (): Bid[] => {
  if (fs.existsSync(historyFilePath)) {
    const fileContent = fs.readFileSync(historyFilePath, 'utf-8');
    return JSON.parse(fileContent);
  }
  return [];
};
