# Chess Game

An online chess game that allows people to play with one another.

## Installation

If you do not have node installed, download it [here](https://nodejs.org/en/download/).
<br />
If you do not have yarn installed, run:

```bash
  npm install --global yarn
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/bam1098/JuLuMcPaQu-468.git
```

Go to the project directory

```bash
  cd JuLuMcPaQu-468
```

Install dependencies

```bash
  yarn install
```

Add the configuration file to backend/config.env (supplied or create your own):

```bash
  ATLAS_URI=YOUR_URI
  PORT=5000

  JWT_SECRET=YOUR_SECRET
  JWT_EXPIRE=YOUR_EXPIRE_TIME
```

Start the frontend server

```bash
  yarn dev
```

In a new terminal window, start the backend server

```bash
  cd backend/
  node server.js
```
