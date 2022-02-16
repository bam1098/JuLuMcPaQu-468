import ActiveGame from "./ActiveGame";

export default function index({ socket }) {
	return <ActiveGame socket={socket} />;
}
