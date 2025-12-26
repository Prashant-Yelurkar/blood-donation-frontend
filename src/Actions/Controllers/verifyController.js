import { myrouter } from "../AxiosInitializer";
const verifyToken = async() => myrouter.get('/auth/verify');

export { verifyToken };