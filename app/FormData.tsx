
export interface UserFormData {
  cost: number;
  category: 'business' | 'food' | 'base';
  what: string;
  where: string;
  why: string;
  receipt?: string; // Optional field (fixed spelling)
}