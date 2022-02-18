import { useState, useEffect } from "react";
import {
	ActionIcon,
	AppShell,
	Avatar,
	Button,
	Burger,
	ColorSchemeProvider,
	Group,
	Header,
	MantineProvider,
	MediaQuery,
	Navbar,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { useLocalStorageValue, useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { BsChevronRight } from "react-icons/bs";
import { FaChessQueen } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import App from "../../App";
import jwt_decode from "jwt-decode";
import "./Navbar.css";

export default function NewNav() {
	const [opened, setOpened] = useState(false);
	const [colorScheme, setColorScheme] = useLocalStorageValue({
		key: "mantine-color-scheme",
		defaultValue: "light",
	});
	const toggleColorScheme = (value) =>
		setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
	const [username, setUsername] = useState("");
	const dark = colorScheme === "dark";
	const largerThanSM = useMediaQuery("(min-width: 768px)");
	const smallerThanLG = useMediaQuery("(max-width: 1200px)");

	useEffect(() => {
		if (localStorage.getItem("authToken")) {
			const decoded = jwt_decode(localStorage.getItem("authToken"));
			setUsername(decoded.username);
		}
	}, []);
	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}
		>
			<MantineProvider theme={{ colorScheme }} withGlobalStyles>
				<AppShell
					padding="md"
					navbarOffsetBreakpoint="sm"
					fixed
					navbar={
						<Navbar
							height={"calc(100vh - 60px)"}
							padding="md"
							hiddenBreakpoint="sm"
							hidden={!opened}
							width={{ sm: 75, md: 150, lg: 400 }}
						>
							<Navbar.Section
								mt="lg"
								grow
								style={{
									width: "100%",
									display: "flex",
									flexDirection: "column",
									justifyContent: "space-evenly",
								}}
							>
								<UnstyledButton component={Link} to="/game/create">
									<Group position="center">
										<FaChessQueen
											color={"#228be6"}
											className="icon"
											title="Play chess"
										/>
										<MediaQuery
											largerThan="sm"
											smallerThan="lg"
											styles={{ display: "none" }}
										>
											<Text fontSize="lg">Play chess</Text>
										</MediaQuery>
									</Group>
								</UnstyledButton>
								{username !== "" && (
									<UnstyledButton
										onClick={() => {
											localStorage.removeItem("authToken");
											setUsername("");
											window.location = "/";
										}}
									>
										<Group position="center">
											<FiLogOut color={"#228be6"} className="icon" />
											<MediaQuery
												largerThan="sm"
												smallerThan="lg"
												styles={{ display: "none" }}
											>
												<Text fontSize="lg">Logout</Text>
											</MediaQuery>
										</Group>
									</UnstyledButton>
								)}
							</Navbar.Section>
							<Navbar.Section
								style={{
									width: "100%",
									paddingTop: "12px",
									borderTop: "1px solid rgb(233, 236, 239)",
								}}
							>
								{username === "" ? (
									<Group position="center">
										<Button
											component={Link}
											size="md"
											fullWidth
											to="/login"
											variant="gradient"
											gradient={{ from: "indigo", to: "cyan" }}
										>
											Log in
										</Button>
										<Button
											component={Link}
											size="md"
											fullWidth
											to="singup"
											variant="gradient"
											gradient={{ from: "indigo", to: "cyan" }}
										>
											Sign up
										</Button>
									</Group>
								) : (
									<UnstyledButton
										className="user-button"
										component={Link}
										to={`/profile/${username}`}
										style={{ width: "100%" }}
									>
										{console.log(largerThanSM && smallerThanLG)}
										<Group
											position={`${
												largerThanSM && smallerThanLG ? "center" : "apart"
											}`}
										>
											<Group>
												<Avatar color="blue" size="lg">
													{username.charAt(0)}
												</Avatar>
												<div>
													<MediaQuery
														largerThan="sm"
														smallerThan="lg"
														styles={{ display: "none" }}
													>
														<Text>{username}</Text>
													</MediaQuery>
												</div>
											</Group>
											<MediaQuery
												largerThan="sm"
												smallerThan="lg"
												styles={{ display: "none" }}
											>
												<BsChevronRight />
											</MediaQuery>
										</Group>
									</UnstyledButton>
								)}
							</Navbar.Section>
						</Navbar>
					}
					header={
						<Header
							height={60}
							padding="xs"
							style={{ display: "flex", alignItems: "center" }}
						>
							<Group position="apart" className="nav-container">
								<MediaQuery largerThan="sm" styles={{ display: "none" }}>
									<Burger
										opened={opened}
										onClick={() => setOpened((o) => !o)}
										size="md"
										mr="xl"
									/>
								</MediaQuery>
								<Text
									component={Link}
									to="/"
									variant="gradient"
									size="xl"
									weight={700}
									gradient={{ from: "indigo", to: "cyan", deg: 45 }}
								>
									Chess Game
								</Text>
								<ActionIcon
									variant="outline"
									color={dark ? "yellow" : "gray"}
									onClick={() => toggleColorScheme()}
									title="Toggle color scheme"
								>
									{dark ? "🌞" : "🌚"}
								</ActionIcon>
							</Group>
						</Header>
					}
					styles={(theme) => ({
						main: {
							backgroundColor:
								theme.colorScheme === "dark"
									? theme.colors.dark[8]
									: theme.colors.gray[0],
						},
					})}
				>
					<App />
				</AppShell>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}
