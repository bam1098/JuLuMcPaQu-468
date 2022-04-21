import styles from "./Error.module.css";
import { Text } from "@mantine/core";
import { Link } from "react-router-dom";

function Error() {
	return (
		<div className={styles.error}>
			<Text component="h1" size={20}>
				Page not found.
			</Text>
			<Text component={Link} to="/">
				Return home
			</Text>
		</div>
	);
}

export default Error;
