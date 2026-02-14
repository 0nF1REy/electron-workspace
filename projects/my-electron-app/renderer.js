const func = async () => {
  const response = await window.versions.ping();
  console.log(response);
};

func();

document.getElementById("node-version").innerText = window.versions.node();
document.getElementById("chrome-version").innerText = window.versions.chrome();
document.getElementById("electron-version").innerText =
  window.versions.electron();
