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
	Text,
	TextInput,
} from "@mantine/core";
import {
	IoPlaySkipForward,
	IoPlaySkipBack,
	IoPlayForward,
	IoPlayBack,
} from "react-icons/io5";
import Board from "../../components/Board";
import jwt_decode from "jwt-decode";
import EndGameModal from "../../components/EndGameModal";

export default function ActiveGame({ socket }) {
	const params = useParams();
	const navigate = useNavigate();
	const [game, setGame] = useState(new Chess());
	const [gameState, setGameState] = useState({});
	const [fen, setFen] = useState(game.fen());
	const [fenHistory, setFenHistory] = useState([]);
	const [opponent, setOpponent] = useState("");
	const [endResult, setEndResult] = useState({});
	const [chatMessages, setChatMessages] = useState([]);
	const [gameEnded, setGameEnded] = useState(false);
	const [modalOpened, setModalOpened] = useState(false);
	const [rematchRequestSent, setRematchRequestSent] = useState(false);
	const [rematchRequestReceived, setRematchRequestReceived] = useState(false);
	const [rematchRequestDeclined, setrematchRequestDeclined] = useState(false);
	const [drawOfferSent, setDrawOfferSent] = useState(false);
	const [drawOfferReceived, setDrawOfferReceived] = useState(false);
	const [chessboardSize, setChessboardSize] = useState(undefined);

	if (!localStorage.getItem("authToken")) {
		navigate("/signup");
		return;
	}
	const [user, setUser] = useState(
		jwt_decode(localStorage.getItem("authToken"))
	);

	const chatViewport = useRef();
	const historyViewport = useRef();
	const containerRef = useRef();
	const scrollToBottom = () =>
		chatViewport.current.scrollTo({
			top: chatViewport.current.scrollHeight,
			behavior: "smooth",
		});
	const scrollToHistoryBottom = () =>
		historyViewport.current.scrollTo({
			top: historyViewport.current.scrollHeight,
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

		socket.on("drawOffered", () => {
			setDrawOfferReceived(true);
		});

		socket.on("drawOfferDeclined", () => {
			setDrawOfferSent(false);
			setDrawOfferReceived(false);
		});

		socket.on("drawOfferCancelled", () => {
			setDrawOfferSent(false);
			setDrawOfferReceived(false);
		});

		socket.on("rematchRequested", () => {
			setRematchRequestReceived(true);
		});

		socket.on("rematchRequestDeclined", () => {
			setrematchRequestDeclined(true);
		});

		socket.on("refreshGame", () => {
			location.reload();
		});

		return () => {
			window.removeEventListener("resize", handleResize);
			socket.off();
		};
	}, []);

	useEffect(() => {
		scrollToHistoryBottom();
	}, [fenHistory]);

	const sendRematchRequest = () => {
		if (rematchRequestReceived) {
			let data = gameState;
			for (let key of Object.keys(data.players)) {
				if (data.players[key].color === "white") {
					data.players[key].color = "black";
				} else {
					data.players[key].color = "white";
				}
			}
			data.roomId = params.id;
			socket.emit("restartGame", data);
		} else {
			setRematchRequestSent(true);
			socket.emit("rematchRequest", {
				roomId: `${params.id}-chat`,
				username: user.username,
				opponent,
			});
		}
	};

	const offerDraw = () => {
		const roomId = params.id;
		if (drawOfferReceived) {
			socket.emit("gameOver", {
				game: gameState,
				roomId,
				draw: true,
				playerOne: user.username,
				playerTwo: opponent,
			});
		} else {
			if (drawOfferSent) {
				setDrawOfferSent(false);
				socket.emit("cancelDrawOffer", {
					roomId,
					username: user.username,
				});
			} else {
				setDrawOfferSent(true);
				socket.emit("drawOffer", {
					roomId,
					username: user.username,
				});
			}
		}
	};

	const declineDraw = () => {
		setDrawOfferReceived(false);
		socket.emit("declineDrawOffer", {
			roomId: params.id,
			username: user.username,
		});
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

	const declineRematch = () => {
		socket.emit("declineRematchRequest", {
			roomId: `${params.id}-chat`,
			username: user.username,
		});
	};

	const sendChat = (e) => {
		e.preventDefault();
		let chatMessage = e.target.elements.message.value.trim();
		if (chatMessage !== "") {
			const roomId = `${params.id}-chat`;
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
			<Text
				key={index}
				color={message.sender === "System" ? "dimmed" : ""}
				component="p"
			>
				{message.sender}: <span>{message.message}</span>
			</Text>
		));
	};

	const renderHistory = () => {
		let gameHistory = game.history();
		let finalHistory = [];
		for (let i = 0; i < gameHistory.length; i += 2) {
			try {
				finalHistory.push([
					{ move: gameHistory[i], moveIndex: i },
					{ move: gameHistory[i + 1], moveIndex: i + 1 },
				]);
			} catch {
				finalHistory.push([gameHistory[i]]);
			}
		}
		return finalHistory.map((turn, index) => (
			<Group key={index} position="left" noWrap spacing={0}>
				<Text component="p" style={{ width: "10%" }}>
					{index + 1}.
				</Text>

				<Button
					variant="subtle"
					style={{
						width: "45%",
						backgroundColor:
							fenHistory.indexOf(fen) === turn[0].moveIndex + 1
								? "rgba(25, 113, 194, 0.35)"
								: "",
						fontFamily: "Noto Chess, Noto Sans",
						fontSize: "0.95rem",
					}}
					onClick={() => setFen(fenHistory[turn[0].moveIndex + 1])}
				>
					{turn[0].move}
				</Button>
				{turn[1].move !== undefined && (
					<Button
						variant="subtle"
						style={{
							width: "45%",
							backgroundColor:
								fenHistory.indexOf(fen) === turn[1].moveIndex + 1
									? "rgba(25, 113, 194, 0.35)"
									: "",
							fontFamily: "Noto Chess, Noto Sans",
							fontSize: "0.95rem",
						}}
						onClick={() => setFen(fenHistory[turn[1].moveIndex + 1])}
					>
						{turn[1].move}
					</Button>
				)}
			</Group>
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
						gameState={gameState}
						modalOpened={modalOpened}
						setModalOpened={setModalOpened}
						endResult={endResult}
						sendRematchRequest={sendRematchRequest}
						rematchRequestSent={rematchRequestSent}
						rematchRequestReceived={rematchRequestReceived}
						setRematchRequestReceived={setRematchRequestReceived}
						rematchRequestDeclined={rematchRequestDeclined}
						setRematchRequestSent={setRematchRequestSent}
						declineRematch={declineRematch}
						user={user}
						socket={socket}
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
							setFenHistory={setFenHistory}
							socket={socket}
							roomId={params.id}
							user={user}
							opponent={opponent}
							setOpponent={setOpponent}
							boardWidth={chessboardSize}
						/>
					</div>
					<Card className="chat-card">
						<Text style={{ fontSize: "1.5em", fontWeight: "bold" }}>
							History
						</Text>
						<Divider />
						<ScrollArea
							style={{ height: "150px", marginBottom: "0.25em" }}
							viewportRef={historyViewport}
						>
							{renderHistory()}
						</ScrollArea>
						<Divider />
						<Group>
							<Button variant="subtle" onClick={() => setFen(fenHistory[0])}>
								<IoPlayBack />
							</Button>
							<Button
								variant="subtle"
								onClick={() => {
									if (fenHistory.indexOf(fen) !== 0) {
										setFen(fenHistory[fenHistory.indexOf(fen) - 1]);
									}
								}}
							>
								<IoPlaySkipBack />
							</Button>
							<Button
								variant="subtle"
								onClick={() => {
									if (fenHistory.indexOf(fen) !== fenHistory.length - 1) {
										setFen(fenHistory[fenHistory.indexOf(fen) + 1]);
									}
								}}
							>
								<IoPlaySkipForward />
							</Button>
							<Button
								variant="subtle"
								onClick={() => setFen(fenHistory[fenHistory.length - 1])}
							>
								<IoPlayForward />
							</Button>
						</Group>
						<Divider />
						{opponent !== "Computer" && (
							<>
								<Text style={{ fontSize: "1.5em", fontWeight: "bold" }}>
									Chat
								</Text>
								<Divider />
								<ScrollArea
									style={{ height: "250px" }}
									viewportRef={chatViewport}
								>
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
							</>
						)}
						{!modalOpened && (
							<>
								<Group
									spacing="xs"
									noWrap={!drawOfferReceived && !rematchRequestReceived}
									style={{ marginTop: "1rem" }}
								>
									{gameEnded ? (
										<>
											{rematchRequestReceived ? (
												<>
													<Button
														variant="light"
														style={{ width: "48%", padding: 0 }}
														disabled={rematchRequestDeclined}
														onClick={() => {
															sendRematchRequest();
														}}
													>
														Accept rematch
													</Button>
													<Button
														variant="light"
														disabled={rematchRequestDeclined}
														style={{ width: "48%", padding: 0 }}
														onClick={() => declineRematch()}
													>
														Decline rematch
													</Button>
												</>
											) : (
												<Button
													variant="light"
													disabled={
														rematchRequestSent || rematchRequestDeclined
													}
													onClick={() => sendRematchRequest()}
													style={{ width: "50%", padding: 0 }}
												>
													{rematchRequestDeclined
														? "Request declined"
														: rematchRequestSent
														? "Request sent"
														: "Rematch"}
												</Button>
											)}
											<Button
												variant="light"
												style={{
													width: rematchRequestReceived ? "100%" : "50%",
												}}
												onClick={() => navigate("/game/create")}
											>
												New game
											</Button>
										</>
									) : (
										<>
											{opponent !== "Computer" && (
												<>
													{drawOfferReceived ? (
														<>
															<Button
																variant="light"
																style={{ width: "48%" }}
																onClick={() => {
																	setDrawOfferReceived(false);
																	offerDraw();
																}}
															>
																Accept draw
															</Button>
															<Button
																variant="light"
																style={{ width: "48%" }}
																onClick={() => declineDraw()}
															>
																Decline draw
															</Button>
														</>
													) : (
														<Button
															variant="light"
															style={{ width: "50%" }}
															onClick={() => offerDraw()}
														>
															{drawOfferSent ? "Cancel offer" : "Draw"}
														</Button>
													)}
												</>
											)}
											<Button
												variant="light"
												style={{
													width:
														opponent === "Computer" || drawOfferReceived
															? "100%"
															: "50%",
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
