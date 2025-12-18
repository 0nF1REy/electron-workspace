const addBtn = document.getElementById("add");
const usersList = document.getElementById("users");

// Criação dos elementos do modal
function createModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Adicionar Usuário</h2>
      <form id="userForm">
        <div class="form-group">
          <label for="userName">Nome:</label>
          <input type="text" id="userName" required>
        </div>
        <div class="form-group">
          <label for="userEmail">Email:</label>
          <input type="email" id="userEmail" required>
        </div>
        <div class="form-buttons">
          <button type="submit">Adicionar</button>
          <button type="button" id="cancelBtn">Cancelar</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

addBtn.addEventListener("click", async () => {
  const modal = createModal();
  const form = modal.querySelector("#userForm");
  const nameInput = modal.querySelector("#userName");
  const emailInput = modal.querySelector("#userEmail");
  const cancelBtn = modal.querySelector("#cancelBtn");

  nameInput.focus();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) return;

    try {
      const result = await window.api.query(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [name, email]
      );

      if (result.error) {
        alert("Erro ao adicionar usuário: " + result.error);
        return;
      }

      console.log("Usuário adicionado com sucesso!");
      await loadUsers();
      modal.remove();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao adicionar usuário");
    }
  });

  cancelBtn.addEventListener("click", () => {
    modal.remove();
  });

  // Fechar o modal ao clicar fora dele
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Fechar o modal ao pressionar a tecla Escape
  document.addEventListener("keydown", function escapeHandler(e) {
    if (e.key === "Escape") {
      modal.remove();
      document.removeEventListener("keydown", escapeHandler);
    }
  });
});

async function loadUsers() {
  try {
    const users = await window.api.query("SELECT * FROM users");

    if (users.error) {
      console.error("Erro ao carregar usuários:", users.error);
      return;
    }

    usersList.innerHTML = "";
    users.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = `${user.id} - ${user.name} (${user.email})`;
      usersList.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
  }
}

// Carrega os usuários quando a página for carregada
document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
});
