import axios from "axios";

const setupAxios = () => {
    axios.interceptors.request.use(
        (config) => {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("token"); // We will store token separately or in user object

            // Check if token exists in user object (from my backend update)
            const actualToken = token || (user && user.token);

            if (actualToken) {
                config.headers["Authorization"] = `Bearer ${actualToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

export default setupAxios;
