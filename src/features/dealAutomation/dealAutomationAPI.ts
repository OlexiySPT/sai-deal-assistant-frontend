import api from "../../services/api";

export interface ProcessPageCommand {
  url?: string | null;
  dealId?: number | null;
}

export type ReadPageResult = string;
export type GenerateCoverLetterResult = string;

export async function readPage(
  data: ProcessPageCommand,
): Promise<ReadPageResult> {
  const response = await api.post<ReadPageResult>(
    "/api/DealAutomation/ReadPage",
    data,
  );
  return response.data;
}

export async function generateCoverLetter(
  id: number,
): Promise<GenerateCoverLetterResult> {
  const response = await api.post<GenerateCoverLetterResult>(
    `/api/DealAutomation/${id}/generate-cover-letter`,
  );
  return response.data;
}
