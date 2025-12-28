import { convertToLocalDateString } from "@/utils/DateConverter";
import { getFiles, myrouter, myUpload } from "../AxiosInitializer";


const getAllEventsAPI = async (data) => await myrouter.get('/event')
const addEventAPI = async (data) => await myrouter.post('/event', data);

const getEventDetailsById = async(id)=> await myrouter.get(`/event/${id}`);


const getEventUserAPI = async(id)=> await myrouter.get(`/event/${id}/user`)
const getEventUnrigsterUserAPI = async(id)=> await myrouter.get(`/event/${id}/user/unregister`)


const registerUserForEventAPI = async(id, data) =>await myrouter.post(`/event/${id}/registerUser`, data)
const updateUserStatus = async(id,userID, data) =>await myrouter.post(`/event/${id}/userStatus/${userID}`, data)


const registerBulk = async(id,data)=> await myUpload.post(`/event/${id}/register-bulk`, data);
const getEventReport = async (id) => {
  return await myrouter.get(`/event/${id}/report`, {
    responseType: "blob",
  });
};


const getAllEventRefractor = async (data) => {
    return data.map((e) => (
        {
            id: e._id,
            name: e.name,
            place:e.place,
            date:  convertToLocalDateString(e.date),
            totalDonorVisited:e.totalDonorVisited,
            totalRejected:e.totalRejected,
            totalRegisteredNotCome:e.totalRegisteredNotCome,
            totalRegistered:e.totalRegistered,
            totalCallMade:e.totalCallMade,
        }
    ))
}


const refractorAllDonorsAPI = async (data) => {
    return data.map((d) => ({
        id: d.id,
        name: d.profile?.name || 'N/A',
        identifier: {
            type: d.contact ? 'contact' : 'email',
            value: d.contact ? d.contact : d.email || 'N/A',
        },
    }));
}

export {
    getEventReport,
    registerBulk,
    updateUserStatus,
    getEventDetailsById,getEventUserAPI,getEventUnrigsterUserAPI,refractorAllDonorsAPI,registerUserForEventAPI,
    getAllEventsAPI, getAllEventRefractor,
    addEventAPI,

}