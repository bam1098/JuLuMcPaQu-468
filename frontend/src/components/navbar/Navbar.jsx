import { useState, useLayoutEffect } from "react";
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
import { IoExtensionPuzzle } from "react-icons/io5";
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
	const smallerThanSM = useMediaQuery("(max-width: 767px)");
	const smallerThanLG = useMediaQuery("(max-width: 1200px)");

	useLayoutEffect(() => {
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
							height={smallerThanSM ? "calc(100vh - 60px)" : "100vh"}
							padding="md"
							hiddenBreakpoint="sm"
							hidden={!opened}
							width={{ sm: 75, md: 150, lg: 250 }}
							style={{ marginTop: smallerThanSM ? "60px" : "0" }}
						>
							<MediaQuery smallerThan="sm" styles={{ display: "none" }}>
								<Navbar.Section
									style={{
										width: "100%",
										paddingBottom: "12px",
										borderBottom: "1px solid rgb(233, 236, 239)",
									}}
								>
									<MediaQuery
										smallerThan="lg"
										styles={{ flexDirection: "column", alignContent: "center" }}
									>
										<Group position="apart">
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
												{dark ? "🌞" : "🌛"}
											</ActionIcon>
										</Group>
									</MediaQuery>
								</Navbar.Section>
							</MediaQuery>
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
								<UnstyledButton
									component={Link}
									to="/game/create"
									onClick={() => setOpened((o) => !o)}
								>
									<Group position="center">
										<FaChessQueen
											color={"#4c9ce2"}
											className="icon"
											title="Play chess"
										/>
										<MediaQuery
											largerThan="sm"
											smallerThan="lg"
											styles={{ display: "none" }}
										>
											<Text component="p" size="xl">
												Play chess
											</Text>
										</MediaQuery>
									</Group>
								</UnstyledButton>
								<UnstyledButton
									component={Link}
									to="/puzzles/start"
									onClick={() => setOpened((o) => !o)}
								>
									<Group position="center">
										<IoExtensionPuzzle
											color={"#4c9ce2"}
											className="icon"
											title="Play puzzles"
										/>
										<MediaQuery
											largerThan="sm"
											smallerThan="lg"
											styles={{ display: "none" }}
										>
											<Text component="p" size="xl">
												Play puzzles
											</Text>
										</MediaQuery>
									</Group>
								</UnstyledButton>
								{username !== "" && (
									<UnstyledButton
										onClick={() => {
											localStorage.removeItem("authToken");
											setUsername("");
											setOpened((o) => !o);
											window.location = "/";
										}}
									>
										<Group position="center">
											<FiLogOut color={"#4c9ce2"} className="icon" />
											<MediaQuery
												largerThan="sm"
												smallerThan="lg"
												styles={{ display: "none" }}
											>
												<Text component="p" size="xl">
													Logout
												</Text>
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
											style={{ margin: 0 }}
											onClick={() => setOpened((o) => !o)}
										>
											Log in
										</Button>
										<Button
											component={Link}
											size="md"
											fullWidth
											to="/signup"
											variant="gradient"
											gradient={{ from: "indigo", to: "cyan" }}
											onClick={() => setOpened((o) => !o)}
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
										onClick={() => setOpened((o) => !o)}
									>
										<Group
											position={`${
												largerThanSM && smallerThanLG ? "center" : "apart"
											}`}
											style={{ alignItems: "baseline" }}
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
														<Text component="p" size="xl">
															{username}
														</Text>
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
						<MediaQuery largerThan="sm" styles={{ display: "none" }}>
							<Group
								position="apart"
								style={{
									width: "100%",
									padding: "0 40px",
									height: "60px",
									position: "fixed",
									backgroundColor: dark ? "#1A1B1E" : "#F5F6F8",
									borderBottom: "1px solid #2C2E33",
								}}
							>
								<Burger
									opened={opened}
									onClick={() => setOpened((o) => !o)}
									size="md"
									mr="xl"
								/>
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
									{dark ? "🌞" : "🌛"}
								</ActionIcon>
							</Group>
						</MediaQuery>
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
					<div
						style={{
							width: "100%",
							height: "100%",
						}}
					>
						<App />
					</div>
				</AppShell>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}
