import "./index.css";

const counterEl = document.querySelector("#counter");

const btn = document.querySelector("#default") as HTMLButtonElement;

const mainThreadsBtn = document.querySelector(
  "#main-thread"
) as HTMLButtonElement;

const workerThreadsBtn = document.querySelector(
  "#worker-thread"
) as HTMLButtonElement;

let counter = 0;

btn.onclick = () => {
  counter++;
  counterEl.textContent = counter.toString();
};

mainThreadsBtn.onclick = () => {
  window.electron.start_heavy_counter();
};

workerThreadsBtn.onclick = () => {
  window.electron.start_heavy_worker_counter();
};
