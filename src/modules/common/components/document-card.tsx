import type React from "react";
import type { Document } from "@/models/document";
import DownloadIcon from "@/modules/common/icons/download";
import FileIcon from "@/modules/common/icons/file";

interface DocumentCardProps {
  document: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = (props) => {
  return (
    <a
      href={props.document.source_url.replaceAll(
        "http://161.53.174.14/wp-content/uploads",
        // ---------------------------
        "https://www.sczg.unizg.hr/wp-content/uploads"
        // "/api/images" // Change http to https
      )}
      className="flex items-center p-4 rounded-lg border border-gray-200 text-light hover:bg-primary/5 hover:border-primary/40"
      download
    >
      <FileIcon className="size-6 mr-2" />
      <span className="line-clamp-1 flex-1">{props.document.title}</span>
      <DownloadIcon className="size-6 ml-auto" />
    </a>
  );
};

export default DocumentCard;
