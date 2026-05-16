import { describe, expect, it } from "vitest";

import {
  getAllowedTransitions,
  isFinalStatus,
  statusTransitions,
} from "./statusRules";
import type { LeadStatus } from "../types/lead";

const expectedTransitions: Record<LeadStatus, LeadStatus[]> = {
  NEW: ["CONTACTED", "LOST"],
  CONTACTED: ["QUALIFIED", "LOST"],
  QUALIFIED: ["CONVERTED", "LOST"],
  CONVERTED: [],
  LOST: [],
};

describe("status rules", () => {
  it("defines the expected transition map for every lead status", () => {
    expect(statusTransitions).toEqual(expectedTransitions);
  });

  it("returns allowed next statuses for the current status", () => {
    expect(getAllowedTransitions("NEW")).toEqual(["CONTACTED", "LOST"]);
    expect(getAllowedTransitions("QUALIFIED")).toEqual(["CONVERTED", "LOST"]);
  });

  it("identifies only converted and lost leads as final statuses", () => {
    expect(isFinalStatus("CONVERTED")).toBe(true);
    expect(isFinalStatus("LOST")).toBe(true);
    expect(isFinalStatus("NEW")).toBe(false);
    expect(isFinalStatus("CONTACTED")).toBe(false);
    expect(isFinalStatus("QUALIFIED")).toBe(false);
  });
});
