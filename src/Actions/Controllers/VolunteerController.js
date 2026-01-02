import { convertToLocalDateString } from "@/utils/DateConverter";

const { myrouter, myUpload } = require("../AxiosInitializer")

const getAllVolunteersAPI = async (params) => myrouter.get("/volunteer", { params });
const getAllVolunteersDetailsAPI = async (id) => myrouter.get(`/volunteer/${id}`);
const addVolunteerAPI = async (data) => myrouter.post('/volunteer', data);
const updateVolunteerAPI = async (id, data) => myrouter.put(`/volunteer/${id}`, data);
const deleteVolunteerAPI = async (id) => myrouter.delete(`/volunteer/${id}`);

const seedVolunteerAPI = async(data)=> myUpload.post('/volunteer/seed', data)


export {
    seedVolunteerAPI,
    getAllVolunteersAPI, getAllVolunteersDetailsAPI,
    addVolunteerAPI,
    updateVolunteerAPI,
    deleteVolunteerAPI
}