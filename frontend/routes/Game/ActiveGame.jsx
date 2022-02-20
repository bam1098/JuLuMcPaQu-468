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
	const [modalOpened, setModalOpened] = useState(false);
	const [rematchRequestSent, setRematchRequestSent] = useState(false);
	const [chessboardSize, setChessboardSize] = useState(undefined);

	if (!localStorage.getItem("authToken")) {
		navigate("/signup");
		return;
	}
	const [user, setUser] = useState(
		jwt_decode(localStorage.getItem("authToken"))
	);

	const chatViewport = useRef();
	const containerRef = useRef();
	const scrollToBottom = () =>
		chatViewport.current.scrollTo({
			top: chatViewport.current.scrollHeight,
			behavior: "smooth",
		});

	useEffect(() => {
		function handleResize() {
			const display = containerRef.current;
			setChessboardSize(display.offsetWidth - 100);
		}
		window.addEventListener("resize", handleResize);
		handleResize();
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
			setModalOpened(true);
			setEndResult(result);
		});

		socket.on("receiveMessage", (chatMessage) => {
			setChatMessages((previousMessages) => [...previousMessages, chatMessage]);
			scrollToBottom();
		});

		return () => {
			window.removeEventListener("resize", handleResize);
			socket.off();
		};
	}, []);

	const sendRematchRequest = () => {
		if (rematchRequestSent) {
			setRematchRequestSent(false);
			socket.emit("cancelRematchRequest");
		} else {
			setRematchRequestSent(true);
			socket.emit("rematchRequest");
		}
	};

	const resign = () => {
		const roomId = params.id;
		socket.emit("gameOver", {
			game: gameState,
			roomId,
			draw: false,
			winner: opponent,
			loser: user.username,
		});
	};

	const sendChat = (e) => {
		e.preventDefault();
		let chatMessage = e.target.elements.message.value.trim();
		if (chatMessage !== "") {
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
			<div
				className="game-container"
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div
					className="parent-container"
					style={{ width: "100%", height: "calc(100vh - 32px)" }}
				>
					<EndGameModal
						modalOpened={modalOpened}
						setModalOpened={setModalOpened}
						endResult={endResult}
						sendRematchRequest={sendRematchRequest}
						rematchRequestSent={rematchRequestSent}
						setRematchRequestSent={setRematchRequestSent}
						user={user}
						navigate={navigate}
					/>
					<div
						className="board-container"
						style={{ maxWidth: "940px" }}
						ref={containerRef}
					>
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
							boardWidth={chessboardSize}
						/>
					</div>
					<Card className="chat-card">
						<h2>Chat</h2>
						<Divider />
						<ScrollArea style={{ height: "250px" }} viewportRef={chatViewport}>
							{renderChat()}
						</ScrollArea>
						<Divider />
						<form onSubmit={sendChat}>
							<Group spacing="xs" noWrap style={{ margin: "1rem 0" }}>
								<TextInput type="text" name="message" />
								<Button type="submit" variant="gradient">
									Send
								</Button>
							</Group>
						</form>
						{!modalOpened && (
							<>
								<Group spacing="xs" noWrap style={{ marginTop: "1rem" }}>
									{gameEnded ? (
										<>
											<Button variant="light" style={{ width: "50%" }}>
												Rematch
											</Button>
											<Button
												variant="light"
												style={{ width: "50%" }}
												onClick={() => navigate("/game/create")}
											>
												New game
											</Button>
										</>
									) : (
										<>
											{opponent !== "Computer" && (
												<Button variant="light" style={{ width: "50%" }}>
													Draw
												</Button>
											)}
											<Button
												variant="light"
												style={{
													width: opponent !== "Computer" ? "50%" : "100%",
												}}
												onClick={() => resign()}
											>
												Resign
											</Button>
										</>
									)}
								</Group>
							</>
						)}
					</Card>
				</div>
			</div>
		</>
	);
}
