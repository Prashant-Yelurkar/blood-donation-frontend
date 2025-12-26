import { convertToLocalDateString } from "@/utils/DateConverter";

const { myrouter } = require("../AxiosInitializer")

const getAllDoonersAPI = async () => myrouter.get('/donor');
const getDonorDetailsAPI = async (id) => myrouter.get(`/donor/${id}`);
const addDonorAPI = async (data) => myrouter.post('/donor', data);
const updateDonorAPI = async (id, data) => myrouter.put(`/donor/${id}`, data);
const deleteDonorAPI = async (id) => myrouter.delete(`/donor/${id}`);



const refractorAllDonorsAPI = async (data) => {
    return data.map((volunteer) => ({
        id: volunteer._id,
        name: volunteer.profile?.name || 'N/A',
        identifier: {
            type: volunteer.contact ? 'contact' : 'email',
            value: volunteer.contact ? volunteer.contact : volunteer.email || 'N/A',
        },
    }));
}

const refractorDonorAPI = async (volunteer) => {
    return ({
        id: volunteer._id,
        name: volunteer.profile?.name || '',
        email: volunteer.email || '',
        contact: volunteer.contact || '',
        dob: volunteer.profile?.lastDonationDate && convertToLocalDateString(volunteer.profile?.dob),
        gender: volunteer.profile?.gender || '',
        bloodGroup: volunteer.profile?.bloodGroup || '',
        address: volunteer.profile?.address || '',
        weight:volunteer.profile?.weight || '',
        lastDonationDate: volunteer.profile?.lastDonationDate && convertToLocalDateString(volunteer.profile?.lastDonationDate)

    });
}

const refractrUpdateDonorAPI = async (volunteer) => {
    return ({
        email: volunteer.email || '',
        contact: volunteer.contact || '',
        name: volunteer.name || '',
        dob: volunteer.dob || '',
        gender: volunteer.gender || '',
        bloodGroup: volunteer.bloodGroup || '',
        address: volunteer.address || '',
        weight: volunteer.weight || '',
        lastDonationDate: volunteer.lastDonationDate || ''
        
    });
}

export {
    getAllDoonersAPI, getDonorDetailsAPI,
    addDonorAPI,
    updateDonorAPI, refractrUpdateDonorAPI,
    deleteDonorAPI,
    refractorAllDonorsAPI, refractorDonorAPI
}