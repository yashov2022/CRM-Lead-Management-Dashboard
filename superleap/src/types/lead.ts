export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "CONVERTED"
  | "LOST";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  source?: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}