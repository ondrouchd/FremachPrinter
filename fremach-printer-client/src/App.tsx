import { useState, useRef } from "react";
import PdfViewer from "./components/PdfViewer";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pako from "pako";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function App() {
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfData, setPdfData] = useState("");
  const [printerName, setPrinterName] = useState("");
  const [base64String, setBase64String] = useState("");
  const pageRef = useRef();

  enum Department {
    Vstrikovna = "vstrikovna",
    Lakovna = "lakovna",
    Montaz = "montaz",
  }

  const encodeToBase64 = (str) => {
    return window.btoa(unescape(encodeURIComponent(str)));
  };

  const generateBase64String = (department: Department): string => {
    const htmlContent = pageRef.current.innerHTML;
    const pdfContent = htmlToPdfmake(htmlContent);
    const docDefinition = { content: pdfContent };
    pdfMake.createPdf(docDefinition).getBase64((base64) => {
      setBase64String(base64);
      
      // Convert base64 string to byte array
      const byteArray = pako.deflate(base64);
    
      // Convert compressed byte array back to base64 string
      const decoder = new TextDecoder();
      const compressedBase64 = btoa(decoder.decode(byteArray));
    
      handleButtonClick(department, compressedBase64);
    });
  };

  const handleButtonClick = async (
    department: Department
  ) => {
    let pdfBase64: string = "";
    let body: string = "";
    let printerName: string = "";

    setShowPdf(false);

    switch (department) {
      case Department.Vstrikovna:
         pdfBase64 =
           "JVBERi0xLjIgCjkgMCBvYmoKPDwKPj4Kc3RyZWFtCkJUCi9GMSAxNCBUZgoxMDAgNzAwIFRkCihGUkVNQUNIIC0gWGVyb3gtdnN0cmlrb3ZuYSkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgNSAwIFIKL0NvbnRlbnRzIDkgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9LaWRzIFs0IDAgUiBdCi9Db3VudCAxCi9UeXBlIC9QYWdlcwovTWVkaWFCb3ggWyAwIDAgNTk1IDg0MiBdCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9QYWdlcyA1IDAgUgovVHlwZSAvQ2F0YWxvZwo+PgplbmRvYmoKdHJhaWxlcgo8PAovUm9vdCAzIDAgUgo+PgolJUVPRgo=";
        printerName = "Xerox-vstrikovna";
        body = JSON.stringify({ pdfBase64, printerName: printerName });
        console.log(`body: ${body}`);
        setPrinterName(printerName);
        break;
      case Department.Lakovna:
         pdfBase64 =
           "JVBERi0xLjIgCjkgMCBvYmoKPDwKPj4Kc3RyZWFtCkJUCi9GMSAxNCBUZgoxMDAgNzAwIFRkCihGUkVNQUNIIC0gWGVyb3gtbGFrb3ZuYSkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgNSAwIFIKL0NvbnRlbnRzIDkgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9LaWRzIFs0IDAgUiBdCi9Db3VudCAxCi9UeXBlIC9QYWdlcwovTWVkaWFCb3ggWyAwIDAgNTk1IDg0MiBdCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9QYWdlcyA1IDAgUgovVHlwZSAvQ2F0YWxvZwo+PgplbmRvYmoKdHJhaWxlcgo8PAovUm9vdCAzIDAgUgo+PgolJUVPRgo=";
        printerName = "Xerox-lakovna";
        body = JSON.stringify({ pdfBase64, printerName: printerName });
        setPrinterName(printerName);
        break;
      case Department.Montaz:
         pdfBase64 =
           "JVBERi0xLjIgCjkgMCBvYmoKPDwKPj4Kc3RyZWFtCkJUCi9GMSAxNCBUZgoxMDAgNzAwIFRkCihGUkVNQUNIIC0gWGVyb3gtbW9udGF6KSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCA1IDAgUgovQ29udGVudHMgOSAwIFIKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0tpZHMgWzQgMCBSIF0KL0NvdW50IDEKL1R5cGUgL1BhZ2VzCi9NZWRpYUJveCBbIDAgMCA1OTUgODQyIF0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1BhZ2VzIDUgMCBSCi9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iagp0cmFpbGVyCjw8Ci9Sb290IDMgMCBSCj4+CiUlRU9GCg==";
        printerName = "Xerox-montaz";
        body = JSON.stringify({ pdfBase64, printerName: printerName });
        setPrinterName(printerName);
        break;
      default:
        break;
    }

    //console.log(`body: ${body}`);

    try {
      const response = await fetch("/api/print", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      if (response.ok) {
        console.log("Base64 string sent successfully.");
        const data = await response.json();
        //console.log(`response: ${data.filePath}, ${data.pdfBase64}`);
        setPdfUrl(data.filePath);
        setPdfData(data.pdfBase64);
        setShowPdf(true);
      } else {
        console.error("Failed to send base64 string.");
      }
    } catch (error) {
      console.error("Error sending base64 string:", error);
    }
  };

  return (
    <div
      ref={pageRef}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
    >
      {printerName ? (
        <h1 className="text-4xl font-bold mb-8">FREMACH - {printerName}</h1>
      ) : (
        <h1 className="text-4xl font-bold mb-8">FREMACH</h1>
      )}
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => handleButtonClick(Department.Vstrikovna)}
        >
          vstřikovna
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => handleButtonClick(Department.Lakovna)}
        >
          lakovna
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => handleButtonClick(Department.Montaz)}
        >
          montáž
        </button>
      </div>
      {showPdf && pdfUrl && (
        <div className="mt-8">
          <PdfViewer fileUrl={pdfUrl} data={pdfData} />
        </div>
      )}
    </div>
  );
}

export default App;
