import { getDocument } from "@/services/document.service";
import type { UploadResponse } from "@/types/api.types";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const DocumentChat = () => {
  const location = useLocation();
  const { documentId } = useParams();

  const [document, setDocument] = useState<UploadResponse | null>(location.state ?? null);

  useEffect(() => {
    if (document || !documentId) return;

    const fetchDocument = async () => {
      try {
        const { data } = await getDocument(documentId);
        setDocument(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDocument();
  }, [document, documentId]);

  return (
    <div>
      <h1>Filename: {document?.fileName}</h1>
    </div>
  );
};

export default DocumentChat;
