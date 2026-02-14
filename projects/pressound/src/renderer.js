document.addEventListener("DOMContentLoaded", () => {
  const soundPacks = {
    animes: {
      name: "Animes",
      sounds: [
        {
          id: "tuturu",
          key: "Q",
          image: "assets/images/animes/tuturu.png",
          sound: "assets/sounds/animes/tuturu.mp3",
        },
        {
          id: "wow",
          key: "W",
          image: "assets/images/animes/wow.png",
          sound: "assets/sounds/animes/wow.mp3",
        },
        {
          id: "za-warudo",
          key: "E",
          image: "assets/images/animes/za-warudo.jpg",
          sound: "assets/sounds/animes/za-warudo.mp3",
        },
        {
          id: "nani",
          key: "R",
          image: "assets/images/animes/nani.jpg",
          sound: "assets/sounds/animes/nani.mp3",
        },
        {
          id: "pegasus-ryu-sei-ken",
          key: "T",
          image: "assets/images/animes/pegasus-ryu-sei-ken.jpg",
          sound: "assets/sounds/animes/pegasus-ryu-sei-ken.mp3",
        },
        {
          id: "ciaossu",
          key: "Y",
          image: "assets/images/animes/ciaossu.jpg",
          sound: "assets/sounds/animes/ciaossu.mp3",
        },
      ],
    },
    games: {
      name: "Games",
      sounds: [
        {
          id: "pacman",
          key: "Q",
          image: "assets/images/games/pacman.jpg",
          sound: "assets/sounds/games/pacman.mp3",
        },
        {
          id: "toasty",
          key: "W",
          image: "assets/images/games/toasty.jpg",
          sound: "assets/sounds/games/toasty.mp3",
        },
        {
          id: "mario",
          key: "E",
          image: "assets/images/games/mario.jpg",
          sound: "assets/sounds/games/mario.mp3",
        },
        {
          id: "gta-sa",
          key: "R",
          image: "assets/images/games/gta-sa.png",
          sound: "assets/sounds/games/gta-sa.mp3",
        },
        {
          id: "hadouken",
          key: "T",
          image: "assets/images/games/hadouken.jpg",
          sound: "assets/sounds/games/hadouken.mp3",
        },
        {
          id: "kof-98",
          key: "Y",
          image: "assets/images/games/kof-98.jpg",
          sound: "assets/sounds/games/kof-98.mp3",
        },
      ],
    },
    others: {
      name: "Outros",
      sounds: [
        {
          id: "clapping",
          key: "Q",
          image: "assets/images/others/clapping.jpeg",
          sound: "assets/sounds/others/clapping.wav",
        },
        {
          id: "explosion",
          key: "W",
          image: "assets/images/others/explosion.jpeg",
          sound: "assets/sounds/others/explosion.mp3",
        },
        {
          id: "goat",
          key: "E",
          image: "assets/images/others/goat.jpeg",
          sound: "assets/sounds/others/goat.mp3",
        },
        {
          id: "ambience",
          key: "R",
          image: "assets/images/others/ambience.png",
          sound: "assets/sounds/others/ambience.mp3",
        },
      ],
    },
  };

  const tabsContainer = document.getElementById("tabs-container");
  const soundGridContainer = document.getElementById("sound-grid-container");
  let activePackId = Object.keys(soundPacks)[0];
  let currentAudio = null;

  const createTabButton = (packId, pack) => {
    const button = document.createElement("button");
    button.className = `tab-button ${packId === activePackId ? "active" : ""}`;
    button.textContent = pack.name;
    button.dataset.packId = packId;
    return button;
  };

  const createSoundItem = (sound) => {
    const item = document.createElement("div");
    item.className = "sound-item";
    item.dataset.soundId = sound.id;
    item.innerHTML = `<img src="${sound.image}" alt="${sound.id}" /><kbd>${sound.key}</kbd>`;
    return item;
  };

  const renderTabs = () => {
    tabsContainer.innerHTML = "";
    Object.entries(soundPacks).forEach(([packId, pack]) => {
      tabsContainer.appendChild(createTabButton(packId, pack));
    });
  };

  const renderSoundGrid = () => {
    soundGridContainer.innerHTML = "";
    soundPacks[activePackId]?.sounds.forEach((sound) => {
      soundGridContainer.appendChild(createSoundItem(sound));
    });
  };

  const playSound = (soundData) => {
    if (!soundData) return;

    // Se um áudio já estiver tocando, pare-o e reinicie.
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Use a API de áudio nativa do navegador
    currentAudio = new Audio(soundData.sound);
    currentAudio.play().catch((error) => {
      console.error("Erro ao tocar o som:", error);
    });

    // Lógica para o efeito visual no item clicado.
    const soundElement = document.querySelector(
      `.sound-item[data-sound-id="${soundData.id}"]`
    );
    if (soundElement) {
      document
        .querySelectorAll(".sound-item.active")
        .forEach((el) => el.classList.remove("active"));
      soundElement.classList.add("active");
      setTimeout(() => soundElement.classList.remove("active"), 500);
    }
  };

  const handleTabClick = (event) => {
    const target = event.target.closest(".tab-button");
    if (!target) return;
    activePackId = target.dataset.packId;
    renderTabs();
    renderSoundGrid();
  };

  const handleSoundItemClick = (event) => {
    const target = event.target.closest(".sound-item");
    if (!target) return;
    const soundId = target.dataset.soundId;
    const soundData = soundPacks[activePackId].sounds.find(
      (s) => s.id === soundId
    );
    playSound(soundData);
  };

  const handleKeyPress = (event) => {
    const key = event.key.toUpperCase();
    const soundData = soundPacks[activePackId]?.sounds.find(
      (s) => s.key === key
    );
    playSound(soundData);
  };

  const init = () => {
    renderTabs();
    renderSoundGrid();
    tabsContainer.addEventListener("click", handleTabClick);
    soundGridContainer.addEventListener("click", handleSoundItemClick);
    document.body.addEventListener("keydown", handleKeyPress);
  };

  init();
});
