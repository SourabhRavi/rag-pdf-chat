import type { UploadResponse } from "@/types/api.types";
import { useLocation } from "react-router-dom";

const DocumentChat = () => {
  const location = useLocation();

  const document = location.state as UploadResponse;

  return (
    <div>
      <h1>Filename: {document.fileName}</h1>
    </div>
  );
};

export default DocumentChat;
