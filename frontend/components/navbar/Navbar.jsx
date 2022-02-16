import "./Navbar.css";
import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import jwt_decode from "jwt-decode";

import { Link } from "react-router-dom";

export default function Navbar({ socket }) {
	const [username, setUsername] = useState("");
	const [showMenu, setShowMenu] = useState(false);

	useEffect(() => {
		if (localStorage.getItem("authToken")) {
			const decoded = jwt_decode(localStorage.getItem("authToken"));
			setUsername(decoded.username);
		}
	}, []);

	return (
		<nav>
			<Link to="/">Chess Game</Link>
			<div>
				{username === "" ? (
					<ul>
						<li>
							<Link to="/login">Log in</Link>
						</li>
						<li>
							<Link to="/signup">Sign up</Link>
						</li>
					</ul>
				) : (
					<button
						className={`user-button ${showMenu ? "button-clicked" : ""}`}
						onClick={() => setShowMenu(!showMenu)}
					>
						<FaUser className="user-icon" /> {username}
					</button>
				)}
			</div>
			{showMenu && (
				<div className="user-menu">
					<Link to="/game/create" onClick={() => setShowMenu(false)}>
						Create Game
					</Link>
					<Link to={`/profile/${username}`} onClick={() => setShowMenu(false)}>
						Profile
					</Link>
					<p
						tabIndex={0}
						onClick={() => {
							localStorage.removeItem("authToken");
							setUsername("");
							window.location = "/";
						}}
					>
						Log out
					</p>
				</div>
			)}
		</nav>
	);
}
