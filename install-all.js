const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Pega o diretório atual
const rootDir = process.cwd();

// Lê todas as pastas/arquivos do diretório
fs.readdirSync(rootDir).forEach((file) => {
  const fullPath = path.join(rootDir, file);

  // Verifica se é uma pasta e se tem package.json
  if (
    fs.statSync(fullPath).isDirectory() &&
    fs.existsSync(path.join(fullPath, "package.json"))
  ) {
    console.log(`\nInstalando dependências em: ${file}...`);
    try {
      // Executa npm install dentro da pasta
      execSync("npm install", {
        cwd: fullPath,
        stdio: "inherit",
      });
      console.log(`Sucesso em ${file}`);
    } catch (error) {
      console.error(`Erro ao instalar em ${file}`);
    }
  }
});
