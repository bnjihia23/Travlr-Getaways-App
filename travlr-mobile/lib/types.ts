export interface Trip {
  _id?: string;
  code: string;
  name: string;
  length: string;      // stored as string in Mongo
  start: string;       // ISO date string from API
  resort: string;
  perPerson: string;   // price as string
  image: string;
  description: string[];
}