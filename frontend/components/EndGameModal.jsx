import { Avatar, Button, Group, Modal, Text } from "@mantine/core";

export default function EndGameModal({
	modalOpened,
	setModalOpened,
	endResult,
	sendRematchRequest,
	rematchRequestSent,
	setRematchRequestSent,
	user,
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
			<Group position="center" mt="lg">
				<div style={{ width: "150px" }}>
					<Button
						variant="gradient"
						gradient={{ from: "indigo", to: "cyan" }}
						fullWidth
						loading={rematchRequestSent}
						onClick={() => sendRematchRequest()}
					>
						{rematchRequestSent ? "Request sent" : "Rematch"}
					</Button>
				</div>
				<div style={{ width: "150px" }}>
					<Button
						fullWidth
						variant="gradient"
						gradient={{ from: "indigo", to: "cyan" }}
						onClick={() => navigate("/game/create")}
					>
						New Game
					</Button>
				</div>
			</Group>
		</Modal>
	);
}
