import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Text } from "@mantine/core";
import jwt_decode from "jwt-decode";
import axios from "axios";

export default function Profile() {
	let params = useParams();
	let navigate = useNavigate();
	const [user, setUser] = useState({});

	useEffect(() => {
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
						setUser(data.data);
					} catch (error) {
						console.log(error);
					}
				};

				fetchData();
			}
		}
	}, []);

	const matchHistory =
		user.matchHistory && user.matchHistory.length ? (
			user.matchHistory.map((match) => {
				<Text>Match example</Text>;
			})
		) : (
			<Text>No match history</Text>
		);

	return (
		<div className="profile-container">
			<div className="profile-header">
				<Text>{user.username}</Text>
				<Text>{user.email}</Text>
			</div>
			<div className="profile-body">
				<div className="profile-body-left">
					<Text>Wins: {user.wins}</Text>
					<Text>Losses: {user.losses}</Text>
					<Text>Draws: {user.draws}</Text>
				</div>
				<div className="profile-body-right">
					<Text>Match history:</Text>
					{matchHistory}
				</div>
			</div>
		</div>
	);
}
