import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useState } from "react";
import styles from "./edit.module.css";
import { useRouter } from "next/router";
import {
    getEventUserAPI,
    updateUserStatus,
} from "@/Actions/Controllers/eventController";
import { toast } from "sonner";
import { bloodDonationRejectedReasons } from "@/utils/RejectionReason";
import { TIME_SLOTS } from "@/utils/TimeSlote";

/* 🔹 Call Status Options */
const CALL_STATUSES = [
    { label: "Answered", value: "ANSWERED" },
    { label: "Not Connected", value: "NOT_CONNECTED" },
    { label: "Not Answered", value: "NOT_ANSWERED" },
];

const EditEvent = () => {
    const router = useRouter();
    const { id } = router.query;

    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("REGISTERED");
    const [timeSlotFilter, setTimeSlotFilter] = useState(""); // NEW
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);

    /* 🔹 Modal States */
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState("");
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [callStatus, setCallStatus] = useState("");
    const [timeSlot, setTimeSlot] = useState("");

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            (u.contact && u.contact.includes(search))
    );

    const getUsers = () => {
        let filteredUsers = filtered;

        switch (filter) {
            case "ACCEPTED":
                filteredUsers = filteredUsers.filter((u) => u.status === "DONATED");
                break;
            case "REMAINING":
                filteredUsers = filteredUsers.filter((u) => u.status === "PENDING");
                break;
            case "REJECTED":
                filteredUsers = filteredUsers.filter((u) => u.status === "REJECTED");
                break;
            default:
                break;
        }

        if (timeSlotFilter) {
            filteredUsers = filteredUsers.filter((u) => u.timeSloat === timeSlotFilter);
        }

        return filteredUsers;
    };

    const getUsersData = async () => {
        setLoading(true);
        try {
            const res = await getEventUserAPI(id);
            if (res.success) setUsers(res.data.data);
            else toast.error("Error while fetching users");
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!router.isReady || !id) return;
        getUsersData();
    }, [id]);

    const list = getUsers();

    const openModal = (user) => {
        setSelectedUser(user);
        setActionType("");
        setReason("");
        setDescription("");
        setCallStatus("");
        setTimeSlot(user.timeSloat || "");
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!actionType) {
            toast.error("Please select action");
            return;
        }

        if (actionType === "REJECTED") {
            if (!reason) {
                toast.error("Rejection reason required");
                return;
            }
            if (!timeSlot) {
                toast.error("Please select a time slot");
                return;
            }
        }

        if (actionType === "CALL_MADE") {
            if (!callStatus) {
                toast.error("Call status required");
                return;
            }
            if (callStatus === "ANSWERED") {
                if (!description.trim()) {
                    toast.error("Call description required for answered calls");
                    return;
                }
                if (!timeSlot) {
                    toast.error("Please select a time slot for answered calls");
                    return;
                }
            }
        }

        if (actionType === "DONATED" && !timeSlot) {
            toast.error("Please select a time slot");
            return;
        }

        try {
            let payload = {};

            if (actionType === "REJECTED") {
                payload = {
                    status: "REJECTED",
                    rejectionReason: reason,
                    timeSlot,
                };
            } else if (actionType === "DONATED") {
                payload = {
                    status: "DONATED",
                    timeSlot,
                };
            } else if (actionType === "CALL_MADE") {
                payload = {
                    status: "CALL_MADE",
                    callStatus,
                    ...(callStatus === "ANSWERED" ? { description } : {}),
                    ...(timeSlot ? { timeSlot } : {}),
                };
            }

            const res = await updateUserStatus(id, selectedUser.id, payload);

            if (res?.success) {
                toast.success("Updated successfully");
                setShowModal(false);
                getUsersData();
            } else {
                toast.error(res.data?.message || "Error while updating");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const handelRegister = () => {
        router.push(`/event/${id}/register`);
    };

    return (
        <MainLayout title="Edit Event" loading={loading}>
            <div className={styles.container}>
                {/* Search */}
                <div className={styles.row}>
                    <input
                        className={styles.search}
                        placeholder="Search by name or contact"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {list.length === 0 && (
                        <button onClick={handelRegister} className={styles.addBtn}>
                            + New User
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className={styles.filtersRow}>
                    <select
                        className={styles.dropdown}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="REGISTERED">Registered Users</option>
                        <option value="ACCEPTED">Accepted (Donated)</option>
                        <option value="REMAINING">Remaining (Pending)</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                    <select
                        className={styles.dropdown}
                        value={timeSlotFilter}
                        onChange={(e) => setTimeSlotFilter(e.target.value)}
                    >
                        <option value="">All Time Slots</option>
                        {TIME_SLOTS.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Table */}
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Sr</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Calls</th>
                                {filter === "REMAINING" && <th>Call Status</th>}
                                {filter === "REMAINING" && <th>Last Call Note</th>}
                                <th>Time Slot</th>
                                <th>Status</th>
                                {filter === "REMAINING" && <th>Action</th>}
                                {filter === "REJECTED" && <th>Reason</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className={styles.noData}>
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                list.map((u, i) => (
                                    <tr key={u.id}>
                                        <td>{i + 1}</td>
                                        <td>{u.name}</td>
                                        <td className={styles.link}>
                                            {u.contact ? (
                                                <a href={`tel:${u.contact}`}>{u.contact}</a>
                                            ) : (
                                                <a href={`mailto:${u.email}`}>{u.email}</a>
                                            )}
                                        </td>
                                        <td>{u.totalCallMade || 0}</td>
                                        {filter === "REMAINING" && <td>{u.callStatus || "-"}</td>}
                                        {filter === "REMAINING" && (
                                            <td>{u.lastCallFeedback || "-"}</td>
                                        )}
                                        <td>{u.timeSloat || "-"}</td>
                                        <td>
                                            <span
                                                className={`${styles.badge} ${u.status === "DONATED"
                                                        ? styles.green
                                                        : u.status === "REJECTED"
                                                            ? styles.red
                                                            : styles.orange
                                                    }`}
                                            >
                                                {u.status}
                                            </span>
                                        </td>
                                        {filter === "REJECTED" && <td>{u.rejectedReason}</td>}
                                        {filter === "REMAINING" && (
                                            <td>
                                                <button
                                                    className={styles.actionBtn}
                                                    onClick={() => openModal(u)}
                                                >
                                                    Update Status
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 🔹 MODAL */}
                {showModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>Update Status</h3>

                            {/* Action */}
                            <select
                                className={styles.dropdown}
                                value={actionType}
                                onChange={(e) => setActionType(e.target.value)}
                            >
                                <option value="">Select Action</option>
                                <option value="DONATED">Donated</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="CALL_MADE">Call Made</option>
                            </select>

                            {/* Rejection Reason */}
                            {actionType === "REJECTED" && (
                                <select
                                    className={styles.dropdown}
                                    onChange={(e) => setReason(e.target.value)}
                                >
                                    <option value="">Select Reason</option>
                                    {bloodDonationRejectedReasons.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {/* Call Made */}
                            {actionType === "CALL_MADE" && (
                                <>
                                    <select
                                        className={styles.dropdown}
                                        value={callStatus}
                                        onChange={(e) => setCallStatus(e.target.value)}
                                    >
                                        <option value="">Select Call Status</option>
                                        {CALL_STATUSES.map((c) => (
                                            <option key={c.value} value={c.value}>
                                                {c.label}
                                            </option>
                                        ))}
                                    </select>

                                    <textarea
                                        className={styles.search}
                                        placeholder="Enter call description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </>
                            )}

                            {/* Time Slot */}
                            <select
                                className={styles.dropdown}
                                value={timeSlot}
                                onChange={(e) => setTimeSlot(e.target.value)}
                            >
                                <option value="">Select Time Slot</option>
                                {TIME_SLOTS.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>

                            {/* Actions */}
                            <div className={styles.modalActions}>
                                <button className={styles.actionBtn} onClick={handleSubmit}>
                                    Submit
                                </button>
                                <button
                                    className={styles.addBtn}
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default EditEvent;
