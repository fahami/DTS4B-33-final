import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import produce from "immer";
import create from "zustand";
import { persist } from "zustand/middleware";

import { auth } from "../config/firebase";

const emptyString = "";

const useUserStore = create(
	persist(
		(set) => ({
			errorLogin: emptyString,
			errorRegister: emptyString,
			userReady: false,
			auth: {
				email: emptyString,
				accessToken: emptyString,
			},
			onLogin: async (email, password) => {
				try {
					const login = await signInWithEmailAndPassword(auth, email, password);

					set(
						produce((state) => {
							state.userReady = true;
							state.errorLogin = emptyString;
							state.errorRegister = emptyString;
							state.auth = {
								email: login.user.email,
								accessToken: login.user.accessToken,
							};
						})
					);
				} catch (error) {
					set(
						produce((state) => {
							state.userReady = false;
							state.errorLogin = error.message;
						})
					);
				}
			},
			onRegister: async (email, password) => {
				try {
					await createUserWithEmailAndPassword(auth, email, password);

					set(
						produce((state) => {
							state.userReady = true;
							state.errorLogin = emptyString;
							state.errorRegister = emptyString;
						})
					);
				} catch (error) {
					set(
						produce((state) => {
							state.userReady = false;
							state.errorRegister = error.message;
						})
					);
				}
			},
			onLogout: async () => {
				try {
					await signOut(auth);
					set(
						produce((state) => {
							state.userReady = false;
						})
					);
				} catch (error) {
					console.log(error);
				}
			},
		}),
		{
			name: "user-storage",
			getStorage: () => sessionStorage,
		}
	)
);

// selector bisa dibuat di sini, biar bisa reusesable
export const selectUserReady = (state) => state.userReady;
export const selectErrorLogin = (state) => state.errorLogin;
export const selectOnLogin = (state) => state.onLogin;
export const selectOnRegister = (state) => state.onRegister;
export const selectErrorRegister = (state) => state.errorRegister;
export const selectOnLogout = (state) => state.onLogout;

export default useUserStore;
