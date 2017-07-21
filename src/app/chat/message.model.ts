export interface Message {
  content: string;
  userId: string;
  id?: string;
  date: Date;
  adminOnly: boolean;
}
