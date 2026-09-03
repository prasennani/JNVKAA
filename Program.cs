var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure middleware
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAll");
app.UseStaticFiles();

// Map controllers
app.MapControllers();

// Serve index.html for root path
app.MapGet("/", () => Results.File("index.html", "text/html"));

app.Run();
