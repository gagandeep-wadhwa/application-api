const axios = require('axios');
const { CONSECUTIVE_FAILURE_THRESHOLD } = require('../util/const');
const { appInstances , getRandomInt} = require('../util/const');

let currentIndex = 0;


function resetConsecutiveFailureCount(instance) {
  instance.consecutiveFailureCount = 0;
}

async function performHealthChecks() {
  console.log('Performing health checks...');

  for (const instance of appInstances) {
    try {
      // Perform a simple health check (you can replace this with your own health-checking mechanism)
      await axios.get(`${instance.url}/health`);

      // Update the health status to 'healthy' and reset consecutive failure count
      instance.status = 'healthy';
      resetConsecutiveFailureCount(instance);
    } catch (error) {
      // If the health check fails and the threshold is not reached, mark the instance as 'unhealthy'

      if (error.response && error.response.status === 404) {
        // Handle "Not Found" error
        console.error(`Health check failed for ${instance.url}. Endpoint not found.`);
      } else {
        // Handle other errors
        console.error(`Health check failed for ${instance.url}: ${error.message}`);

        // Increment consecutive failure count for the instance
        instance.consecutiveFailureCount = (instance.consecutiveFailureCount || 0) + 1;

        // If consecutive failures reach the threshold, mark the instance as 'unhealthy'
        if (instance.consecutiveFailureCount >= CONSECUTIVE_FAILURE_THRESHOLD) {
          console.error(`Marking ${instance.url} as 'unhealthy' due to consecutive failures.`);
          instance.status = 'unhealthy';
        }
      }
    }
  }
}


function getHealthyInstance() {
  for (let i = 0; i < appInstances.length; i++) {
    const targetInstance = appInstances[currentIndex];

    currentIndex = (currentIndex + 1) % appInstances.length;

    if (targetInstance.status === 'healthy') {
      return targetInstance;
    }
  }

  return appInstances[getRandomInt(3)];
}

module.exports = { getHealthyInstance, performHealthChecks };
