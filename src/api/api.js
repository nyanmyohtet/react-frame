import axios from "axios";
import authHeader from "../services/auth-header.service";

const httpClient = axios.create({
    baseURL: "http://localhost:8000/api/"
});

httpClient.defaults.headers.common['Authorization'] = authHeader();

export default httpClient;
