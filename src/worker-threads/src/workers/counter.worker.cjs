const { workerData, parentPort } = require("worker_threads");
const fs = require("fs");

const counterFn = () => {
  let counter = 0;
  while (counter < 500000) {
    fs.readdirSync("./");
    counter++;
  }
  return counter;
};

const main = () => {
  const { testData } = workerData;
  console.log("testDatatestData", testData);
  const counter = counterFn();
  parentPort.postMessage({ counter });
};

main();
