import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
	let navigate = useNavigate();
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
				"Content-Type": "application/json",
			},
		};

		try {
			const { data } = await axios.post(
				"http://localhost:5000/user/login",
				{ email, password },
				config
			);

			localStorage.setItem("authToken", data.token);
			// navigate("/");
			window.location = "/";
		} catch (error) {
			console.log(error.response);
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
					<p>Log in</p>
				</div>
				{error && <div className="error">{error}</div>}
				<form method="POST" onSubmit={handleSubmit}>
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
						Don't have an account? <Link to="/signup">Sign up</Link>
					</span>
				</form>
			</div>
			<div className="media"></div>
		</div>
	);
}
