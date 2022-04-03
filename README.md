# Tribinnov Community

Fully responsive, multilingual, NodeJs forum app built using Mongoose, ExpressJs, React, Socket.IO, JWT.

![Forum screenshot](/screenshot.png)

## Installation

- Clone and install dependencies

  - `git clone https://github.com/tribinnov/tribinnov-community.git`
  - `cd MERN-Forum`
  - `npm install`

  - And install for client
    - `cd client`
    - `npm install`

- Fill environment (rename file `.env.development` to `.env`)

  - `PORT` - Express server port
  - `BACKEND` - The address where located backend
  - `CLIENT` - The address where located the react client. The backend and client must point to each other and can be the same if running on the same address
  - `MONGODB` - Your MongoDB url
  - `SECRET` - You can generate a secret key by execute the `/src/modules/utils/generate_keys.js` file in console

- Set backend address for client in file `/client/src/support/Constants.js`

## Launch

- Go to the client folder `cd client`
- Build client production build with the command `npm run build` or run with the command `npm start`

- Run backend with the command `npm start` or in development mode `npm run dev`

- Enjoy 🙌

## Update

- use the console.error to log out errors. It logs errors to the prompt in development mode and as well logs using a middleware for production.
- to run test, run the commadn `npm run test`.
- The app is decentralized from the "index.js" or the entry server in this case, for testing purposes on a different enviroment.
