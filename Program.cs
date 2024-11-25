using AWC_CMS.DAL;
using AWC_CMS.Hndls;
using AWC_CMS.Repos;
using AWC_CMS.Repos.Account;
using AWC_CMS.Repos.Deployment;
using AWC_CMS.Repos.Master;
using AWC_CMS.Repos.PersonalServiceParticular;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddControllers();

// Configure Anti-Forgery
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN"; // Custom header name for CSRF token
});

// Configure DbContext with SQL Server
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repos for med
builder.Services.AddScoped<MedicalRepo>();

// Repos for dbo
builder.Services.AddScoped<DataOperation>();
builder.Services.AddScoped<UserRepo>();

// Repos for mstr
builder.Services.AddScoped<DivisionRepo>();
builder.Services.AddScoped<SyndicateRepo>();
builder.Services.AddScoped<BlockRepo>();
builder.Services.AddScoped<RankRepo>();
builder.Services.AddScoped<BaseCourseTenureRepo>();
builder.Services.AddScoped<UnitRepo>();
builder.Services.AddScoped<CourseRepo>();

// Repos for maes
builder.Services.AddScoped<MaestroRepo>();

// Repos for hr
builder.Services.AddScoped<ForeignStudentRepo>();
builder.Services.AddScoped<IndianStudentRepo>();
builder.Services.AddScoped<OfficerRepo>();
builder.Services.AddScoped<StaffRepo>();

// Repos for dply
builder.Services.AddScoped<SeniorInstructorRepo>();
builder.Services.AddScoped<DirectingStaffRepo>();
builder.Services.AddScoped<StudentRepo>();
//Repo for Leave
builder.Services.AddScoped<LeaveRepo>();
// Add Session Services
builder.Services.AddHttpContextAccessor(); // Required for accessing HttpContext in session management
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Set session timeout
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true; // Mark session cookie as essential
});

// Register SessionManager
builder.Services.AddScoped<SessUser>();

// Repos for lv

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>(); // Obtain logger instance

    try
    {
        dbContext.Database.CanConnect(); // Test connection
        logger.LogInformation("Database connection successful.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Database connection failed.");
    }
}


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();
app.UseSession();

// Redirect root URL to /Login
app.MapGet("/", () => Results.Redirect("/Login"));

// Map Razor pages
app.MapRazorPages();

// Custom 404 handling
app.UseStatusCodePages(context =>
{
    if (context.HttpContext.Response.StatusCode == 404)
    {
        context.HttpContext.Response.Redirect("/NotFound");
    }
    return Task.CompletedTask; // Explicitly return a completed task
});

// Map API controllers
app.MapControllers();

app.Run();