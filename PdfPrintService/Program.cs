using Microsoft.AspNetCore.Mvc;
using PdfPrintService;
using System.IO.Compression;
using System.Text;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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

    string filePath = @$"c:\Users\david\source\repos\FremachPrinter\PdfPrintServiceData\{request.PrinterName}\{Guid.NewGuid()}.pdf";

    await File.WriteAllBytesAsync(filePath, pdfBytes);

    return Results.Ok(new { FilePath = filePath, PdfBase64 = request.PdfBase64 });
})
.WithName("Print PDF version 1")
.WithOpenApi();

app.Run();
