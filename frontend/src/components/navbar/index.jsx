import React from "react";
import Navbar from "./Navbar";

export default function index({ socket }) {
	return <Navbar socket={socket} />;
}
