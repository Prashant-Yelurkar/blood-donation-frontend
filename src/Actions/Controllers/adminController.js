import { convertToLocalDateString } from "@/utils/DateConverter";
import { myrouter } from "../AxiosInitializer";

const addAdminAPI = async(data)=> await myrouter.post('/admin', data);
const updateAdminAPI = async(id, data)=> await myrouter.put(`admin/${id}`, data);
const gatAllAdminAPI =async()=> await myrouter.get('/admin');
const getAdminByIdAPI =async(id)=> await myrouter.get(`/admin/${id}`);
const deleteAdminAPI =async(id)=> await myrouter.delete(`/admin/${id}`);



export {
    addAdminAPI,
    updateAdminAPI,
    getAdminByIdAPI,
    gatAllAdminAPI,
    deleteAdminAPI,
}