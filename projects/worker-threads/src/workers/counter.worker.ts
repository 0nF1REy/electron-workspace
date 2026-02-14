import { workerData, parentPort } from "node:worker_threads";

const counterFn = () => {
  let counter = 0;
  while (counter < 500000) {
    counter++;
  }
  return counter;
};

const { testData } = workerData;
console.log("Worker iniciado com:", testData);

const result = counterFn();

parentPort?.postMessage({ counter: result });
