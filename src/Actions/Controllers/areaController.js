const { myrouter } = require("../AxiosInitializer");

const addAreaAPI = async(data)=> await myrouter.post('/area/add', data);
const getAreaAPI = async()=> await myrouter.get('/area');
const deleteAreaAPI = async(id)=> await myrouter.delete(`/area/${id}`);
const updateAreaAPI = async(id, data)=> await myrouter.put(`/area/${id}`, data);
const getAreaDetailsAPI = async(id)=> await myrouter.get(`/area/${id}`);

export{addAreaAPI,
    getAreaDetailsAPI,
    updateAreaAPI,
    getAreaAPI,
    deleteAreaAPI
}