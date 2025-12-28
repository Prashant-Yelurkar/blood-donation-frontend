import { convertToLocalDateString } from "@/utils/DateConverter";

const { myrouter, myUpload } = require("../AxiosInitializer")

const getAllVolunteersAPI = async () => myrouter.get('/volunteer');
const getAllVolunteersDetailsAPI = async (id) => myrouter.get(`/volunteer/${id}`);
const addVolunteerAPI = async (data) => myrouter.post('/volunteer', data);
const updateVolunteerAPI = async (id, data) => myrouter.put(`/volunteer/${id}`, data);
const deleteVolunteerAPI = async (id) => myrouter.delete(`/volunteer/${id}`);

const seedVolunteerAPI = async(data)=> myUpload.post('/volunteer/seed', data)


const refractorAllVolunteersAPI = async (data) => {
    return data.map((volunteer) => ({
        id: volunteer._id,
        name: volunteer.profile?.name || 'N/A',
        identifier: {
            type: volunteer.contact ? 'contact' : 'email',
            value: volunteer.contact ? volunteer.contact : volunteer.email || 'N/A',
        },
    }));
}

const refractorVolunteersAPI = async (volunteer) => {
    return ({
        id: volunteer._id,
        name: volunteer.profile?.name || '',
        email: volunteer.email || '',
        contact: volunteer.contact || '',
        dob: volunteer.profile?.dob && convertToLocalDateString(volunteer.profile?.dob),
        gender: volunteer.profile?.gender || '',
        bloodGroup: volunteer.profile?.bloodGroup || '',
        workAddress: volunteer.profile?.workAddress || '',
        address: volunteer.profile?.address || '',
        weight:volunteer.profile?.weight || '',
        lastDonationDate: volunteer.profile?.lastDonationDate && convertToLocalDateString(volunteer.profile?.lastDonationDate)

    });
}

const refractrUpdateVolunteersAPI = async (volunteer) => {
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
    seedVolunteerAPI,
    getAllVolunteersAPI, getAllVolunteersDetailsAPI,
    addVolunteerAPI,
    updateVolunteerAPI, refractrUpdateVolunteersAPI,
    deleteVolunteerAPI,
    refractorAllVolunteersAPI, refractorVolunteersAPI
}