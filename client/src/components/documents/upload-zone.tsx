import { Button } from "@/components/ui/button";
import { uploadPdf } from "@/services/upload.service";
import type { UploadResponse } from "@/types/api.types";
import { useRef, useState, type ChangeEvent } from "react";

type UploadZoneProps = {
  onUploadSuccess: (document: UploadResponse) => void;
};

const UploadZone = ({ onUploadSuccess }: UploadZoneProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const { data, success, message } = await uploadPdf(selectedFile);
      // show message in taost later

      if (success) {
        onUploadSuccess(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <h1>Upload you PDFs here.</h1>
      <input type="file" hidden accept=".pdf" ref={inputRef} onChange={handleFileSelect} />

      <div>
        <Button onClick={() => inputRef.current?.click()}>Choose PDF</Button>
      </div>

      <div className="mt-4">
        {selectedFile && <p>{selectedFile.name}</p>}
        <Button onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </Button>
      </div>
    </div>
  );
};

export default UploadZone;
