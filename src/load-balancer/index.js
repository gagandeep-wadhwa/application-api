const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { getNextHealthyInstance, performHealthChecks } = require("./health-checker")
const { CONN_REFUSED, HEALTH_CHECK_INTERVAL, LOAD_BALANCER_PORT, MAX_RETRIES, REQUEST_TIMEOUT } = require('../util/const');

const app = express();

let currentIndex = 0;

app.use(bodyParser.json());


async function forwardRequestWithExponentialBackoff(targetInstanceUrl, requestData) {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const response =await axios.post(targetInstanceUrl, requestData, { timeout: REQUEST_TIMEOUT });
      return response.data;
    } catch (error) {
      retries++;

      if (error.code === CONN_REFUSED) {
        const waitTime = Math.pow(2, retries) * 1000;
        console.warn(`Retry ${retries} for ${targetInstanceUrl}. Waiting for ${waitTime / 1000} seconds.`);
        sleep(waitTime);
      } else {
        throw error;
      }
    }
  }

  throw new Error(`Request to ${targetInstanceUrl} failed after ${MAX_RETRIES} retries.`);
}

function handleNextInstanceWithExponentialBackoff(req, res) {
  if (currentIndex === 0) {
    console.error('All application instances are down.');
    res.status(500).json({ error: 'Internal Server Error' });
  } else {
    const targetInstance = appInstances[currentIndex];
    currentIndex = (currentIndex + 1) % appInstances.length;

    try {
      const response = forwardRequestWithExponentialBackoff(targetInstance.url, req.body);
      res.json(response);
    } catch (error) {
      console.error(`Error forwarding request to ${targetInstance.url}: ${error.message}`);
      handleNextInstanceWithExponentialBackoff(req, res);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.post('/round-robin-api', async (req, res) => {
  const targetInstance = getNextHealthyInstance();

  try {
    const response = await forwardRequestWithExponentialBackoff(targetInstance.url+"/game", req.body);
    console.error(`Req served by ${targetInstance.url}`);
    res.status(200).json(response);
  } catch (error) {
    console.error(`Error forwarding request to ${targetInstance.url}: ${error.message}`);

    if (error.code === CONN_REFUSED) {
      handleNextInstanceWithExponentialBackoff(req, res);
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.listen(LOAD_BALANCER_PORT, () => {
  console.log(`Round Robin API listening at http://localhost:${LOAD_BALANCER_PORT}`);
});

setInterval(performHealthChecks, HEALTH_CHECK_INTERVAL);
