export interface Bid {
  _id: string;
  amount: number;
  bidder: {
    _id: string;
    name: string;
    email: string;
  };
  auction: string;
  createdAt: string;
}