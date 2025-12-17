using ElectronNET.API;
using BlazorApp = blazor_desktop.Components.App;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseElectron(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();
app.UseAntiforgery();

app.MapStaticAssets();

app.MapRazorComponents<BlazorApp>()
    .AddInteractiveServerRenderMode();

if (HybridSupport.IsElectronActive)
{
    // Garante que a janela só abre quando o servidor estiver ouvindo na porta
    app.Lifetime.ApplicationStarted.Register(async () =>
    {
        await Electron.WindowManager.CreateWindowAsync();
    });
}

await app.RunAsync();
