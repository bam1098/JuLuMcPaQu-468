import { Avatar, Group, Text } from "@mantine/core";
import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import { aiMove } from "js-chess-engine";
import useSound from "use-sound";

import moveAudioFile from "../assets/sounds/Move.mp3";
import captureAudioFile from "../assets/sounds/Capture.mp3";
import gameStartAudioFile from "../assets/sounds/GameStart.mp3";

export default function Board({
	game,
	setGame,
	gameState,
	setGameState,
	fen,
	setFen,
	setFenHistory,
	socket,
	roomId,
	user,
	opponent,
	setOpponent,
	boardWidth,
}) {
	const [boardOrientation, setBoardOrientation] = useState("white");
	const [rightClickedSquares, setRightClickedSquares] = useState({});
	const [optionSquares, setOptionSquares] = useState({});
	const [playMoveSound] = useSound(moveAudioFile);
	const [playCaptureSound] = useSound(captureAudioFile);

	const moveAudio = new Audio(moveAudioFile);
	const captureAudio = new Audio(captureAudioFile);
	const gameStartAudio = new Audio(gameStartAudioFile);

	function safeGameMutate(modify) {
		setGame((g) => {
			const update = { ...g };
			modify(update);
			return update;
		});
	}

	function getMoveOptions(square) {
		const moves = game.moves({
			square,
			verbose: true,
		});
		if (moves.length === 0) {
			return;
		}

		const newSquares = {};
		moves.map((move) => {
			newSquares[move.to] = {
				background:
					game.get(move.to) &&
					game.get(move.to).color !== game.get(square).color
						? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
						: "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
				borderRadius: "50%",
			};
			return move;
		});
		setOptionSquares(newSquares);
	}

	function onMouseOverSquare(square) {
		getMoveOptions(square);
	}

	// Only set squares to {} if not already set to {}
	function onMouseOutSquare() {
		if (Object.keys(optionSquares).length !== 0) setOptionSquares({});
	}

	function onSquareClick() {
		setRightClickedSquares({});
	}

	function onSquareRightClick(square) {
		const color = "rgba(0, 0, 255, 0.4)";
		setRightClickedSquares({
			...rightClickedSquares,
			[square]:
				rightClickedSquares[square] &&
				rightClickedSquares[square].backgroundColor === color
					? undefined
					: { backgroundColor: color },
		});
	}

	function handleGameOver() {
		let payload;
		let winner;
		let loser;
		if (
			game.in_draw() ||
			game.in_stalemate() ||
			game.in_threefold_repetition() ||
			game.insufficient_material()
		) {
			payload = {
				game: gameState,
				roomId,
				draw: true,
				playerOne: user.username,
				playerTwo: opponent,
			};
		} else {
			if (game.turn() === "w") {
				for (const [key] of Object.entries(gameState.players)) {
					if (gameState.players[key].color === "black") {
						winner = key;
					} else {
						loser = key;
					}
				}
			} else {
				for (const [key] of Object.entries(gameState.players)) {
					if (gameState.players[key].color === "white") {
						winner = key;
					} else {
						loser = key;
					}
				}
			}
			payload = {
				game: gameState,
				roomId,
				draw: false,
				winner,
				loser,
			};
		}
		socket.emit("gameOver", payload);
	}

	function onDrop(sourceSquare, targetSquare) {
		let move = null;
		if (game.turn() !== gameState.players[user["username"]].color.charAt(0))
			return false;
		safeGameMutate((game) => {
			move = game.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: "q", // always promote to a queen for example simplicity
			});
		});
		if (move === null) return false; // illegal move
		if (move.captured) playCaptureSound();
		else playMoveSound();
		if (gameState.vsComputer === true) {
			socket.emit("saveMove", {
				roomId,
				fen: game.fen(),
				move: { sourceSquare, targetSquare },
			});
			setFen(game.fen());
			setFenHistory((previousFens) => [...previousFens, game.fen()]);
			if (game.game_over()) {
				handleGameOver();
			} else {
				makeComputerMove(gameState);
			}
		} else {
			socket.emit("moveMade", {
				roomId,
				fen: game.fen(),
				move: { sourceSquare, targetSquare },
			});
			setFen(game.fen());
			setFenHistory((previousFens) => [...previousFens, game.fen()]);
			if (game.game_over()) {
				handleGameOver();
			}
		}
		return true;
	}

	function makeComputerMove(gameState) {
		let move = null;
		const chosenMove = aiMove(
			game.fen(),
			gameState.players["Computer"]["difficulty"]
		);
		for (const [fromSquare, toSquare] of Object.entries(chosenMove)) {
			safeGameMutate((game) => {
				move = game.move({
					from: fromSquare.toLowerCase(),
					to: toSquare.toLowerCase(),
					promotion: "q", // always promote to a queen for example simplicity
				});
				if (move.captured) playCaptureSound();
				else playMoveSound();
			});
			socket.emit("saveMove", {
				roomId,
				fen: game.fen(),
				move: { fromSquare, toSquare },
			});
		}
		setFen(game.fen());
		setFenHistory((previousFens) => [...previousFens, game.fen()]);
		if (game.game_over()) {
			handleGameOver();
		}
	}

	useEffect(() => {
		gameStartAudio.play();
		socket.on("playerJoined", (gameState) => {
			setGameState(gameState);
			for (const [key] of Object.entries(gameState.players)) {
				if (key !== user["username"]) {
					setOpponent(key);
				}
			}
			game.load(gameState.fen);
			setFen(gameState.fen);
			setFenHistory((previousFens) => [...previousFens, game.fen()]);
			setBoardOrientation(gameState.players[user["username"]].color);
			if (
				gameState &&
				gameState.vsComputer === true &&
				gameState.players["Computer"].color.charAt(0) === game.turn()
			) {
				makeComputerMove(gameState);
			}
		});

		socket.on("opponentMoved", (moveMade) => {
			let move = null;
			safeGameMutate((game) => {
				move = game.move({
					from: moveMade.move.sourceSquare,
					to: moveMade.move.targetSquare,
					promotion: "q", // always promote to a queen for example simplicity
				});
				handleSoundPlay(move);
			});
			setFen(game.fen());
			setFenHistory((previousFens) => [...previousFens, game.fen()]);
		});

		return () => socket.off();
	}, []);

	function handleSoundPlay(move) {
		if (move && move.captured !== undefined) captureAudio.play();
		else moveAudio.play();
	}

	return (
		<>
			<div style={{ width: boardWidth, marginBottom: "1rem" }}>
				<Group>
					<Avatar color="blue" size="md">
						{opponent.charAt(0)}
					</Avatar>
					<Text component="p" size="xl">
						{opponent}
					</Text>
				</Group>
			</div>
			<Chessboard
				position={fen}
				arePiecesDraggable={fen === game.fen()}
				arePremovesAllowed={true}
				onMouseOverSquare={onMouseOverSquare}
				onMouseOutSquare={onMouseOutSquare}
				onSquareClick={onSquareClick}
				onSquareRightClick={onSquareRightClick}
				onPieceDrop={onDrop}
				boardOrientation={boardOrientation}
				id="BoardExample"
				customBoardStyle={{
					borderRadius: "4px",
					boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
				}}
				customSquareStyles={{
					...optionSquares,
					...rightClickedSquares,
				}}
				boardWidth={boardWidth}
			/>
			<div style={{ width: boardWidth, marginTop: "1rem" }}>
				<Group>
					<Avatar color="blue" size="md">
						{user["username"].charAt(0)}
					</Avatar>
					<Text component="p" size="xl">
						{user["username"]}
					</Text>
				</Group>
			</div>
		</>
	);
}
