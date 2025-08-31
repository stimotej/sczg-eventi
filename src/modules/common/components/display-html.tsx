import React, { type ElementType } from "react";
import type { Document } from "@/models/document";
import DOMPurify from "isomorphic-dompurify";
import DocumentCard from "@/modules/common/components/document-card";
import { cn } from "@/lib/utils/cn";

interface DisplayHTMLProps {
  html: string;
  documents?: Document[];
  className?: string;
  as?: ElementType;
}

const DisplayHTML: React.FC<DisplayHTMLProps> = (props) => {
  const Element = props.as || "div";

  const cleanHtml = DOMPurify.sanitize(props.html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  });

  const replaceImageUrls = (html: string) => {
    return html.replaceAll(
      "http://161.53.174.14/wp-content/uploads",
      // ---------------------------
      "https://www.sczg.unizg.hr/wp-content/uploads"
      // "/api/images" // Change http to https
    );
  };

  const modifiedHtml = replaceImageUrls(cleanHtml);

  return (
    <>
      <Element
        dangerouslySetInnerHTML={{ __html: modifiedHtml }}
        className={cn("html-content", props.className)}
      />
      {!!props.documents && props.documents.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {props.documents?.map((document, index) => (
            <DocumentCard key={index} document={document} />
          ))}
        </div>
      )}
    </>
  );
};

export default DisplayHTML;
