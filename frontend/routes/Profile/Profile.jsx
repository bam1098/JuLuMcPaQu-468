import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
				<p>Match example</p>;
			})
		) : (
			<p>No match history</p>
		);

	return (
		<div className="profile-container">
			<div className="profile-header">
				<h1>{user.username}</h1>
				<p>{user.email}</p>
			</div>
			<div className="profile-body">
				<div className="profile-body-left">
					<p>Wins: {user.wins}</p>
					<p>Losses: {user.losses}</p>
					<p>Draws: {user.draws}</p>
				</div>
				<div className="profile-body-right">
					<p>Match history:</p>
					{matchHistory}
				</div>
			</div>
		</div>
	);
}
