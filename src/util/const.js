require('dotenv').config();



const CONSECUTIVE_FAILURE_THRESHOLD = process.env.CONSECUTIVE_FAILURE_THRESHOLD;

const HEALTH_CHECK_INTERVAL = process.env.HEALTH_CHECK_INTERVAL || 1000;
const appInstances = [
    { id: 0, url: `http://localhost:${process.env.APP_INSTANCE_1_PORT}`, consecutiveFailureCount: 0, status: 'initial' },
    { id: 1, url: `http://localhost:${process.env.APP_INSTANCE_2_PORT}`, consecutiveFailureCount: 0, status: 'initial' },
    { id: 2, url: `http://localhost:${process.env.APP_INSTANCE_3_PORT}`, consecutiveFailureCount: 0, status: 'initial' },
  ];
const CONN_REFUSED = 'ECONNREFUSED';
const LOAD_BALANCER_PORT = process.env.LOAD_BALANCER_PORT;
const MAX_RETRIES = process.env.MAX_RETRIES;
const REQUEST_TIMEOUT = process.env.REQUEST_TIMEOUT // 5 seconds


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = {
    CONSECUTIVE_FAILURE_THRESHOLD,
    HEALTH_CHECK_INTERVAL,
    appInstances,
    CONN_REFUSED,
    LOAD_BALANCER_PORT,
    MAX_RETRIES,
    REQUEST_TIMEOUT,
    getRandomInt


}
