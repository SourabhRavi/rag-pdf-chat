import { useRef, type ComponentProps } from "react";

import { useUploadDocument } from "@/hooks/use-upload-document";
import { MAX_FILE_SIZE } from "@/constants/file.constants";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useIsMutating } from "@tanstack/react-query";

type DocumentUploadProps = {
  children: React.ReactNode;
  loadingLabel?: React.ReactNode;
  onUploadSuccess?: (documentId: string) => void;
} & Omit<ComponentProps<typeof Button>, "onClick" | "disabled">;

const DocumentUpload = ({
  children,
  loadingLabel = "Uploading...",
  onUploadSuccess,
  ...buttonProps
}: DocumentUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadDocumentAsync } = useUploadDocument();

  const isUploading =
    useIsMutating({
      mutationKey: ["upload"],
    }) > 0; // useMutating gives: 0, 1, 2, 3

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("PDF must be 500 KB or smaller.");
      event.target.value = "";
      return;
    }

    const uploadPromise = uploadDocumentAsync(file);

    toast.promise(uploadPromise, {
      loading: "Uploading PDF...",
      success: "PDF uploaded successfully",
      error: (error) =>
        !navigator.onLine
          ? "No internet connection. Please check your network."
          : error instanceof Error
            ? error.message
            : "Failed to upload PDF. Please try again.",
    });

    const { data } = await uploadPromise;

    onUploadSuccess?.(data.documentId);

    event.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        {...buttonProps}
        className={cn(buttonProps.className)}
        type="button"
        // variant="ghost"
        size="xs"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading && <Spinner />}

        {isUploading ? loadingLabel : children}
      </Button>
    </>
  );
};

export default DocumentUpload;
