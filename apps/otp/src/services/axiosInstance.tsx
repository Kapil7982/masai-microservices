import axios, { AxiosInstance } from "axios";

const baseUrl: string = "http://localhost:7000";

const axiosInstance: AxiosInstance = axios.create({
	baseURL: baseUrl,
});

export default axiosInstance;
