import { useEffect } from "react";
import { useTimer } from "use-timer";
import { Card, Group, Text } from "@mantine/core";
import { FiClock } from "react-icons/fi";

export default function PlayerTimer({
	expiryTimestamp,
	startTurn,
	endTurn,
	increment,
	setOutOfTime,
	pauseAtStart,
}) {
	if (expiryTimestamp === null) {
		return "";
	}
	const { time, start, pause, reset, advanceTime } = useTimer({
		initialTime: expiryTimestamp,
		timerType: "DECREMENTAL",
		autostart: true,
		endTime: 0,
		onTimeOver: () => {
			setOutOfTime(0);
		},
	});

	function fmtMSS(s) {
		return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
	}

	useEffect(() => {
		if (increment !== 0) {
			advanceTime(-Math.abs(increment));
		}
		pause();
	}, [endTurn]);

	useEffect(() => {
		pause();
	}, [pauseAtStart]);

	useEffect(() => {
		start();
	}, [startTurn]);

	useEffect(() => {
		reset(expiryTimestamp);
	}, [expiryTimestamp]);

	return (
		<Card padding={6} style={{ backgroundColor: time <= 60 ? "#da4f4f" : "" }}>
			<Group spacing={8}>
				<FiClock size={20} style={{ marginTop: "3px" }} />
				<Text size="xl">{fmtMSS(time)}</Text>
			</Group>
		</Card>
	);
}
