import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useState } from "react";
import styles from "./update.module.css";
import { useRouter } from "next/router";
import {
    getEventPermission,
    getEventUserAPI,
    updateUserStatus,
} from "@/Actions/Controllers/eventController";
import { toast } from "sonner";
import { bloodDonationRejectedReasons } from "@/utils/RejectionReason";
import { TIME_SLOTS } from "@/utils/TimeSlote";
import { useDispatch, useSelector } from "react-redux";
import { setEventPermission } from "@/redux/slices/eventSlice";
import { socket } from "@/socket/socket";

/* 🔹 Call Status Options */
const CALL_STATUSES = [
    { label: "Answered", value: "ANSWERED" },
    { label: "Not Connected", value: "NOT_CONNECTED" },
    { label: "Not Answered", value: "NOT_ANSWERED" },
];

const EditEvent = () => {
    const router = useRouter();
    const { id, searchValue } = router.query;
    const { user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
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
            u.referredBy.toLowerCase().includes(search.toLowerCase()) ||
            (u.contact && u.contact.includes(search))
    );

    const timeSlotToMinutes = (slot = "") => {
        if (!slot || slot === "ANY TIME") return Infinity;

        // "08:00 - 09:00" → "08:00"
        const start = slot.split("-")[0].trim();
        const [hour, minute] = start.split(":").map(Number);

        return hour * 60 + minute;
    };
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
            case "CANCELLED":
                filteredUsers = filteredUsers.filter((u) => u.status === "CANCELLED");
                break;
            default:
                break;
        }

        const normalizeTimeSlot = (slot = "") =>
            slot
                .replace(/\s+/g, "")
                .replace("–", "-")
                .trim();


        if (timeSlotFilter) {
            filteredUsers = filteredUsers.filter(
                (u) =>
                    normalizeTimeSlot(u.timeSloat) ===
                    normalizeTimeSlot(timeSlotFilter)
            );
        } else {
            filteredUsers = filteredUsers.sort((a, b) => {
                const aTime = timeSlotToMinutes(a.timeSloat);
                const bTime = timeSlotToMinutes(b.timeSloat);

                // ✅ "ANY TIME" always last
                if (aTime === Infinity && bTime === Infinity) return 0;
                if (aTime === Infinity) return 1;
                if (bTime === Infinity) return -1;

                return aTime - bTime;
            });
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

    function convertUTCToIST_24Time(utcString) {
        return new Date(utcString).toLocaleTimeString("en-GB", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    }

    const dispatch = useDispatch();
    const { event } = useSelector((state) => state.event);
    const getPermission = async () => {
        setLoading(true)
        try {
            const res = await getEventPermission(id);
            if (res.success)
                dispatch(setEventPermission({
                    id: id,
                    canCall: res.data.permissions?.canCall || false,
                    canAcceptAttendance: res.data.permissions?.canAcceptAttendance ||false,
                })
                )
            else
                toast.error(res.data.message || "Error While Geting Permission")
        }
        catch (error) {
            toast.error(error.message || "Not able to get Your Permission");
        }
        finally {
            setLoading(false)
        }


    }
    useEffect(() => {
        if (!router.isReady || !id) return;
        getPermission();

    }, [id]);
    useEffect(() => {
        if (!event.id) return;
        getUsersData();
    }, [event.id])

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
                if (!description.trim() && !timeSlot) {
                    toast.error("Call description or TimeSloat required for answered calls");
                    return;
                }
                // if (!timeSlot) {
                //     toast.error("Please select a time slot for answered calls");
                //     return;
                // }
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
            }
            else if (actionType === "CANCELLED") {
                payload = {
                    status: "CANCELLED",
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
                setSearch('')
                setSelectedUser({})
            } else {
                toast.error(res.data?.message || "Error while updating");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const handelRegister = () => {
        router.push(`/event/${id}/register?searchValue=${search}`);
    };


    const handelUserClick = (user) => {
        if (!event.canAcceptAttendance) {
            toast.error("YOU dont have acces to this data");
            return;
        }
        setSelectedUser(user)
        router.push(`/event/${id}/update?searchValue=${user.id}`);
        if (user.role.name == "USER")
            setTimeout(() => (
                router.push(`/donor/${user.id}`)
            ), 100)
        if (user.role.name == "VOLUNTEER")
            setTimeout(() => (
                router.push(`/volunteer/${user.id}`)
            ), 100)
        if (user.role.name == "ADMIN")
            setTimeout(() => (
                router.push(`/admin/${user.id}`)
            ), 100)
    }

    const handleContactClick = (user) => {
        setSearch(user.contact || user.email);
        setSelectedUser(user);
        if (user.contact) {
            window.location.href = `tel:${user.contact}`;
        }
    };

    useEffect(() => {
        if (!router.isReady) return;
        setSelectedUser({ id: searchValue })
    }, [router])



    // SOCKET


useEffect(() => {
  const handleEventUpdate = (data) => {
    const updatedAttendee = data.attendee;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedAttendee.id ? { ...user, ...updatedAttendee } : user
      )
    );

  };

  socket.on("event-updated", handleEventUpdate);

  return () => {
    socket.off("event-updated", handleEventUpdate);
  };
}, []);

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
                        <option value="CANCELLED">Cancelled</option>
                    </select>

                    <select
                        className={styles.dropdown}
                        value={timeSlotFilter}
                        onChange={(e) => setTimeSlotFilter(e.target.value)}
                    >
                        <option value="">All Time Slots</option>
                        {TIME_SLOTS.map((t) => (
                            <option key={t.label} value={t.label}>
                                {t.label}
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
                                <th>Refer By</th>
                                <th>Calls</th>
                                <th>Call Time</th>
                                {filter === "REMAINING" && <th>Call Status</th>}
                                {filter === "REMAINING" && <th>Last Call Note</th>}
                                <th>Time Slot</th>
                                <th>Status</th>
                                {(event.canCall || event.canAcceptAttendance) && <th>Action</th>}
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
                                    <tr key={u.id}
                                        className={u.id == selectedUser?.id ? styles.selected : {}}>
                                        <td>{i + 1}</td>
                                        <td className={styles.link}>
                                            <span onClick={() => handelUserClick(u)}>
                                                {u.name}
                                            </span>
                                        </td>
                                        <td className={styles.link}>
                                            <span onClick={() => handleContactClick(u)}>
                                                {u.contact}
                                            </span>
                                        </td>
                                        <td>{u.referredBy}</td>
                                        <td>{u.totalCallMade || 0}</td>
                                        <td>{u.lastCallTime ? convertUTCToIST_24Time(u.lastCallTime) : "N/A"}</td>
                                        {filter === "REMAINING" && <td>{u.callStatus || "N/A"}</td>}
                                        {filter === "REMAINING" && (
                                            <td>{u.lastCallFeedback || "N/A"}</td>
                                        )}
                                        <td>{u.timeSloat || "-"}</td>
                                        <td>
                                            <span
                                                className={`${styles.badge} ${u.status === "DONATED"
                                                    ? styles.green
                                                    : u.status === "REJECTED"
                                                        ? styles.red
                                                        : u.status === "CANCELLED"
                                                            ? styles.gray
                                                            : styles.orange
                                                    }`}
                                            >
                                                {u.status}
                                            </span>
                                        </td>
                                        {filter === "REJECTED" && <td>{u.rejectedReason}</td>}
                                        {(event.canCall || event.canAcceptAttendance) &&
                                            <td>
                                                <button
                                                    className={styles.actionBtn}
                                                    onClick={() => openModal(u)}
                                                >
                                                    Update Status
                                                </button>
                                            </td>
                                        }
                                        {/* )} */}
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
                                {event.canAcceptAttendance && <>
                                    <option value="DONATED">Donated</option>
                                    <option value="REJECTED">Rejected</option>
                                </>
                                }
                                {event.canCall && <>
                                    <option value="CALL_MADE">Call Made</option>
                                    <option value="CANCELLED">Cancelled</option></>
                                }
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
                                    <option key={t.label} value={t.label}>
                                        {t.label}
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
