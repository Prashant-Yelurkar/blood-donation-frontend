import { convertToLocalDateString } from "@/utils/DateConverter";

const { myrouter, myUpload } = require("../AxiosInitializer")

const getAllDoonersAPI = async (params) => myrouter.get('/donor', {params});
const getDonorDetailsAPI = async (id) => myrouter.get(`/donor/${id}`);
const addDonorAPI = async (data) => myrouter.post('/donor', data);
const updateDonorAPI = async (id, data) => myrouter.put(`/donor/${id}`, data);
const deleteDonorAPI = async (id) => myrouter.delete(`/donor/${id}`);

const seedDonorAPI = async(data)=> myUpload.post('/donor/seed', data)





const refractrUpdateDonorAPI = async (volunteer) => {
    return ({
        email: volunteer.email || '',
        contact: volunteer.contact || '',
        name: volunteer.name || '',
        dob: volunteer.dob || '',
        gender: volunteer.gender || '',
        bloodGroup: volunteer.bloodGroup || '',
        address: volunteer.address || '',
         workAddress: volunteer.workAddress || '',
        weight: volunteer.weight || '',
        lastDonationDate: volunteer.lastDonationDate || ''
        
    });
}

export {
    seedDonorAPI,
    getAllDoonersAPI, getDonorDetailsAPI,
    addDonorAPI,
    updateDonorAPI, refractrUpdateDonorAPI,
    deleteDonorAPI,
}