import MainLayout from "@/components/Layout/MainLayout";
import React, { useState } from "react";
import styles from "./add.module.css";
import { toast } from "sonner";
import { addAreaAPI, } from "@/Actions/Controllers/areaController";


const Add_Area = () => {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [form, setForm] = useState({
    name: '',
    pincode: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name || !form.pincode) {
      toast.error("All fields are required")
      return
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error("Pincode must be 6 digits")
      return
    }
    setLoading(true);
    try {
      const res = await addAreaAPI(form);
      setStatus(res.status);
      if (res.success) {
        toast.success(res.data.message || "Area Added Succesfully!!");
        setForm({ name: '', pincode: '' })
      }
      else
        toast.error(res.data.message || "Not Able Add Area!");
    }
    catch (error) {
      toast.error(error.message || "Server Error");
    }
    finally {
      setLoading(false);
    }
  }



  return (
    <MainLayout title="Add Donor" loading={loading} status={status}>
      <div className={styles.container}>
        <h2>Add Areas</h2>

        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.field}>
            <label>Name
              <span className={styles.required}>*</span>
            </label>
            <input name="name" value={form.name} onChange={handleChange} required />
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
            />
          </div>

          <div className={styles.field}>
            <label>Active
              <span className={styles.required}>*</span>
            </label>
            <select name="isActive" value={form.isActive} onChange={handleChange} required>
              <option value="true">True</option>
              <option value="false">False</option>

            </select>
          </div>

          {/* Submit */}
          <div className={styles.actions}>
            <button type="submit">Save Area</button>
          </div>
        </form>
      </div>

    </MainLayout>
  );
};

export default Add_Area;
