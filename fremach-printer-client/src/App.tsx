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
           "JVBERi0xLjIgDQo5IDAgb2JqDQo8PA0KPj4NCnN0cmVhbQ0KQlQvIDE0IFRmKEZSRU1BQ0ggLSBYZXJveC12c3RyaWtvdm5hKScgRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQo0IDAgb2JqDQo8PA0KL1R5cGUgL1BhZ2UNCi9QYXJlbnQgNSAwIFINCi9Db250ZW50cyA5IDAgUg0KPj4NCmVuZG9iag0KNSAwIG9iag0KPDwNCi9LaWRzIFs0IDAgUiBdDQovQ291bnQgMQ0KL1R5cGUgL1BhZ2VzDQovTWVkaWFCb3ggWyAwIDAgMjUwIDUwIF0NCj4+DQplbmRvYmoNCjMgMCBvYmoNCjw8DQovUGFnZXMgNSAwIFINCi9UeXBlIC9DYXRhbG9nDQo+Pg0KZW5kb2JqDQp0cmFpbGVyDQo8PA0KL1Jvb3QgMyAwIFINCj4+DQolJUVPRg==";
        printerName = "Xerox-vstrikovna";
        body = JSON.stringify({ pdfBase64, printerName: printerName });
        console.log(`body: ${body}`);
        setPrinterName(printerName);
        break;
      case Department.Lakovna:
         pdfBase64 =
           "JVBERi0xLjIgDQo5IDAgb2JqDQo8PA0KPj4NCnN0cmVhbQ0KQlQvIDE0IFRmKEZSRU1BQ0ggLSBYZXJveC1sYWtvdm5hKScgRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQo0IDAgb2JqDQo8PA0KL1R5cGUgL1BhZ2UNCi9QYXJlbnQgNSAwIFINCi9Db250ZW50cyA5IDAgUg0KPj4NCmVuZG9iag0KNSAwIG9iag0KPDwNCi9LaWRzIFs0IDAgUiBdDQovQ291bnQgMQ0KL1R5cGUgL1BhZ2VzDQovTWVkaWFCb3ggWyAwIDAgMjUwIDUwIF0NCj4+DQplbmRvYmoNCjMgMCBvYmoNCjw8DQovUGFnZXMgNSAwIFINCi9UeXBlIC9DYXRhbG9nDQo+Pg0KZW5kb2JqDQp0cmFpbGVyDQo8PA0KL1Jvb3QgMyAwIFINCj4+DQolJUVPRg==";
        printerName = "Xerox-lakovna";
        body = JSON.stringify({ pdfBase64, printerName: printerName });
        setPrinterName(printerName);
        break;
      case Department.Montaz:
         pdfBase64 =
           "JVBERi0xLjIgDQo5IDAgb2JqDQo8PA0KPj4NCnN0cmVhbQ0KQlQvIDE0IFRmKEZSRU1BQ0ggLSBYZXJveC1tb250YXopJyBFVA0KZW5kc3RyZWFtDQplbmRvYmoNCjQgMCBvYmoNCjw8DQovVHlwZSAvUGFnZQ0KL1BhcmVudCA1IDAgUg0KL0NvbnRlbnRzIDkgMCBSDQo+Pg0KZW5kb2JqDQo1IDAgb2JqDQo8PA0KL0tpZHMgWzQgMCBSIF0NCi9Db3VudCAxDQovVHlwZSAvUGFnZXMNCi9NZWRpYUJveCBbIDAgMCAyNTAgNTAgXQ0KPj4NCmVuZG9iag0KMyAwIG9iag0KPDwNCi9QYWdlcyA1IDAgUg0KL1R5cGUgL0NhdGFsb2cNCj4+DQplbmRvYmoNCnRyYWlsZXINCjw8DQovUm9vdCAzIDAgUg0KPj4NCiUlRU9G";
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
