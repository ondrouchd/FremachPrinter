using Microsoft.AspNetCore.Mvc;
using PdfPrintService;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using System.Drawing;
using System.Drawing.Printing;
using System.IO.Compression;
using System.Text;
var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins("http://192.168.50.62:3000")
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapPost("print", async ([FromBody] PdfRequest request) =>
{
    if (request == null || string.IsNullOrEmpty(request.PdfBase64))
    {
        return Results.BadRequest("Request is null");
    }

    byte[] pdfBytes = Convert.FromBase64String(request.PdfBase64);

    var configuration = app.Services.GetRequiredService<IConfiguration>();
    string filePath = string.Empty; 

    switch (request.PrinterName)
    {
        case "Xerox-vstrikovna":
            filePath = $"{configuration["Printers:vstrikovna"]}\\{ request.PrinterName}\\{ Guid.NewGuid()}.pdf";
            break;
        case "Xerox-lakovna":
            filePath = $"{configuration["Printers:lakovna"]}\\{request.PrinterName}\\{Guid.NewGuid()}.pdf";
            break;
        case "Xerox-montaz":
            filePath = $"{configuration["Printers:montaz"]}\\{request.PrinterName}\\{Guid.NewGuid()}.pdf";
            break;
        default:
            break;
    }

    await File.WriteAllBytesAsync(filePath, pdfBytes);

    // Direct printing
    string printerName = @"\\NetworkPrinterNameOrIPAddress";

    // Read PDF document
    using (PdfDocument document = PdfReader.Open(filePath, PdfDocumentOpenMode.Import))
    {
        // Print document
        using (PrintDocument printDocument = new PrintDocument())
        {
            // Set print document
            printDocument.PrinterSettings.PrinterName = printerName;

            // Set handler for print page
            printDocument.PrintPage += (sender, e) =>
            {
                PdfPage page = document.Pages[e.PageSettings.PrinterSettings.FromPage];

                // Create bitmap for print
                using (Bitmap bitmap = new Bitmap((int)page.Width.Point, (int)page.Height.Point))
                {
                   // Print PDF page to bitmap
                   using (var gfx = Graphics.FromImage(bitmap))
                   {
                       var xImage = XImage.FromGdiPlusImage(bitmap);
                        using (var xgr = XGraphics.FromGraphics(gfx, new XSize(page.Width.Point, page.Height.Point)))
                        {
                            xgr.DrawImage(xImage, 0, 0, page.Width.Point, page.Height.Point);
                        }
                   }

                   // Print bitmap to printer
                   e.Graphics.DrawImage(bitmap, e.PageBounds);
                }
            };

            // Check printer availability
            if (printDocument.PrinterSettings.IsValid)
            {
                printDocument.Print();
            }
            else
            {
                Console.WriteLine("Printer is not available");
            }
        }
    }

    return Results.Ok(new { FilePath = filePath, PdfBase64 = request.PdfBase64 });
})
.WithName("Print PDF version 1")
.WithOpenApi();

app.Run();
