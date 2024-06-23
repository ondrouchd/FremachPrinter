using Microsoft.AspNetCore.Mvc;
using PdfPrintService;
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

    return Results.Ok(new { FilePath = filePath, PdfBase64 = request.PdfBase64 });
})
.WithName("Print PDF version 1")
.WithOpenApi();

app.Run();
