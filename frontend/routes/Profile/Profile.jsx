import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
	Avatar,
	Card,
	ColorSwatch,
	Divider,
	Group,
	Table,
	Text,
	Title,
	useMantineTheme,
} from "@mantine/core";
import jwt_decode from "jwt-decode";
import axios from "axios";
import styles from "./Profile.module.css";

export default function Profile() {
	let params = useParams();
	let navigate = useNavigate();
	const [user, setUser] = useState({});
	const theme = useMantineTheme();

	useEffect(() => {
		let isCancelled = false;
		if (localStorage.getItem("authToken")) {
			const decoded = jwt_decode(localStorage.getItem("authToken"));
			if (decoded.username !== params.username) {
				navigate("/");
			} else {
				const fetchData = async () => {
					const config = {
						method: "get",
						url: "http://localhost:5000/profile",
						headers: {
							"Content-Type": "appliction/json",
							Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						},
					};

					try {
						const { data } = await axios(config);
						if (!isCancelled) {
							setUser(data.data);
						}
					} catch (error) {
						console.log(error);
					}
				};
				fetchData();
			}
		}

		return () => (isCancelled = true);
	}, []);
	const matchHistory = () => {
		return user.matchHistory.map((match, index) => (
			<tr key={index}>
				<td>TODO</td>
				<td>
					<Group direction="column" spacing={0}>
						<Group>
							<ColorSwatch size={12} color={"white"} />
							<Text>
								{match.playerOne.color === "white"
									? match.playerOne.name
									: match.playerTwo.name}
							</Text>
						</Group>
						<Group>
							<ColorSwatch size={12} color={"#868484"} />
							<Text>
								{match.playerTwo.color === "black"
									? match.playerTwo.name
									: match.playerOne.name}
							</Text>
						</Group>
					</Group>
				</td>
				<td>{match.draw ? "Draw" : match.won ? "Won" : "Lost"}</td>
				<td>{match.turns}</td>
				<td>{match.date}</td>
			</tr>
		));
	};

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Card width={800}>
				<div className="profile-container">
					<div className={styles.profile_header}>
						<Group>
							<Avatar color="blue" size="xl">
								{user.username?.charAt(0)}
							</Avatar>
							<Group direction="column" spacing={0}>
								<Title component="h2" style={{ fontSize: "24px" }}>
									{user.username}
								</Title>
								<Text>{user.email}</Text>
								<Group spacing={10}>
									<Text>
										{user.wins}{" "}
										<span style={{ color: theme.colors["green"][7] }}>W</span>
									</Text>
									<Text>
										{user.losses}{" "}
										<span style={{ color: theme.colors["red"][7] }}>L</span>
									</Text>
									<Text>
										{user.draws}{" "}
										<span style={{ color: theme.colors["gray"][6] }}>D</span>
									</Text>
								</Group>
							</Group>
						</Group>
					</div>
					<Divider />
					<div className={styles.profile_body}>
						{user.matchHistory && user.matchHistory.length ? (
							<div style={{ width: 500 }}>
								<Table highlightOnHover>
									<thead>
										<tr>
											<th>Format</th>
											<th>Players</th>
											<th>Result</th>
											<th>Moves</th>
											<th>Date</th>
										</tr>
									</thead>
									<tbody>{matchHistory()}</tbody>
								</Table>
							</div>
						) : (
							<Text>No match history</Text>
						)}
					</div>
				</div>
			</Card>
		</div>
	);
}
