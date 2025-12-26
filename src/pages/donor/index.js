import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useRef, useState } from "react";
import styles from "./donor.module.css";
import { useRouter } from "next/router";
import { getRoute } from "@/utils/Routes";
import { deleteDonorAPI, getAllDoonersAPI, refractorAllDonorsAPI, } from "@/Actions/Controllers/DonorController";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import DeleteConfirmModal from "@/components/modal/DeleteModal";

const DonorPage = () => {

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        name: '',
    })

    const isVerified = useSelector((state) => state.auth.isVerified);
    const hasFetched = useRef(false);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [search, setSearch] = useState("");
    const router = useRouter();

    const [donors, setDonors] = useState([]);

    const filteredVolunteers = donors.filter(
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
            const res = await deleteDonorAPI(deleteModal.id)
            if (res.success) {
                setDonors(donors.filter((v) => v.id !== deleteModal.id));
                toast.success("Donor deleted Successfully !")
            }
            else
            {
                toast.error(res.message || 'An error occurred while fetching donors');
            }
        }
        catch(error)
        {
            toast.error(res.message || 'An error occurred while fetching donors');
        }
        finally{
            setLoading(false)
            setDeleteModal({
                open: false,
                name: ''
            })
        }

    };

    const handelDeleteCancle = async ()=>{
        setDeleteModal({
            open: false,
            name: ''
        })
    }


    const handleAddVolunteer = () => {
        router.push(getRoute('DONOR_ADD'));
    }

    const getAllDonors = async () => {
        try {
            setLoading(true);
            const res = await getAllDoonersAPI();
            setStatus(200)
            if (res.success) {
                const rf = await refractorAllDonorsAPI(res.data.donors);
                setDonors(rf);
            } else {
                toast.error(res.message || 'Failed to fetch Donors');
            }
        }
        catch (err) {
            toast.error(err.message || 'An error occurred while fetching donors');
        }
        finally {
            setLoading(false);
        }
    }

    const handelClick = (id) => {
        router.push(getRoute('DONOR_DETAILS') + `/${id}`);
    }
    const handelUpdate = (id) => {
        router.push(getRoute('DONOR_DETAILS') + `/${id}?edit=true`);
    }

    useEffect(() => {
        if (!router.isReady) return;
        if (!isVerified) return;
        if (hasFetched.current) return;

        hasFetched.current = true;
        getAllDonors();
    }, [router.isReady, isVerified]);


    return (
        <MainLayout title="Donor" loading={loading} status={status}>
            <div className={styles.container}>
                <DeleteConfirmModal
                    open={deleteModal.open}
                    name={deleteModal.name}
                    title="Donor"
                    onCancel={handelDeleteCancle}
                    onConfirm={handleDeleteConfirm} />
                {/* Header */}
                <div className={styles.header}>
                    <h2>Donors</h2>
                    <button onClick={handleAddVolunteer} className={styles.addBtn}>+ Add Donor</button>
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
                                <th className={styles.actions}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVolunteers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className={styles.noData}>
                                        No donors found
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
                                        <td className={styles.actions}>
                                            <button
                                                onClick={() => handelUpdate(v.id)}
                                                className={styles.editBtn}>Update</button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => handleDelete(v.id, v.name)}
                                            >
                                                Delete
                                            </button>
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

export default DonorPage;
