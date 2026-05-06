import React, { useEffect, useState } from "react";
import { Dialog } from "../common/Dialog";
import { MakeMagicButton } from "../common/buttons/MakeMagicButton";
import {
  extractText,
  readPage,
} from "../../features/dealAutomation/dealAutomationAPI";
import { ParsePageResultDialog } from "./ParsePageResultDialog";
import { CreateDealDialog } from "./CreateDealDialog";

interface GetUrlDialogProps {
  open: boolean;
  onClose: () => void;
  onMagic?: (url: string) => void;
}

export const GetUrlDialog: React.FC<GetUrlDialogProps> = ({
  open,
  onClose,
  onMagic,
}) => {
  const [url, setUrl] = useState("");
  const [pageResult, setPageResult] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createInitialValues, setCreateInitialValues] = useState<
    Partial<{
      name: string;
      firmId: number;
      firmName?: string;
      description: string;
      url: string;
      aiSearchInfo: string;
      aiBriefDescription: string;
      industry: string;
      status: string;
      typeId: number;
      stateId: number;
      startDate: string | null;
      aiFullStructuredInfo: string | null;
    }>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setUrl("");
      setError("");
    }
  }, [open]);

  const handleMagic = async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    onMagic?.(trimmedUrl);
    setLoading(true);
    setError("");

    try {
      const result = await readPage({ url: trimmedUrl, dealId: null });
      const originalText = await extractText({ url: trimmedUrl, dealId: null });
      setPageResult(result);
      setOriginalText(originalText);
      setShowResultDialog(true);
    } catch (err) {
      console.error("Failed to read page", err);
      setError("Failed to read page. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (parsed: any) => {
    setShowResultDialog(false);
    setCreateInitialValues({
      name: parsed.title || "",
      firmId: 0,
      firmName: parsed.company || "",
      description: parsed.description || "",
      url: url,
      aiSearchInfo: "",
      aiBriefDescription: "",
      industry: "DotNet",
      status: "New",
      typeId: 3,
      stateId: 1,
      startDate: null,
      aiFullStructuredInfo: JSON.stringify(parsed, null, 2),
    });
    setShowCreateDialog(true);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        title="Enter the Target Page URL"
        dialogClassName="max-w-[60%]"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MakeMagicButton
              onClick={handleMagic}
              size="md"
              ariaLabel="Make Magic"
              disabled={!url.trim() || loading}
              colorClass="blue"
            />
          </div>
          {error ? (
            <div className="text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : null}
        </div>
      </Dialog>
      <ParsePageResultDialog
        open={showResultDialog}
        result={pageResult}
        originalText={originalText}
        onClose={() => setShowResultDialog(false)}
        onCreate={handleCreate}
      />
      <CreateDealDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        initialValues={createInitialValues}
      />
    </>
  );
};
