import { convertToLocalDateString } from "@/utils/DateConverter";
import { getFiles, myrouter, myUpload } from "../AxiosInitializer";


const getAllEventsAPI = async (params) => await myrouter.get('/event' ,{params})
const addEventAPI = async (data) => await myrouter.post('/event', data);
const deleteEventAPI = async (id) => await myrouter.delete(`/event/${id}`);

const getEventDetailsById = async(id)=> await myrouter.get(`/event/${id}`);


const getEventUserAPI = async(id)=> await myrouter.get(`/event/${id}/user`)
const getEventUnrigsterUserAPI = async(id)=> await myrouter.get(`/event/${id}/user/unregister`)


const registerUserForEventAPI = async(id, data) =>await myrouter.post(`/event/${id}/registerUser`, data)
const updateUserStatus = async(id,userID, data) =>await myrouter.post(`/event/${id}/userStatus/${userID}`, data)

const updateEventAPI = async(id,data) =>await myrouter.post(`/event/${id}`, data);
const registerBulk = async(id,data)=> await myUpload.post(`/event/${id}/register-bulk`, data);

const getEventPermission = async (id) => await myUpload.get(`/event/${id}/permissions`)

const getEventReport = async (id) => {
  return await myrouter.get(`/event/${id}/report`, {
    responseType: "blob",
  });
};



const getEventDataRefractor = async (e)=>{
    return {
        id: e.id,
        name: e.name,
        place:e.place,
        date:  convertToLocalDateString(e.date),
        totalDonorVisited:e.totalDonorVisited,
        totalRejected:e.totalRejected,
        totalRegisteredNotCome:e.totalRegisteredNotCome,
        totalRegistered:e.totalRegistered,
        totalCallMade:e.totalCallMade,
        area:e.area,
        startTime:e.startTime,
        endTime:e.endTime,
        volunteers:e.volunteers
    }
}
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
            area:e.area,
            volunteers:e.volunteers,
            isCompleted:e.isCompleted
        }
    ))
}




export {
    deleteEventAPI,
    getEventReport,
    registerBulk,
    updateUserStatus,
    getEventDetailsById,getEventUserAPI,getEventUnrigsterUserAPI,registerUserForEventAPI,
    getAllEventsAPI, getAllEventRefractor,
    addEventAPI,
    updateEventAPI,
    getEventDataRefractor,
    getEventPermission

}