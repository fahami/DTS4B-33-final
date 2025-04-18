import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import PrivateComponent from "./components/PrivateComponent";
import PrivateHome from "./components/PrivateHome";
import NotFound from "./containers/404";
import Login from "./containers/Login";
import MovieDetailPage from "./containers/MovieDetailPage";
import MovieList from "./containers/MovieList";
import Register from "./containers/Register";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import theme from "./themes/theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Routes>
					<Route path="/" element={<App />}>
						<Route
							path="/"
							element={
								<PrivateHome>
									<MovieList />
								</PrivateHome>
							}
						/>
						<Route
							path="movie/:movieId"
							element={
								<PrivateHome>
									<MovieDetailPage />
								</PrivateHome>
							}
						/>
						<Route
							path="register"
							element={
								<PrivateComponent loginOnly={false}>
									<Register />
								</PrivateComponent>
							}
						/>
						<Route
							path="login"
							element={
								<PrivateComponent loginOnly={false}>
									<Login />
								</PrivateComponent>
							}
						/>
						<Route path="*" element={<NotFound />} />
					</Route>
				</Routes>
			</ThemeProvider>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
