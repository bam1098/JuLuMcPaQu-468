import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export default function CreateGame({ socket }) {
	const [gameType, setGameType] = useState("public");
	const [color, setColor] = useState("white");
	const [user, setUser] = useState(null);
	const [opponent, setOpponent] = useState("player");
	const [difficulty, setDifficulty] = useState(0);
	const [findingOpponent, setFindingOpponent] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		if (!localStorage.getItem("authToken")) {
			navigate("/signup");
		} else {
			const loggedInUser = jwt_decode(localStorage.getItem("authToken"));
			setUser(loggedInUser);
		}
	}, []);

	const createRoom = (e) => {
		e.preventDefault();
		socket.emit("createRoom", {
			gameType,
			username: user["username"],
			timeControl: "5",
			color: color,
			opponent: opponent,
			difficulty: difficulty,
		});
	};

	socket.on("roomId", (roomId) => {
		navigate(`/game/${roomId}`);
	});

	socket.on("findingOpponent", () => {
		setFindingOpponent(true);
	});

	return (
		<div>
			<h2>Create game</h2>
			{findingOpponent && <p>Finding opponent...</p>}
			<form onSubmit={createRoom}>
				<select onChange={(e) => setGameType(e.target.value)}>
					<option value="public">Public</option>
					<option value="private">Private</option>
				</select>
				{gameType === "private" && (
					<>
						<select onChange={(e) => setColor(e.target.value)}>
							<option value="white">White</option>
							<option value="black">Black</option>
							<option value="random">Random</option>
						</select>
						<select onChange={(e) => setOpponent(e.target.value)}>
							<option value="player">Real player</option>
							<option value="computer">Computer</option>
						</select>
					</>
				)}
				{opponent === "computer" && (
					<select onChange={(e) => setDifficulty(e.target.value)}>
						<option value={0}>Beginner</option>
						<option value={1}>Easy</option>
						<option value={2}>Medium</option>
						<option value={3}>Hard</option>
						<option value={4}>Expert</option>
					</select>
				)}
				<button type="submit">
					{gameType === "public" ? "Find match" : "Create room"}
				</button>
			</form>
		</div>
	);
}
