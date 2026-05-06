import api from "../../services/api";

export interface ProcessPageCommand {
  url?: string | null;
  dealId?: number | null;
}

export interface ExtractTextCommand {
  url?: string | null;
  dealId?: number | null;
}

export type DealAutomationResult = string;
export type ReadPageResult = DealAutomationResult;
export type ExtractTextResult = DealAutomationResult;
export type GenerateCoverLetterResult = DealAutomationResult;

export async function readPage(
  data: ProcessPageCommand,
): Promise<ReadPageResult> {
  const response = await api.post<ReadPageResult>(
    "/api/DealAutomation/ReadPage",
    data,
  );
  return response.data;
}

export async function extractText(
  data: ExtractTextCommand,
): Promise<ExtractTextResult> {
  const response = await api.post<ExtractTextResult>(
    "/api/DealAutomation/ExtractText",
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
