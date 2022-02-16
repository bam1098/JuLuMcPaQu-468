import Home from "./routes/Home/";
import Login from "./routes/Login/";
import Navbar from "./components/navbar/";
import Register from "./routes/Signup/";
import Profile from "./routes/Profile/";
import CreateGame from "./routes/Game/CreateGame";
import ActiveGame from "./routes/Game/";

import { Routes, Route } from "react-router-dom";
import io from "socket.io-client";

export default function App() {
	const endpoint = "http://localhost:5000";

	const socket = io(endpoint);
	return (
		<>
			<Navbar socket={socket} />
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
			</Routes>
		</>
	);
}
