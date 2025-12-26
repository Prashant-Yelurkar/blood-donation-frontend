const { myrouter } = require("../AxiosInitializer");

const getAllUsersAPI = async()=> await myrouter.get('/users');
export {getAllUsersAPI};