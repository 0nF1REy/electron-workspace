# Electron

## Meu Hello Electron

Este projeto é um exemplo simples de aplicação desktop utilizando [Electron](https://www.electronjs.org/). Ele demonstra como criar uma janela básica que carrega um arquivo HTML e utiliza um script de preload para comunicação segura entre os processos.

### Estrutura do Projeto

```
meu-hello-electron/
├── .gitignore
├── index.html
├── main.js
├── package.json
├── preload.js
```

- **index.html**: Interface gráfica da aplicação.
- **main.js**: Script principal que inicializa o Electron e cria a janela.
- **preload.js**: Script de preload para comunicação entre o processo principal e o renderer.
- **package.json**: Metadados do projeto e dependências.
- **.gitignore**: Arquivos e pastas ignorados pelo Git.

### Como executar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie a aplicação:
   ```bash
   npm start
   ```

### Requisitos
- Node.js
- npm

### Sobre
Este projeto serve como ponto de partida para aplicações Electron, facilitando o entendimento da estrutura básica e inicialização de uma janela desktop.
