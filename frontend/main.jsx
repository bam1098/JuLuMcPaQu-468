import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Navbar />
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
