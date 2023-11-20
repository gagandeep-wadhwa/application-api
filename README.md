# Sample Load Balancer Project

# Pre-requisites
- Download the zip shared in the mail.
- Unzip the folder.
- Go the application-api folder
- Install [Node.js](https://nodejs.org/en/) version > 16.0.0


# Getting started
- Open a Terminal/Command Prompt and run the following commands to install dependencies
```
npm install
```
- Build and run the project
```
npm run start:apiserver
```
- Open a new Terminal/Command Prompt Window and Run
```
npm start:loadbalancer
```
  Open any postman or similar application to invoke the post web api request to the load balancer with route

  `http://localhost:3000/round-robin-api`  using sample request payload i.e

  ```
  {"game":"Mobile Legends", "gamerID":"GYUTDTE", "points":21}
  
  ```


  Every time you try to invoke a web api request, it will be served in a round robin fashion.

  There is a health checker in the load balancer to check the health of the node container.

# Javascript + Node 
The main purpose of this repository is to show a load balancer project setup.




## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains  source code                               |
| **configuration**        | Application configuration including environment-specific configs 
| **src/load-balaner**      | Router that define load balancer module. 
| **src/api-server**         | Node server for the app instance  
| **package.json**             | Contains npm dependencies as well as [build scripts]

# Testing

I didn't get chance to write test cases for the same. For the workaroud, we can tweak load balancer configuration using the following variables
APP_INSTANCE_1_PORT =3001
APP_INSTANCE_2_PORT=3002
APP_INSTANCE_3_PORT=3003 
ports in the application-api/.env file to play with the load balancer and try restarting the load balancer(`npm start:loadbalancer`) in case of different scenarios.


# Common Issues

## npm install fails
The current solution has an example for using a wrong node version

