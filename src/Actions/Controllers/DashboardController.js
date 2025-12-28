import { myrouter } from "../AxiosInitializer";

export const dashboardSummmary = async()=> await myrouter.get('/dashboard');