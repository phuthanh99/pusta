import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: "https://api-social-pusta.herokuapp.com/api",
	headers: {
		"Cache-Control": "no-cache",
		"Content-Type": "application/json",
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
	},
});
