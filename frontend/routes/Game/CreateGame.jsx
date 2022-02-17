import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Group, SegmentedControl, Select } from "@mantine/core";
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
		<Card>
			<h2>Create game</h2>
			{findingOpponent && <p>Finding opponent...</p>}
			<form onSubmit={createRoom}>
				<Group direction="column">
					<SegmentedControl
						value={gameType}
						onChange={setGameType}
						data={[
							{ label: "Public", value: "public" },
							{ label: "Private", value: "private" },
						]}
					/>
					{gameType === "private" && (
						<>
							<SegmentedControl
								value={color}
								onChange={setColor}
								data={[
									{ label: "White", value: "white" },
									{ label: "Black", value: "black" },
									{ label: "Random", value: "random" },
								]}
							/>
							<SegmentedControl
								value={opponent}
								onChange={setOpponent}
								data={[
									{ label: "Real player", value: "player" },
									{ label: "Computer", value: "computer" },
								]}
							/>
						</>
					)}
					{opponent === "computer" && (
						<Select
							placeholder="Choose difficulty"
							value={difficulty}
							onChange={setDifficulty}
							data={[
								{ value: 0, label: "Beginner" },
								{ value: 1, label: "Easy" },
								{ value: 2, label: "Medium" },
								{ value: 3, label: "Hard" },
								{ value: 4, label: "Expert" },
							]}
							transition="scale-y"
							transitionDuration={120}
							transitionTimingFunction="ease"
							required
						/>
					)}
					<Button
						type="submit"
						variant="gradient"
						gradient={{ from: "indigo", to: "cyan" }}
					>
						{gameType === "public" ? "Find match" : "Create room"}
					</Button>
				</Group>
			</form>
		</Card>
	);
}
