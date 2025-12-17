using ElectronNET.API;
using ElectronNET.API.Entities;
using blazor_desktop;
using BlazorApp = blazor_desktop.Components.App;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseElectron(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddSingleton<IFilesService, FilesService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
}

app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);

app.UseAntiforgery();

app.MapStaticAssets();

app.MapRazorComponents<BlazorApp>()
    .AddInteractiveServerRenderMode();

if (HybridSupport.IsElectronActive)
{
    app.Lifetime.ApplicationStarted.Register(async () =>
    {
        var options = new BrowserWindowOptions 
        { 
            Show = false 
        };
        
        var window = await Electron.WindowManager.CreateWindowAsync(options);
        
        window.OnReadyToShow += () => window.Show();
    });
}

await app.RunAsync();
