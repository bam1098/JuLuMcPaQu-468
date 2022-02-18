import "./ActiveGame.css";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Button,
	Card,
	Divider,
	Group,
	Modal,
	ScrollArea,
	TextInput,
	Text,
} from "@mantine/core";
import Board from "../../components/Board";
import jwt_decode from "jwt-decode";

export default function ActiveGame({ socket }) {
	const params = useParams();
	const navigate = useNavigate();
	const [gameEnded, setGameEnded] = useState(false);
	const [endResult, setEndResult] = useState({});
	const [chatMessages, setChatMessages] = useState([]);
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
			console.log(result.winner);
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
				<Modal opened={gameEnded} onClose={() => setGameEnded(false)} centered>
					<Text component="h2" size="xl">
						{endResult.winner === undefined
							? "The game has ended in a draw!"
							: `${endResult.winner} has won the game!`}
					</Text>
					<Text component="h3" size="lg">
						{endResult.draw === false && endResult.winner === user.username
							? "Congratulations!"
							: "Better luck next time!"}
					</Text>
				</Modal>
				<div className="board-container">
					<Board socket={socket} roomId={params.id} user={user} />
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
