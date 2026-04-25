import api from "../../services/api";

export interface ProcessPageCommand {
  url?: string | null;
  dealId?: number | null;
}

export async function readPage(data: ProcessPageCommand): Promise<string> {
  const response = await api.post("/api/DealAutomation/ReadPage", data);
  return response.data;
}
