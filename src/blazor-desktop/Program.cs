using ElectronNET.API;
using ElectronNET.API.Entities;
using blazor_desktop;
using blazor_desktop.Data;
using Microsoft.EntityFrameworkCore;
using BlazorApp = blazor_desktop.Components.App;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseElectron(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddSingleton<IFilesService, FilesService>();

// ----------------------------------------
// CONFIGURAÇÃO DO BANCO DE DADOS (SQLite)
// ----------------------------------------
var databasePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "meu_app_blazor.db");

// Registra o Contexto do Banco de Dados
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite($"Data Source={databasePath}"));

var app = builder.Build();

// ----------------------------
// CRIAÇÃO AUTOMÁTICA DO BANCO
// ----------------------------

// Isso garante que o arquivo .db seja criado na primeira vez que o app abrir
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
}

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
        // 1. DEFINIÇÃO DO MENU
        var menu = new MenuItem[]
        {
            new MenuItem
            {
                Label = "Arquivo",
                Type = MenuType.submenu,
                Submenu = new MenuItem[]
                {
                    new MenuItem { Label = "Novo", Click = async () => await Electron.Dialog.ShowMessageBoxAsync("Você clicou em Novo!") },
                    new MenuItem { Type = MenuType.separator },
                    new MenuItem { Label = "Sair", Role = MenuRole.quit }
                }
            },
            new MenuItem
            {
                Label = "Exibir",
                Submenu = new MenuItem[]
                {
                    new MenuItem { Label = "Recarregar", Role = MenuRole.reload },
                    new MenuItem { Label = "Ferramentas Dev", Role = MenuRole.toggledevtools }
                }
            }
        };

        Electron.Menu.SetApplicationMenu(menu);

        // 2. CRIAÇÃO DA JANELA
        var options = new BrowserWindowOptions { Show = false };
        var window = await Electron.WindowManager.CreateWindowAsync(options);
        window.OnReadyToShow += () => window.Show();
    });
}

await app.RunAsync();
