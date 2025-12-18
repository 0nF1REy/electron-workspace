function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();
  document.getElementById("day").textContent = now.toLocaleDateString();
}

updateClock();
setInterval(updateClock, 1000);

tsParticles.load("tsparticles", {
  particles: {
    number: { value: 60 },
    color: { value: ["#00ffe0", "#ff00ff", "#ffdd00"] },
    shape: { type: "circle" },
    opacity: { value: 0.3, random: { enable: true } },
    size: { value: 4, random: { enable: true } },
    links: {
      enable: true,
      distance: 120,
      color: "#00ffe0",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 2.5,
      direction: "none",
      random: true,
      outModes: { default: "bounce" },
    },
  },
  background: {
    color: "#101010",
  },
});
