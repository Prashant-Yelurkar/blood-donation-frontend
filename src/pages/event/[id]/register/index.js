import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useRef, useState } from "react";
import styles from "./donor.module.css";
import { useRouter } from "next/router";
import { getRoute } from "@/utils/Routes";
import { toast } from "sonner";

import {
    getEventUnrigsterUserAPI,
    refractorAllDonorsAPI,
    registerUserForEventAPI,
} from "@/Actions/Controllers/eventController";
import { TIME_SLOTS } from "@/utils/TimeSlote";

const DonorPage = () => {
    const router = useRouter();
    const { id , searchValue} = router.query;

    const hasFetched = useRef(false);

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [search, setSearch] = useState(router.query?.searchValue|| "");
    const [donors, setDonors] = useState([]);

    /* 🔹 Modal State */
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState("");


    /* 🔹 Filter donors */
    const filteredDonors = donors.filter(
        (d) =>
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.identifier.value.toLowerCase().includes(search.toLowerCase())
    );

    /* 🔹 Fetch donors */
    const getAllDonors = async () => {
        try {
            setLoading(true);
            const res = await getEventUnrigsterUserAPI(id);
            setStatus(200);

            if (res.success) {
                const formatted = await refractorAllDonorsAPI(res.data.data);
                setDonors(formatted);
            } else {
                toast.error(res.message || "Failed to fetch donors");
            }
        } catch (err) {
            toast.error("Error fetching donors");
        } finally {
            setLoading(false);
        }
    };


    /* 🔹 Submit registration */
    const handleSubmitSlot = async () => {
        if (!selectedSlot) {
            toast.error("Please select a time slot");
            return;
        }

        try {
            setLoading(true);
            const res = await registerUserForEventAPI(id, {
                userId: selectedUserId,
                time: selectedSlot,
            });

            if (res.success) {
                toast.success("User registered successfully");
                setShowModal(false);
                if(searchValue)
                    router.push(`/event/${id}/edit`);
                getAllDonors(); // refresh list
            } else {
                toast.error(res.data?.message || "Registration failed");
            }
        } catch (err) {
            toast.error("Error while registering user");
        } finally {
            setLoading(false);
        }
    };


    const handleAddDonor = () => {
        router.push(`${getRoute("DONOR_ADD")}?eventID=${id}&searchValue=${searchValue}`);
    };

    const handleDetails = (userId) => {
        router.push(getRoute("DONOR_DETAILS") + `/${userId}`);
    };

    useEffect(() => {
        if (!router.isReady) return;
        if (hasFetched.current) return;

        hasFetched.current = true;
        getAllDonors();
    }, [router.isReady]);


    const getCurrentTimeSlot = () => {
    const now = new Date();
    let currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Your camp runs from 8 AM – 8 PM
    return TIME_SLOTS.find((slot) => {
        const [start] = slot.split("-");

        let [hour, minute] = start.trim().split(":").map(Number);

        const slotStartMinutes = hour * 60 + minute;
        const slotEndMinutes = slotStartMinutes + 60;

        return (
            currentMinutes >= slotStartMinutes &&
            currentMinutes < slotEndMinutes
        );
    }) || "";
};

    return (
        <MainLayout title="Donors" loading={loading} status={status}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h2>Donors</h2>
                    <button onClick={handleAddDonor} className={styles.addBtn}>
                        + Add Donor
                    </button>
                </div>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search by name or contact/email"
                    className={styles.search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Table */}
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Sr</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th className={styles.actions}>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredDonors.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className={styles.noData}>
                                        No donors found
                                    </td>
                                </tr>
                            ) : (
                                filteredDonors.map((d, i) => (
                                    <tr key={d.id}>
                                        <td>{i + 1}</td>

                                        <td
                                            className={styles.name}
                                            onClick={() => handleDetails(d.id)}
                                        >
                                            {d.name}
                                        </td>

                                        <td>
                                            {d.identifier.type === "contact" ? (
                                                <a href={`tel:${d.identifier.value}`}>
                                                    {d.identifier.value}
                                                </a>
                                            ) : (
                                                <a href={`mailto:${d.identifier.value}`}>
                                                    {d.identifier.value}
                                                </a>
                                            )}
                                        </td>

                                        <td className={styles.actions}>
                                            <button
                                                onClick={() => {
                                                    setSelectedUserId(d.id);
                                                    setSelectedSlot(getCurrentTimeSlot());
                                                    setShowModal(true);
                                                }}
                                                className={styles.editBtn}
                                            >
                                                Register
                                            </button>

                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Select Time Slot</h3>

                        <select
                            className={styles.timeInput}
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                        >
                            <option value="">Select Time Slot</option>
                            {TIME_SLOTS.map((slot) => (
                                <option key={slot.label} value={slot.label}>
                                    {slot.label}
                                </option>
                            ))}
                        </select>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.submitBtn}
                                onClick={handleSubmitSlot}
                                disabled={!selectedSlot}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default DonorPage;
