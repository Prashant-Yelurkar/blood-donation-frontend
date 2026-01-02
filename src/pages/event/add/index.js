import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import styles from "./add.module.css";
import MainLayout from "@/components/Layout/MainLayout";
import { addEventAPI } from "@/Actions/Controllers/eventController";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getAreaAPI } from "@/Actions/Controllers/areaController";
import { getAllVolunteersAPI } from "@/Actions/Controllers/VolunteerController";

const AddEvent = () => {
    const router = useRouter();
    const { user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [areas, setAreas] = useState([]);
    const [volunteers, setVolunteers] = useState([]);

    const [callVolunteers, setCallVolunteers] = useState([]);
    const [attendanceVolunteers, setAttendanceVolunteers] = useState([]);

    const [form, setForm] = useState({
        name: "",
        date: "",
        startTime: "",
        endTime: "",
        place: "",
        description: "",
        isActive: true,
        area: "",
    });

    const getAreas = async () => {
        setLoading(true)
        try {
            const res = await getAreaAPI();
            if (res.success) {
                setAreas(res.data.areas);
            }
            else
                toast.error(res.data.message || "Unable to load Areas")
        }
        catch (error) {
            toast.error(error.messsage || "Failed to load Areas!")
        }
        finally {
            setLoading(false)
        }
    }

    const getVolunteers = async () => {
    try {
        const params = {};
        if (form.area) {
        params.area = form.area; 
        }

        const res = await getAllVolunteersAPI(params);
        if (res.success) setVolunteers(res.data.volunteers);
    } catch(err) {
        console.log(err);
        
        toast.error("Failed to load volunteers");
    }
    };


        const addVolunteer = (userId, type) => {
        if (!userId) return;

        if (type === "CALL" && !callVolunteers.includes(userId)) {
        setCallVolunteers([...callVolunteers, userId]);
        }

        if (type === "ATTENDANCE" && !attendanceVolunteers.includes(userId)) {
        setAttendanceVolunteers([...attendanceVolunteers, userId]);
        }
    };

    const removeVolunteer = (userId, type) => {
        if (type === "CALL") {
        setCallVolunteers(callVolunteers.filter((id) => id !== userId));
        }
        if (type === "ATTENDANCE") {
        setAttendanceVolunteers(
            attendanceVolunteers.filter((id) => id !== userId)
        );
        }
        };


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };



    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.date || !form.startTime || !form.endTime || !form.place || !form.area) {
        toast.error("Please fill all required fields");
        return;
    }

    // Prepare volunteers array for backend
    // Each volunteer has: userId + role(s)
    const volunteerData = [];

    // Add CALL volunteers
    callVolunteers.forEach((id) => {
        const existing = volunteerData.find((v) => v.userId === id);
        if (existing) {
            if (!existing.roles.includes("CALL")) existing.roles.push("CALL");
        } else {
            volunteerData.push({ userId: id, roles: ["CALL"] });
        }
    });

    // Add ATTENDANCE volunteers
    attendanceVolunteers.forEach((id) => {
        const existing = volunteerData.find((v) => v.userId === id);
        if (existing) {
            if (!existing.roles.includes("ATTENDANCE")) existing.roles.push("ATTENDANCE");
        } else {
            volunteerData.push({ userId: id, roles: ["ATTENDANCE"] });
        }
    });

    // Final payload to send
    const payload = {
        ...form,
        volunteers: volunteerData
    };

    setLoading(true);
    try {
        const res = await addEventAPI(payload);
        setStatus(res.status);
        if (res.success) {
            toast.success(res.data.message || "Event Added Successfully!");
            router.push("/event");
        } else {
            toast.error(res.data.message || "An Unexpected Error Occurred!");
        }
    } catch (err) {
        toast.error(err.data?.message || "Server Error");
    } finally {
        setLoading(false);
    }
};


    useEffect(() => {
        if(!user) return;
        getAreas();
        setForm({
            ...form,
            area:user.area?.id || ""
        })
    }, [user])

    useEffect(()=>{
        if(!form.area) return;
        getVolunteers();
    },[form.area])

    return (
        <MainLayout title="Add Event" loading={loading} status={status}>
            <div className={styles.container}>
                <h2 className={styles.title}>Add Event</h2>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* Event Name */}
                    <div className={styles.field}>
                        <label className={styles.label}>Event Name *</label>
                        <input
                            className={styles.input}
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Blood Donation Camp"
                            required
                        />
                    </div>

                    {/* Date */}
                    <div className={styles.field}>
                        <label className={styles.label}>Date *</label>
                        <input
                            className={styles.input}
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Time */}
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Start Time *</label>
                            <input
                                className={styles.input}
                                type="time"
                                name="startTime"
                                value={form.startTime}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>End Time *</label>
                            <input
                                className={styles.input}
                                type="time"
                                name="endTime"
                                value={form.endTime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} >Area
                            <span className={styles.required}>*</span>
                        </label>
                        <select name="area" value={form.area} onChange={handleChange} required
                            className={styles.input}
                            disabled={user.role != "SUPER_ADMIN"}>
                            {user.role == "SUPER_ADMIN" && <option value="">Select</option>}
                            {areas.map((g) => (
                                <option key={g.name} value={g._id}>{g.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Place */}
                    <div className={styles.field}>
                        <label className={styles.label}>Place *</label>
                        <input
                            className={styles.input}
                            name="place"
                            value={form.place}
                            onChange={handleChange}
                            placeholder="Andheri East, Mumbai"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className={styles.field}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.textarea}
                            name="description"
                            rows={3}
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Optional event details"
                        />
                    </div>


                    {/* 🔹 CALL VOLUNTEERS */}
                       <div className={styles.field}>
                        <label className={styles.label}>Call Volunteers</label>
                    <select onChange={(e) => addVolunteer(e.target.value, "CALL")}
                          className={styles.input}>
                        <option value="">Add Volunteer</option>
                        {volunteers.map((v) => (
                            <option key={v._id} value={v._id}>{v.profile?.name}</option>
                        ))}
                    </select>
                    </div>

                    {callVolunteers.map((id) => (
                        <div key={id}>
                            {volunteers.find(v => v._id === id)?.profile?.name}
                            <button type="button" onClick={() => removeVolunteer(id, "CALL")}>❌</button>
                        </div>
                    ))}

            
                    <div className={styles.field}>
                        <label className={styles.label}>Status Volunteer</label>
                    <select onChange={(e) => addVolunteer(e.target.value, "ATTENDANCE")}
                          className={styles.input}>
                        <option value="">Add Volunteer</option>
                        {volunteers.map((v) => (
                            <option key={v._id} value={v._id}>{v.profile?.name}</option>
                        ))}
                    </select>
                    </div>

                    {attendanceVolunteers.map((id) => (
                        <div key={id}>
                            {volunteers.find(v => v._id === id)?.profile?.name}
                            <button type="button" onClick={() => removeVolunteer(id, "ATTENDANCE")}>❌</button>
                        </div>
                    ))}


                    {/* Active */}
                    <div className={styles.checkbox}>
                        <input
                            className={styles.checkboxInput}
                            type="checkbox"
                            name="isActive"
                            checked={form.isActive}
                            onChange={handleChange}
                        />
                        <label className={styles.label}>Event Active</label>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Save Event
                    </button>
                </form>
            </div>
        </MainLayout>
    );
};

export default AddEvent;
