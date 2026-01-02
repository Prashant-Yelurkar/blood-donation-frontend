import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useState } from "react";
import styles from "./details.module.css";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { getAreaDetailsAPI, updateAreaAPI } from "@/Actions/Controllers/areaController";

const EditArea = () => {
  const router = useRouter();
  const { id, edit } = router.query;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [form, setForm] = useState({
    name: "",
    pincode: "",
    isActive: false,
  });
  const [updatedFields, setUpdatedFields] = useState({});

  useEffect(() => {
    if (!router.isReady) return;
    if (edit)
      setIsEditable(edit === "true");
    getAreaDetails(id);
  }, [router.isReady, edit]);



  const getAreaDetails = async (id) => {
    setLoading(true);
    try {
      const res = await getAreaDetailsAPI(id);
      if (res.success) {
        setForm(res.data.area);
      } else {
        toast.error(res.message || "Failed to fetch area details");
      }
    } catch (err) {
      console.log(err);

      toast.error("An error occurred while fetching area details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUpdatedFields({ ...updatedFields, [e.target.name]: e.target.value });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateAreaAPI(id, form);
      setStatus(res.status);
      if (res.success) {
        toast.success("Area updated successfully");
        setIsEditable(false);
      } else {
        toast.error(res.data.message || "Failed to update Area");
      }
    } catch (err) {
      console.log(err);
      
      toast.error("An error occurred while updating Area");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
    status={status}
      title={isEditable ? "Edit Aeaa" : "Area Details"}
      loading={loading}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <h2> {isEditable ? "Edit Area" : "Area Details"} </h2>

          {!isEditable && (
            <button
              className={styles.editBtn}
              onClick={() => setIsEditable(true)}
            >
              Edit
            </button>
          )}
        </div>


        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.field}>
            <label>Name
              <span className={styles.required}>*</span>
            </label>
            <input name="name" value={form.name} onChange={handleChange} required 
            disabled={!isEditable}/>
          </div>


          <div className={styles.field}>
            <label>pincode
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
              className={styles.input}
              disabled={!isEditable}
            />
          </div>

          <div className={styles.field}>
            <label>Active
              <span className={styles.required}>*</span>
            </label>
            <select name="isActive" value={form.isActive} onChange={handleChange} required 
            disabled={!isEditable}>
              <option value="true">True</option>
              <option value="false">False</option>

            </select>
          </div>


          {isEditable && (
            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn}>
                Update Area
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setIsEditable(false)}
              >
                Cancel
              </button>
            </div>
          )}

        </form>

      </div>
    </MainLayout>
  );
};

export default EditArea;
