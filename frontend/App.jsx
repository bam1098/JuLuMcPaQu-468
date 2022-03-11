import Home from "./routes/Home/";
import Login from "./routes/Login/";
import Register from "./routes/Signup/";
import Profile from "./routes/Profile/";
import CreateGame from "./routes/Game/CreateGame";
import ActiveGame from "./routes/Game/";
import CreatePuzzleGame from "./routes/Puzzles/";

import { Routes, Route } from "react-router-dom";
import io from "socket.io-client";

const endpoint = "http://localhost:5000";
const socket = io(endpoint);

export default function App() {
	return (
		<>
			<Routes>
				<Route exact path="/" element={<Home socket={socket} />} />
				<Route exact path="/login" element={<Login />} />
				<Route exact path="/signup" element={<Register />} />
				<Route exact path="/profile/:username" element={<Profile />} />
				<Route
					exact
					path="/game/create"
					element={<CreateGame socket={socket} />}
				/>
				<Route
					exact
					path="/game/:id"
					element={<ActiveGame socket={socket} />}
				/>
				<Route
					exact
					path="/puzzles/start"
					element={<CreatePuzzleGame socket={socket} />}
				/>
			</Routes>
		</>
	);
}