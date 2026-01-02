const { myrouter } = require("../AxiosInitializer");

const getAllUsersAPI = async (params) => myrouter.get("/users", { params })
export {getAllUsersAPI};