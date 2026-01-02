import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useRef, useState } from "react";
import styles from "./admin.module.css";
import { useRouter } from "next/router";
import { getRoute } from "@/utils/Routes";
import { deleteAdminAPI, gatAllAdminAPI  } from "@/Actions/Controllers/adminController";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/modal/DeleteModal";
import { refractorAllUser } from "@/utils/dataRefractors";

const DonorPage = () => {

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        name: '',
    })

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [search, setSearch] = useState("");
    const router = useRouter();

    const [admins, setAdmins] = useState([]);

    const filteredAdmins = admins.filter(
        (v) =>
            v.name.toLowerCase().includes(search.toLowerCase()) ||
            v.identifier.value.toLowerCase().includes(search.toLowerCase())
    );


    const getallAdmins = async () => {
        try {
            setLoading(true);
            const res = await gatAllAdminAPI();
            setStatus(res.status)
            if (res.success) {
                const rf = await refractorAllUser(res.data.admin);
                setAdmins(rf);                
            } else {
                toast.error(res.data.message || 'Failed to fetch Admin');
            }
        }
        catch (err) {
            toast.error(err.message || 'An error occurred while fetching Admins');
        }
        finally {
            setLoading(false);
        }
    }

    const handelClick = (id) => {
        router.push(getRoute('ADMIN_DETAILS') + `${id}`);
    }
    const handelUpdate = (id) => {
        router.push(getRoute('ADMIN_DETAILS') + `${id}?edit=true`);
    }

    const handelAddAdmin = () => {
        router.push(getRoute('ADMIN_ADD'));
    }



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
            const res = await deleteAdminAPI(deleteModal.id)
            if (res.success) {
                setAdmins(admins.filter((v) => v.id !== deleteModal.id));
                toast.success("Donor deleted Successfully !")
            }
            else
            {
                toast.error(res.message || 'An error occurred while fetching admins');
            }
        }
        catch(error)
        {
            toast.error(error.message || 'An error occurred while fetching admins');
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


    useEffect(() => {
        getallAdmins();
    }, []);


    return (
        <MainLayout title="Admin" loading={loading} status={status}>
            <div className={styles.container}>
                <DeleteConfirmModal
                    open={deleteModal.open}
                    name={deleteModal.name}
                    title="Admin"
                    onCancel={handelDeleteCancle}
                    onConfirm={handleDeleteConfirm} />
                {/* Header */}
                <div className={styles.header}>
                    <h2>Admins</h2>
                    <button onClick={handelAddAdmin} className={styles.addBtn}>+ Add Admin</button>
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
                                <th>Area</th>
                                <th>Active</th>
                                <th className={styles.actions}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdmins.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className={styles.noData}>
                                        No admins found
                                    </td>
                                </tr>
                            ) : (
                                filteredAdmins.map((v, index) => (
                                    <tr key={v.id}>
                                        <td>{index + 1}</td>
                                        <td className={styles.name} onClick={() => handelClick(v.id)}>{v.name}</td>
                                        <td className={styles.link}>
                                            {v.identifier.type === 'contact' ?
                                                <a href={`tel:${v.identifier.value}`}>{v.identifier.value}</a> :
                                                <a href={`mailto:${v.identifier.value}`}>{v.identifier.value}</a>
                                            }
                                        </td>
                                        <td>{v.area.name} , {v.area.pincode}</td>
                                        <td>{v.isActive ? "Active" :"Inactive"}</td>
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
