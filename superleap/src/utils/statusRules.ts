import type { LeadStatus } from "../types/lead";

export const statusTransitions: Record<
  LeadStatus,
  LeadStatus[]
> = {
  NEW: ["CONTACTED", "LOST"],

  CONTACTED: ["QUALIFIED", "LOST"],

  QUALIFIED: ["CONVERTED", "LOST"],

  CONVERTED: [],

  LOST: [],
};
export const getAllowedTransitions = (
  currentStatus: LeadStatus
): LeadStatus[] => {
  return statusTransitions[currentStatus];
};
export const isFinalStatus = (
  status: LeadStatus
): boolean => {
  return status === "CONVERTED" || status === "LOST";
};

