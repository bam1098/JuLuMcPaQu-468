import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
	let navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (localStorage.getItem("authToken")) {
			window.location = "/";
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const config = {
			header: {
				"Content-Type": "appliction/json",
			},
		};

		try {
			const { data } = await axios.post(
				"http://localhost:5000/user/signup",
				{ username, email, password },
				config
			);

			localStorage.setItem("authToken", data.token);
			// navigate("/");
			window.location = "/";
		} catch (error) {
			setError(error.response.data.error);
			setTimeout(() => {
				setError("");
			}, 5000);
		}
	};
	return (
		<div className="container">
			<div className="form-container">
				<div className="form-header">
					<h1>Chess Game</h1>
					<p>Signup</p>
				</div>
				{error && <div className="error">{error}</div>}
				<form method="POST" onSubmit={handleSubmit}>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						name="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button type="submit">Sign up</button>
					<span>
						Already have an account? <Link to="/login">Login</Link>
					</span>
				</form>
			</div>
			<div className="media"></div>
		</div>
	);
}
