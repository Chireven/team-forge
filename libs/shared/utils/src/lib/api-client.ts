import axios from 'axios';

/**
 * Configures global Axios interceptors for Authentication.
 * @param onUnauthenticated Callback to execute when a 401 is received (e.g., redirect to login).
 */
export const setupAxiosInterceptors = (onUnauthenticated: () => void) => {
    // 1. Request Interceptor: Attach Token
    const reqInterceptor = axios.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // 2. Response Interceptor: Handle 401
    const resInterceptor = axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                // Prevent infinite loop if login itself fails
                if (!error.config.url.includes('/auth/login')) {
                    localStorage.removeItem('token');
                    onUnauthenticated();
                }
            }
            return Promise.reject(error);
        }
    );

    // Return cleanup (eject) function (useful for HMR or tests)
    return () => {
        axios.interceptors.request.eject(reqInterceptor);
        axios.interceptors.response.eject(resInterceptor);
    };
};
