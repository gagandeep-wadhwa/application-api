const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const {
  getHealthyInstance,
  performHealthChecks,
} = require("./health-checker");
const {
  HEALTH_CHECK_INTERVAL,
  LOAD_BALANCER_PORT,
  MAX_RETRIES,
  REQUEST_TIMEOUT,
} = require("../util/const");

const { appInstances } = require('../util/const');

const app = express();

app.use(bodyParser.json());

async function forwardRequestWithExponentialBackoff(
  targetInstanceUrl,
  requestData
) {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.post(targetInstanceUrl, requestData, {
        timeout: REQUEST_TIMEOUT,
      });
      return response.data;
    } catch (error) {
      retries++;

      const waitTime = Math.pow(2, retries) * 1000;
      console.warn(
        `Retry ${retries} for ${targetInstanceUrl}. Waiting for ${
          waitTime / 1000
        } seconds.`
      );
      await sleep(waitTime);
    }
  }

  throw new Error(
    `Request to ${targetInstanceUrl} failed after ${MAX_RETRIES} retries.`
  );
}

async function forwardRequest(
  targetInstanceUrl,
  requestData
) {
    try {
      const response = await axios.post(targetInstanceUrl, requestData, {
        timeout: REQUEST_TIMEOUT,
      });
      return response.data;
    } catch (error) {
        throw error
    }
  }

async function handleNextInstanceWithExponentialBackoff(req, res, currentId, retries, waitTime) {
  if(retries >= MAX_RETRIES){
    console.error("All application instances are down. Couldn't serve your request. Please try after some time");
    return res.status(503).json({ error: "All application instances are down. Couldn't serve your request. Please try after some time" });
  }
    const targetInstance = appInstances[currentId % appInstances.length];
    waitTime = Math.pow(2, retries) * 1000;
    await sleep(waitTime);
    console.warn(
      `Retry ${retries} for ${targetInstance.url}. Waiting for ${
        waitTime / 1000
      } seconds.`
    );
    try {
      const response = await forwardRequest(
        targetInstance.url,
        req.body
      );
      currentId++;
       console.error(`Req served by ${targetInstance.url}`);
      return res.json(response);
    } catch (error) {
      currentId++;
      handleNextInstanceWithExponentialBackoff(req, res, currentId, retries+1, waitTime);
    }
 
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.post("/round-robin-api", async (req, res) => {
  const targetInstance = getHealthyInstance();

  try {
    const response = await forwardRequest(
      targetInstance.url + "/game",
      req.body
    );
    console.error(`Req served by ${targetInstance.url}`);
    res.status(200).json(response);
  } catch (error) {
    await handleNextInstanceWithExponentialBackoff(req, res, targetInstance.id+1, 1, 0);
  }
});

app.listen(LOAD_BALANCER_PORT, () => {
  console.log(
    `Round Robin API listening at http://localhost:${LOAD_BALANCER_PORT}`
  );
});

setInterval(performHealthChecks, HEALTH_CHECK_INTERVAL);
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const {
  getHealthyInstance,
  performHealthChecks,
} = require("./health-checker");
const {
  HEALTH_CHECK_INTERVAL,
  LOAD_BALANCER_PORT,
  MAX_RETRIES,
  REQUEST_TIMEOUT,
} = require("../util/const");

const { appInstances } = require('../util/const');

const app = express();

app.use(bodyParser.json());

async function forwardRequestWithExponentialBackoff(
  targetInstanceUrl,
  requestData
) {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.post(targetInstanceUrl, requestData, {
        timeout: REQUEST_TIMEOUT,
      });
      return response.data;
    } catch (error) {
      retries++;

      const waitTime = Math.pow(2, retries) * 1000;
      console.warn(
        `Retry ${retries} for ${targetInstanceUrl}. Waiting for ${
          waitTime / 1000
        } seconds.`
      );
      await sleep(waitTime);
    }
  }

  throw new Error(
    `Request to ${targetInstanceUrl} failed after ${MAX_RETRIES} retries.`
  );
}

async function forwardRequest(
  targetInstanceUrl,
  requestData
) {
    try {
      const response = await axios.post(targetInstanceUrl, requestData, {
        timeout: REQUEST_TIMEOUT,
      });
      return response.data;
    } catch (error) {
        throw error
    }
  }

