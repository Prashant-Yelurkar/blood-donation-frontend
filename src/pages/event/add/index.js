import React, { useState } from "react";
import { toast } from "sonner";
import styles from "./add.module.css";
import MainLayout from "@/components/Layout/MainLayout";
import { addEventAPI } from "@/Actions/Controllers/eventController";

const AddEvent = ({ volunteers = [] }) => {

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null)
    const [form, setForm] = useState({
        name: "",
        date: "",
        startTime: "",
        endTime: "",
        place: "",
        description: "",
        isActive: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };


    const handleSubmit =async (e) => {
        e.preventDefault();

        if (!form.name || !form.date || !form.startTime || !form.endTime || !form.place) {
            toast.error("Please fill all required fields");
            return;
        }   
        setLoading(true)
        try{
            const res = await addEventAPI(form);
            setStatus(res.status)
            if(res.success)
            {
                toast.success(res.data.message || "Event Added Successfully!")
            }
            else
            {
                toast.error(res.data.message || "An Unexpected Error Occured!")
            }
        }
        catch(err)
        {
            toast.error(err.data.message || "Server Error")
        }
        finally{
            setLoading(false)
        }
    };

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
