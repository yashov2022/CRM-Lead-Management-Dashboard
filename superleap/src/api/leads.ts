import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});
import type { Lead } from "../types/lead";
export const getLeads = async (): Promise<Lead[]> => {
  const response = await API.get("/leads");
  return response.data;
};
export const getLeadById = async (id: number): Promise<Lead> => {
  const response = await API.get(`/leads/${id}`);
  return response.data;
};
export const createLead = async (
  leadData: Omit<Lead, "id" | "created_at" | "updated_at">
): Promise<Lead> => {
  const response = await API.post("/leads", {
    ...leadData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return response.data;
};
export const updateLead = async (
  id: number,
  updatedData: Partial<Lead>
): Promise<Lead> => {
  const response = await API.patch(`/leads/${id}`, {
    ...updatedData,
    updated_at: new Date().toISOString(),
  });

  return response.data;
};
export const deleteLead = async (
  id: number
): Promise<void> => {

  await API.delete(`/leads/${id}`);
};
