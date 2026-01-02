import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useRef, useState } from "react";
import styles from "./volunteer.module.css";
import { useRouter } from "next/router";
import { getRoute } from "@/utils/Routes";
import { deleteVolunteerAPI, getAllVolunteersAPI } from "@/Actions/Controllers/VolunteerController";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import DeleteConfirmModal from "@/components/modal/DeleteModal";
import { refractorAllUser } from "@/utils/dataRefractors";

const VolunteerPage = () => {

    const { user } = useSelector((state) => state.user);

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        name: '',
    })

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [search, setSearch] = useState("");
    const router = useRouter();

    const [volunteers, setVolunteers] = useState([]);

    const filteredVolunteers = volunteers.filter(
        (v) =>
            v.name.toLowerCase().includes(search.toLowerCase()) ||
            v.identifier.value.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id, name) => {
        setDeleteModal({
            open: true,
            name: name,
            id: id
        })
    };
    const handleDeleteConfirm = async () => {
        setLoading(true)
        try {
            const res = await deleteVolunteerAPI(deleteModal.id)
            if (res.success) {
                setVolunteers(volunteers.filter((v) => v.id !== deleteModal.id));
                toast.success("Volunteer deleted Successfully !")
            }
            else {
                toast.error(res.data.message || 'An error occurred while fetching volunteers');
            }
        }
        catch (error) {
            toast.error(res.message || 'An error occurred while fetching volunteers');
        }
        finally {
            setLoading(false)
            setDeleteModal({
                open: false,
                name: ''
            })
        }

    };
    const handelDeleteCancle = async () => {
        setDeleteModal({
            open: false,
            name: ''
        })
    }


    const handleAddVolunteer = () => {
        router.push(getRoute('VOLUNTEER_ADD'));
    }

    const getAllVolunteers = async () => {
        try {
            setLoading(true);
            const res = await getAllVolunteersAPI({ area: user.area?.id });
            setStatus(200)
            if (res.success) {
                const rf = await refractorAllUser(res.data.volunteers);
                setVolunteers(rf);
            } else {
                toast.error(res.data.message || 'Failed to fetch volunteers');
            }
        }
        catch (err) {
            toast.error(err.message || 'An error occurred while fetching volunteers');
        }
        finally {
            setLoading(false);
        }
    }

    const handelClick = (id) => {
        router.push(getRoute('VOLUNTEER_DETAILS') + `/${id}`);
    }
    const handelUpdate = (id) => {
        router.push(getRoute('VOLUNTEER_DETAILS') + `/${id}?edit=true`);
    }

    useEffect(() => {
        if (!router.isReady) return;
        if (!user.id) return;
        getAllVolunteers();
    }, [router.isReady, user.id]);

    return (
        <MainLayout title="Volunteer" loading={loading} status={status}>
            <div className={styles.container}>
                <DeleteConfirmModal
                    open={deleteModal.open}
                    name={deleteModal.name}
                    title="Volunteer"
                    onCancel={handelDeleteCancle}
                    onConfirm={handleDeleteConfirm} />
                {/* Header */}
                <div className={styles.header}>
                    <h2>Volunteers</h2>
                    {(user.role == "SUPER_ADMIN" || user.role == "ADMIN") && <button onClick={handleAddVolunteer} className={styles.addBtn}>+ Add Volunteer</button>}
                </div>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search by name or contact"
                    className={styles.search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Table */}
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Sr No</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Area</th>
                                <th className={styles.actions}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVolunteers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className={styles.noData}>
                                        No volunteers found
                                    </td>
                                </tr>
                            ) : (
                                filteredVolunteers.map((v, index) => (
                                    <tr key={v.id}>
                                        <td>{index + 1}</td>
                                        <td className={styles.name} onClick={() => handelClick(v.id)}>{v.name}</td>
                                        <td className={styles.link}>
                                            {v.identifier.type === 'contact' ?
                                                <a href={`tel:${v.identifier.value}`}>{v.identifier.value}</a> :
                                                <a href={`mailto:${v.identifier.value}`}>{v.identifier.value}</a>
                                            }
                                        </td>
                                        <td>{v.isActive ? "Active" : "Inactive"}</td>
                                        <td>{v.area.name} , {v.area.pincode}</td>
                                        <td className={styles.actions}>
                                            <button
                                                onClick={() => handelUpdate(v.id)}
                                                className={styles.editBtn}>Update</button>
                                            {(user.role == "SUPER_ADMIN" || user.role == "ADMIN") &&
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDelete(v.id, v.name)}
                                                >
                                                    Delete
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
};

export default VolunteerPage;
