import React, { useState, useEffect } from "react";

const PdfViewer = ({ fileUrl, data }: { fileUrl: string; data: string }) => {
  const [pdfData, setPdfData] = useState("");

  useEffect(() => {
    setPdfData(data);
  }, []);

  return (
    <>
      <p>{fileUrl}</p>
      <iframe
        title="PDF Viewer"
        src={`data:application/pdf;base64,${pdfData}`}
        width="100%"
        height="600px"
      />
    </>
  );
};

export default PdfViewer;
