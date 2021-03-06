# Chess Game

An online chess game that allows people to play with one another.

## Installation

If you do not have node installed, download it [here](https://nodejs.org/en/download/).
<br />
If you do not have yarn installed, run:

```bash
  npm install --global yarn
```

Alternatively, you can use Docker to run the app. Download it [here](https://docs.docker.com/get-docker/).

## Project setup

Clone the project

```bash
  git clone https://github.com/bam1098/JuLuMcPaQu-468.git
```

Go to the project directory

```bash
  cd JuLuMcPaQu-468
```

Add the configuration file to backend/config.env (supplied or create your own):

```bash
  ATLAS_URI=YOUR_URI
  PORT=5000

  JWT_SECRET=YOUR_SECRET
  JWT_EXPIRE=YOUR_EXPIRE_TIME
```

## Run Locally

Start the frontend server

```bash
  cd frontend/
  yarn install
  yarn dev
```

In a new terminal window, start the backend server

```bash
  cd backend/
  yarn install
  node server.js
```

## Run with Docker

In the root directory:

```bash
  docker-compose up --build
```

## View the application

Navigate to `http://localhost:3000/` in your browser of choice
