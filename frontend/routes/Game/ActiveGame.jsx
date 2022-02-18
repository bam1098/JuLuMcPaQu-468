import "./ActiveGame.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Board from "../../components/Board";
import jwt_decode from "jwt-decode";

export default function ActiveGame({ socket }) {
	const params = useParams();
	const navigate = useNavigate();
	const [gameEnded, setGameEnded] = useState(false);
	const [endResult, setEndResult] = useState({});
	if (!localStorage.getItem("authToken")) {
		navigate("/signup");
		return;
	}
	const [user, setUser] = useState(
		jwt_decode(localStorage.getItem("authToken"))
	);

	useEffect(() => {
		socket.emit("joinRoom", {
			username: user.username,
			roomId: params.id,
		});
	}, []);

	socket.on("roomRedirect", (room) => {
		navigate(`/game/${room}`);
		return;
	});

	socket.on("roomNotFound", () => {
		navigate("/game/create");
		return;
	});

	socket.on("roomFull", () => {
		navigate("/game/create");
		return;
	});

	socket.on("endGame", (result) => {
		console.log(result.winner);
		setGameEnded(true);
		setEndResult(result);
	});

	const sendChat = (e) => {
		e.preventDefault();
		console.log("Todo: send chat");
	};

	return (
		<>
			<div className="parent-container">
				{gameEnded ? (
					<div className="info-container">
						{console.log(endResult)}
						<h2>
							{endResult.winner === undefined
								? "The game has ended in a draw!"
								: `${endResult.winner} has won the game!`}
						</h2>
						<h3>
							{endResult.draw === false && endResult.winner === user.username
								? "Congratulations!"
								: "Better luck next time!"}
						</h3>
					</div>
				) : (
					<div></div>
				)}
				<div className="board-container">
					<Board socket={socket} roomId={params.id} user={user} />
				</div>
				<div className="chat-container">
					<div className="chat">
						<div className="chat-header">
							<p>Chat</p>
						</div>
						<div className="chat-body">{/* TODO */}</div>
						<form onSubmit={sendChat}>
							<input type="text" />
							<button type="submit">Send</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
