const { myrouter } = require("../AxiosInitializer");

const IsServerActive = async() => await myrouter.get('/')


export{IsServerActive}