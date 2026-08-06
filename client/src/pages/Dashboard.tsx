import UploadZone from "@/components/documents/upload-zone";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";
import type { UploadResponse } from "@/types/api.types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [selectedDocument, setSelectedDocument] = useState<UploadResponse | null>(null);

  const handleChatNavigation = () => {
    if (!selectedDocument) return;

    navigate("/chat", {
      state: selectedDocument,
    });
  };

  return (
    <DashboardLayout>
      {/* Stats */}
      {/* Recent PDFs */}
      {/* Recent Chats */}
      {/* Analytics */}
      <UploadZone onUploadSuccess={setSelectedDocument} />

      {selectedDocument && (
        <div>
          <p>PDF uploaded successfully</p>
          <Button onClick={handleChatNavigation}>Chat with PDF</Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
