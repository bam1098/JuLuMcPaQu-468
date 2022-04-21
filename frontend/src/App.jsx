import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Signup";
import Profile from "./routes/Profile";
import CreateGame from "./routes/Game/CreateGame";
import ActiveGame from "./routes/Game";
import AnalyzeGame from "./routes/Game/AnalyzeGame";
import Error from "./routes/Error";

import { Routes, Route } from "react-router-dom";
import io from "socket.io-client";

const endpoint = "http://localhost:5000";
const socket = io(endpoint, { transports: ["websocket"] });

export default function App() {
	return (
		<>
			<Routes>
				<Route path="*" element={<Error />} />
				<Route index path="/" element={<Home socket={socket} />} />
				<Route path="login" element={<Login />} />
				<Route path="signup" element={<Register />} />
				<Route path="profile/:username" element={<Profile />} />
				<Route path="game/create" element={<CreateGame socket={socket} />} />
				<Route path="game/:id" element={<ActiveGame socket={socket} />} />
				<Route path=":username/analyze/:gameId" element={<AnalyzeGame />} />
			</Routes>
		</>
	);
}
