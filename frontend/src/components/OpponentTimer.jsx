import { useEffect } from "react";
import { useTimer } from "use-timer";
import { Card, Group, Text } from "@mantine/core";
import { FiClock } from "react-icons/fi";

export default function PlayerTimer({ secondsLeft }) {
	function fmtMSS(s) {
		return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
	}

	return (
		<Card
			padding={6}
			style={{ backgroundColor: secondsLeft <= 60 ? "#da4f4f" : "" }}
		>
			<Group spacing={8}>
				<FiClock size={20} style={{ marginTop: "3px" }} />
				<Text size="xl">{fmtMSS(secondsLeft)}</Text>
			</Group>
		</Card>
	);
}
