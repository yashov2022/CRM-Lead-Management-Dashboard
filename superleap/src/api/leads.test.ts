import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Lead } from "../types/lead";

const apiMock = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
}));

const axiosMock = vi.hoisted(() => ({
  create: vi.fn(() => apiMock),
}));

vi.mock("axios", () => ({
  default: axiosMock,
}));

const {
  createLead,
  deleteLead,
  getLeadById,
  getLeads,
  updateLead,
} = await import("./leads");

const lead: Lead = {
  id: 1,
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "1234567890",
  source: "Website",
  status: "NEW",
  created_at: "2026-05-16T09:00:00.000Z",
  updated_at: "2026-05-16T09:00:00.000Z",
};

describe("leads api", () => {
  beforeEach(() => {
    apiMock.delete.mockReset();
    apiMock.get.mockReset();
    apiMock.patch.mockReset();
    apiMock.post.mockReset();
    vi.useRealTimers();
  });

  it("creates an axios client with the json server base URL", () => {
    expect(axiosMock.create).toHaveBeenCalledWith({
      baseURL: "http://localhost:3000",
    });
  });

  it("fetches all leads", async () => {
    apiMock.get.mockResolvedValueOnce({ data: [lead] });

    await expect(getLeads()).resolves.toEqual([lead]);
    expect(apiMock.get).toHaveBeenCalledWith("/leads");
  });

  it("fetches a lead by id", async () => {
    apiMock.get.mockResolvedValueOnce({ data: lead });

    await expect(getLeadById(1)).resolves.toEqual(lead);
    expect(apiMock.get).toHaveBeenCalledWith("/leads/1");
  });

  it("creates a lead with created and updated timestamps", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-16T10:00:00.000Z"));
    apiMock.post.mockResolvedValueOnce({ data: lead });

    const newLead = {
      name: "Grace Hopper",
      email: "grace@example.com",
      status: "NEW" as const,
    };

    await expect(createLead(newLead)).resolves.toEqual(lead);
    expect(apiMock.post).toHaveBeenCalledWith("/leads", {
      ...newLead,
      created_at: "2026-05-16T10:00:00.000Z",
      updated_at: "2026-05-16T10:00:00.000Z",
    });
  });

  it("updates a lead with a fresh updated timestamp", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-16T11:00:00.000Z"));
    apiMock.patch.mockResolvedValueOnce({ data: { ...lead, status: "CONTACTED" } });

    await expect(updateLead(1, { status: "CONTACTED" })).resolves.toEqual({
      ...lead,
      status: "CONTACTED",
    });
    expect(apiMock.patch).toHaveBeenCalledWith("/leads/1", {
      status: "CONTACTED",
      updated_at: "2026-05-16T11:00:00.000Z",
    });
  });

  it("deletes a lead by id", async () => {
    apiMock.delete.mockResolvedValueOnce({});

    await expect(deleteLead(1)).resolves.toBeUndefined();
    expect(apiMock.delete).toHaveBeenCalledWith("/leads/1");
  });
});
