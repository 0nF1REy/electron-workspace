const form = document.querySelector("#img-form");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const filename = document.querySelector("#filename");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");

// Carregar imagem e mostrar o formulário
function loadImage(e) {
  const file = e.target.files[0];

  // Verifica se o arquivo é uma imagem
  if (!isFileImage(file)) {
    alertError("Por favor, selecione uma imagem");
    return;
  }

  // Adiciona a largura e altura atuais ao formulário usando a API de URL
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  // Mostra o formulário, nome da imagem e caminho de saída
  form.style.display = "block";
  filename.innerHTML = file.name;
  outputPath.innerText = window.path.join(window.os.homedir(), "imageresizer");
}

// Garante que o arquivo seja uma imagem
function isFileImage(file) {
  const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];
  return file && acceptedImageTypes.includes(file["type"]);
}

// Redimensionar imagem
function resizeImage(e) {
  e.preventDefault();

  if (!img.files[0]) {
    alertError("Por favor, faça o upload de uma imagem");
    return;
  }

  if (widthInput.value === "" || heightInput.value === "") {
    alertError("Por favor, insira uma largura e uma altura");
    return;
  }

  const file = img.files[0];
  const width = widthInput.value;
  const height = heightInput.value;

  // Usar FileReader para ler o arquivo como ArrayBuffer e enviar para o main
  const reader = new FileReader();

  reader.onload = () => {
    // Converter ArrayBuffer para Buffer do Node.js usando a API exposta
    const fileBuffer = window.Buffer.from(reader.result);
    window.ipcRenderer.send("image:resize", {
      fileName: file.name, // Enviar o nome do arquivo separadamente
      fileBuffer, // Enviar o Buffer do conteúdo do arquivo
      height,
      width,
    });
  };

  reader.onerror = (error) => {
    console.error("FileReader error: ", error);
    alertError("Falha ao ler o arquivo de imagem.");
  };
  // Ler o arquivo como ArrayBuffer
  reader.readAsArrayBuffer(file);
}

// Quando terminar, mostrar mensagem de sucesso
window.ipcRenderer.on("image:done", () =>
  alertSuccess(
    `Imagem redimensionada para ${heightInput.value} x ${widthInput.value}`
  )
);

// Quando o processo principal enviar uma mensagem de erro
window.ipcRenderer.on("image:error", (message) => alertError(message));

function alertSuccess(message) {
  window.Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "green",
      color: "white",
      textAlign: "center",
    },
  });
}

function alertError(message) {
  window.Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center",
    },
  });
}

// Listener de seleção de arquivo
img.addEventListener("change", loadImage);

// Listener de envio do formulário
form.addEventListener("submit", resizeImage);
