# MERN-Forum

Fully responsive NodeJs forum app built using Mongoose, ExpressJs, React, Socket.IO, JWT.

![Forum screenshot](/screenshot.png)

## Installation
- Clone and install dependencies
  - `git clone https://github.com/xrystalll/MERN-Forum.git`
  - `cd MERN-Forum`

  - Install for backend
    - `cd backend`
    - `npm install`

  - And install for client
    - `cd client`
    - `npm install`

- Fill environment (create `.env` file in `/backend`) for the backend
  - `PORT` - Express server port
  - `BACKEND` - The address where located backend
  - `CLIENT` - The address where located the react client. The backend and client must point to each other and can be the same if running on the same address
  - `MONGODB` - Your MongoDB url
  - `SECRET` - You can generate a secret key by execute the `/backend/src/modules/utils/generate_keys.js` file in console

- Set backend address for client in file `/client/src/support/Constants.js`

## Launch
  - Go to the backend folder `cd backend`
  - Run backend with the command `npm start` or in development mode `npm run dev`

  - Go to the client folder `cd client`
  - Run client with the command `npm start`

  - Enjoy 🙌
