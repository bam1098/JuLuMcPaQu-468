import { Avatar, Button, Group, Modal, Text } from "@mantine/core";

export default function EndGameModal({
	gameState,
	modalOpened,
	setModalOpened,
	endResult,
	sendRematchRequest,
	rematchRequestSent,
	rematchRequestReceived,
	setRematchRequestReceived,
	rematchRequestDeclined,
	setRematchRequestSent,
	declineRematch,
	user,
	socket,
	navigate,
}) {
	return (
		<Modal
			opened={modalOpened}
			onClose={() => setModalOpened(false)}
			centered
			hideCloseButton
		>
			<Group position="center" direction="column" spacing="none">
				<Text component="h2" size="xl">
					{endResult.winner === undefined
						? "The game has ended in a draw"
						: `${endResult.winner} has won`}
				</Text>
				<Text component="h3" size="lg" color="dimmed">
					{endResult.draw === false && endResult.winner === user.username
						? "Congratulations!"
						: "Play again?"}
				</Text>
			</Group>
			{endResult.draw === false ? (
				<Group position="center" mt="lg">
					<Avatar size="xl" color="blue">
						{Object.keys(endResult).length !== 0 && endResult.winner.charAt(0)}
					</Avatar>
					<Text component="h3" size="xl">
						vs.
					</Text>
					<Avatar size="xl" color="blue">
						{Object.keys(endResult).length !== 0 && endResult.loser.charAt(0)}
					</Avatar>
				</Group>
			) : (
				<Group position="center" mt="lg">
					<Avatar size="xl" color="blue">
						{Object.keys(endResult).length !== 0 &&
							endResult.playerOne.charAt(0)}
					</Avatar>
					<Text component="h3" size="lg">
						vs.
					</Text>
					<Avatar size="xl" color="blue">
						{Object.keys(endResult).length !== 0 &&
							endResult.playerTwo.charAt(0)}
					</Avatar>
				</Group>
			)}
			<Group position="center" mt="lg" noWrap={!rematchRequestReceived}>
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
						disabled={rematchRequestSent || rematchRequestDeclined}
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
			</Group>
		</Modal>
	);
}
