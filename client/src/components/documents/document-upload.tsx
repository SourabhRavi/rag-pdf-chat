import { useRef, type ComponentProps } from "react";

import { useUploadDocument } from "@/hooks/use-upload-document";
import { MAX_FILE_SIZE } from "@/constants/file.constants";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  const { mutate: uploadDocument, isPending } = useUploadDocument();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      toast.error("PDF must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }

    uploadDocument(file, {
      onSuccess: ({ data }) => {
        toast.success("PDF uploaded successfully");
        onUploadSuccess?.(data.documentId);
      },

      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to upload PDF. Please try again.",
        );
      },
    });

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
        type="button"
        variant="ghost"
        size="xs"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
      >
        {isPending ? loadingLabel : children}
      </Button>
    </>
  );
};

export default DocumentUpload;
