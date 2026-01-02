import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useState } from "react";
import styles from "./admin.module.css";
import { useRouter } from "next/router";
import { getRoute } from "@/utils/Routes";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/modal/DeleteModal";
import { deleteAreaAPI, getAreaAPI } from "@/Actions/Controllers/areaController";

const AreaPage = () => {

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        name: '',
    })

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [search, setSearch] = useState("");
    const router = useRouter();

    const [areas, setAreas] = useState([]);

    const filteredAreas = areas.filter(
        (v) =>
            v.name.toLowerCase().includes(search.toLowerCase()) ||
            v.pincode.toLowerCase().includes(search.toLowerCase())
    );


    const getallAreas = async () => {
        try {
            setLoading(true);
            const res = await getAreaAPI();
            setStatus(res.status)
            if (res.success) {
                setAreas(res.data.areas);                
            } else {
                toast.error(res.message || 'Failed to fetch Admin');
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
        router.push(getRoute('AREA_DETAILS') + `${id}`);
    }
    const handelUpdate = (id) => {
        router.push(getRoute('AREA_DETAILS') + `${id}?edit=true`);
    }

    const handelAddArea = () => {
        router.push(getRoute('AREA_ADD'));
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
            const res = await deleteAreaAPI(deleteModal.id)
            if (res.success) {
                setAreas(areas.filter((v) => v.id !== deleteModal.id));
                toast.success("Area deleted Successfully !")
                getallAreas();
            }
            else
            {
                toast.error(res.data.message || 'An error occurred while Delete areas');
            }
        }
        catch(error)
        {
            toast.error(error.message || 'An Server error occurred while Delete areas');
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
        getallAreas();
    }, []);


    return (
        <MainLayout title="Admin" loading={loading} status={status}>
            <div className={styles.container}>
                <DeleteConfirmModal
                    open={deleteModal.open}
                    name={deleteModal.name}
                    title="Area"
                    onCancel={handelDeleteCancle}
                    onConfirm={handleDeleteConfirm} />
                {/* Header */}
                <div className={styles.header}>
                    <h2>Area</h2>
                    <button onClick={handelAddArea} className={styles.addBtn}>+ Add Area</button>
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
                                <th>Pinceode</th>
                                <th>Active</th>
                                <th>Admins</th>
                                <th>Volunteers</th>
                                <th>Donors</th>
                                <th>Camps</th>
                                <th className={styles.actions}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAreas.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className={styles.noData}>
                                        No areas found
                                    </td>
                                </tr>
                            ) : (
                                filteredAreas.map((v, index) => (
                                    <tr key={v.id}>
                                        <td>{index + 1}</td>
                                        <td className={styles.name} onClick={() => handelClick(v._id)}>{v.name}</td>
                                        <td >{v.pincode}</td>
                                        <td>{v.isActive ? "Active" :"Inactive"}</td>
                                           <td >{v.adminCount}</td>
                                           <td >{v.volunteerCount}</td>
                                           <td >{v.donorCount}</td>
                                           <td >{v.eventCount}</td>
                                        <td className={styles.actions}>
                                            <button
                                                onClick={() => handelUpdate(v._id)}
                                                className={styles.editBtn}>Update</button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => handleDelete(v._id, v.name)}
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

export default AreaPage;