async function handleNextInstanceWithExponentialBackoff(req, res, currentId, retries, waitTime) {
  if(retries >= MAX_RETRIES){
    console.error("All application instances are down. Couldn't serve your request. Please try after some time");
    return res.status(503).json({ error: "All application instances are down. Couldn't serve your request. Please try after some time" });
  }
    const targetInstance = appInstances[currentId % appInstances.length];
    waitTime = Math.pow(2, retries) * 1000;
    await sleep(waitTime);
    console.warn(
      `Retry ${retries} for ${targetInstance.url}. Waiting for ${
        waitTime / 1000
      } seconds.`
    );
    try {
      const response = await forwardRequest(
        targetInstance.url,
        req.body
      );
      currentId++;
       console.error(`Req served by ${targetInstance.url}`);
      return res.json(response);
    } catch (error) {
      currentId++;
      handleNextInstanceWithExponentialBackoff(req, res, currentId, retries+1, waitTime);
    }
 
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.post("/round-robin-api", async (req, res) => {
  const targetInstance = getHealthyInstance();

  try {
    const response = await forwardRequest(
      targetInstance.url + "/game",
      req.body
    );
    console.error(`Req served by ${targetInstance.url}`);
    res.status(200).json(response);
  } catch (error) {
    await handleNextInstanceWithExponentialBackoff(req, res, targetInstance.id+1, 1, 0);
  }
});

app.listen(LOAD_BALANCER_PORT, () => {
  console.log(
    `Round Robin API listening at http://localhost:${LOAD_BALANCER_PORT}`
  );
});

setInterval(performHealthChecks, HEALTH_CHECK_INTERVAL);
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const {
  getHealthyInstance,
  performHealthChecks,
} = require("./health-checker");
const {
  HEALTH_CHECK_INTERVAL,
  LOAD_BALANCER_PORT,
  MAX_RETRIES,
  REQUEST_TIMEOUT,
} = require("../util/const");

const { appInstances } = require('../util/const');

const app = express();

app.use(bodyParser.json());

async function forwardRequestWithExponentialBackoff(
  targetInstanceUrl,
  requestData
) {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.post(targetInstanceUrl, requestData, {
        timeout: REQUEST_TIMEOUT,
      });
      return response.data;
    } catch (error) {
      retries++;

      const waitTime = Math.pow(2, retries) * 1000;
      console.warn(
        `Retry ${retries} for ${targetInstanceUrl}. Waiting for ${
          waitTime / 1000
        } seconds.`
      );
      await sleep(waitTime);
    }
  }

  throw new Error(
    `Request to ${targetInstanceUrl} failed after ${MAX_RETRIES} retries.`
  );
}

async function forwardRequest(
  targetInstanceUrl,
  requestData
) {
    try {
      const response = await axios.post(targetInstanceUrl, requestData, {
        timeout: REQUEST_TIMEOUT,
      });
      return response.data;
    } catch (error) {
        throw error
    }
  }

async function handleNextInstanceWithExponentialBackoff(req, res, currentId, retries, waitTime) {
  if(retries >= MAX_RETRIES){
    console.error("All application instances are down. Couldn't serve your request. Please try after some time");
    return res.status(503).json({ error: "All application instances are down. Couldn't serve your request. Please try after some time" });
  }
    const targetInstance = appInstances[currentId % appInstances.length];
    waitTime = Math.pow(2, retries) * 1000;
    await sleep(waitTime);
    console.warn(
      `Retry ${retries} for ${targetInstance.url}. Waiting for ${
        waitTime / 1000
      } seconds.`
    );
    try {
      const response = await forwardRequest(
        targetInstance.url,
        req.body
      );
      currentId++;
       console.error(`Req served by ${targetInstance.url}`);
      return res.json(response);
    } catch (error) {
      currentId++;
      handleNextInstanceWithExponentialBackoff(req, res, currentId, retries+1, waitTime);
    }
 
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.post("/round-robin-api", async (req, res) => {
  const targetInstance = getHealthyInstance();

  try {
    const response = await forwardRequest(
      targetInstance.url + "/game",
      req.body
    );
    console.error(`Req served by ${targetInstance.url}`);
    res.status(200).json(response);
  } catch (error) {
    await handleNextInstanceWithExponentialBackoff(req, res, targetInstance.id+1, 1, 0);
  }
});

app.listen(LOAD_BALANCER_PORT, () => {
  console.log(
    `Round Robin API listening at http://localhost:${LOAD_BALANCER_PORT}`
  );
});

setInterval(performHealthChecks, HEALTH_CHECK_INTERVAL);
