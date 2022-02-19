import "./ActiveGame.css";
import { Chess } from "chess.js";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Button,
	Card,
	Divider,
	Group,
	ScrollArea,
	TextInput,
} from "@mantine/core";
import Board from "../../components/Board";
import jwt_decode from "jwt-decode";
import EndGameModal from "../../components/EndGameModal";

export default function ActiveGame({ socket }) {
	const params = useParams();
	const navigate = useNavigate();
	const [game, setGame] = useState(new Chess());
	const [gameState, setGameState] = useState({});
	const [fen, setFen] = useState(game.fen());
	const [opponent, setOpponent] = useState("");
	const [endResult, setEndResult] = useState({});
	const [chatMessages, setChatMessages] = useState([]);
	const [gameEnded, setGameEnded] = useState(false);
	const [rematchRequestSent, setRematchRequestSent] = useState(false);

	if (!localStorage.getItem("authToken")) {
		navigate("/signup");
		return;
	}
	const [user, setUser] = useState(
		jwt_decode(localStorage.getItem("authToken"))
	);

	const chatViewport = useRef();
	const scrollToBottom = () =>
		chatViewport.current.scrollTo({
			top: chatViewport.current.scrollHeight,
			behavior: "smooth",
		});

	useEffect(() => {
		socket.emit("joinRoom", {
			username: user.username,
			roomId: params.id,
		});
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
			setGameEnded(true);
			setEndResult(result);
		});

		socket.on("receiveMessage", (chatMessage) => {
			setChatMessages((previousMessages) => [...previousMessages, chatMessage]);
			scrollToBottom();
		});
	}, []);

	const sendChat = (e) => {
		e.preventDefault();
		let chatMessage = e.target.elements.message.value;
		if (chatMessage !== "") {
			chatMessage = chatMessage.trim();
			const roomId = params.id;
			socket.emit("sendMessage", {
				sender: user["username"],
				message: chatMessage,
				roomId,
			});
		}
		e.target.elements.message.value = "";
		e.target.elements.message.focus();
	};

	const renderChat = () => {
		return chatMessages.map((message, index) => (
			<p key={index}>
				{message.sender}: <span>{message.message}</span>
			</p>
		));
	};

	return (
		<>
			<div className="parent-container">
				<EndGameModal
					gameEnded={gameEnded}
					setGameEnded={setGameEnded}
					endResult={endResult}
					rematchRequestSent={rematchRequestSent}
					setRematchRequestSent={setRematchRequestSent}
					user={user}
					socket={socket}
				/>
				<div className="board-container">
					<Board
						game={game}
						setGame={setGame}
						gameState={gameState}
						setGameState={setGameState}
						fen={fen}
						setFen={setFen}
						socket={socket}
						roomId={params.id}
						user={user}
						opponent={opponent}
						setOpponent={setOpponent}
					/>
				</div>
				<Card className="chat-card">
					<h2>Chat</h2>
					<Divider />
					<form onSubmit={sendChat}>
						<ScrollArea style={{ height: "250px" }} viewportRef={chatViewport}>
							{renderChat()}
						</ScrollArea>
						<Divider />
						<Group spacing="xs" noWrap style={{ marginTop: "1rem" }}>
							<TextInput type="text" name="message" />
							<Button type="submit" variant="gradient">
								Send
							</Button>
						</Group>
					</form>
				</Card>
			</div>
		</>
	);
}
