using Microsoft.AspNetCore.Http;

namespace PdfPrintService
{
    public class PdfRequest
    {
        public string PdfBase64 { get; set; }
        public string PrinterName { get; set; }
        public HttpRequest Html { get; set; }
    }
}
