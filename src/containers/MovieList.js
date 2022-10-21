import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import tmdb from "../apis/tmdb";
import MovieCard from "../components/MovieCard";

const MovieList = () => {
	const [queryParams, setQueryParams] = useSearchParams();
	const [movies, setMovies] = useState([]);
	const [moviesReady, setMoviesReady] = useState(false);

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				const fetchedMovies = await tmdb.get("trending/movie/week");
				setMovies(fetchedMovies.data.results);
				setMoviesReady(true);
			} catch (error) {
				console.log(error);
			}
		};

		if (!queryParams.get("query")) {
			fetchMovies();
		}
	}, [queryParams]);

	useEffect(() => {
		if (!moviesReady) return;
		const sortMovies = (type) => {
			if (type === "asc") {
				const sorted = [...movies].sort(
					(a, b) => a.vote_average - b.vote_average
				);
				setMovies(sorted);
			}
			if (type === "desc") {
				const sorted = [...movies].sort(
					(a, b) => b.vote_average - a.vote_average
				);
				setMovies(sorted);
			}
		};

		sortMovies(queryParams.get("sort"));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryParams, moviesReady]);

	useEffect(() => {
		const searchMovies = async (query) => {
			try {
				const fetchedMovies = await tmdb.get("search/movie", {
					params: {
						query,
					},
				});
				setMovies(fetchedMovies.data.results);
				setMoviesReady(true);
			} catch (error) {
				console.log(error);
			}
		};
		const getData = setTimeout(() => {
			if (queryParams.get("sort")) {
				return;
			}
			if (queryParams.get("query")) {
				searchMovies(queryParams.get("query"));
			}
		}, 2000);
		return () => clearTimeout(getData);
	}, [queryParams]);

	const setSortParam = (type) => {
		queryParams.set("sort", type);
		setQueryParams(queryParams);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				mt: 5,
			}}
		>
			<Box
				sx={{
					mt: 5,
					display: "flex",
					flexDirection: "row",
					justifyContent: "flex-end",
					alignItems: "center",
				}}
			>
				Sort by Rating
				<Button
					variant="contained"
					sx={{ ml: 2 }}
					onClick={() => setSortParam("asc")}
				>
					Asc
				</Button>
				<Button
					variant="contained"
					sx={{ ml: 2, mr: 2 }}
					onClick={() => setSortParam("desc")}
				>
					Desc
				</Button>
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					flexWrap: "wrap",
					padding: 2,
					justifyContent: "space-around",
				}}
			>
				{movies.map((movie) => (
					<MovieCard key={movie.title} movie={movie}></MovieCard>
				))}
			</Box>
		</Box>
	);
};

export default MovieList;
