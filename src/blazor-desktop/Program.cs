using ElectronNET.API;
using BlazorApp = blazor_desktop.Components.App;

var builder = WebApplication.CreateBuilder(args);

// Electron precisa saber que está rodando com ele
builder.WebHost.UseElectron(args);

// Adicionado os serviços ao contêiner.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var app = builder.Build();

// Configurado o pipeline de requisições HTTP.
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

// Electron “entra em ação”
if (HybridSupport.IsElectronActive)
{
    await Electron.WindowManager.CreateWindowAsync();
}

await app.RunAsync();
