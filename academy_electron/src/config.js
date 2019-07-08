//Environment variables are injected in build-time (not accessible in development)

const API_URL = process.env.REACT_APP_API_URL || '127.0.0.1:8000';
//const API_URL = process.env.REACT_APP_API_URL || 'www.tonyscoding.com';
export default API_URL;