import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useState } from "react";
import styles from "./add.module.css";
import { BloodGroupOptions, GenderOptions } from "@/utils/Options";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { getAreaAPI } from "@/Actions/Controllers/areaController";
import { addAdminAPI } from "@/Actions/Controllers/adminController";
import { getRoute } from "@/utils/Routes";

const Add_Admin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({
    name:   "",
    email: "",
    contact:  "",
    dob: "",
    gender: "",
    bloodGroup: "",
    weight: "",
    address: "",
    workAddress: "",
    area: ""
  });
  const [areas, setAreas] = useState([]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getAreas = async () => {
    try {
      const res = await getAreaAPI();
      if (res.success) {
        setAreas(res.data.areas);
      }
      else
        toast.error(res.data.message || "Unable to load Areas")
    }
    catch (error) {
      toast.error(error.messsage || "Failed to load Areas!")
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contact && !form.email) {
      toast.error("Please provide Contact or Email");
      return;
    }
    setLoading(true);
    try {
      const res = await addAdminAPI(form);
      setStatus(res.status);
      if (res.success) {
        toast.success("Admin added successfully");
        router.push(getRoute("ADMIN"))
      } else {
        toast.error(res.data?.message || "Failed to add admin");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    getAreas();
  },[])

  return (
    <MainLayout title="Add Donor" loading={loading} status={status}>
      <div className={styles.container}>
        <h2>Add ADMIN</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Name */}
          <div className={styles.field}>
            <label>Name
              <span className={styles.required}>*</span>
            </label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </div>

          {/* Contact */}
          <div className={styles.field}>
            <label>Contact</label>
            <input name="contact" value={form.contact} onChange={handleChange} />
          </div>

          {/* DOB */}
          <div className={styles.field}>
            <label>Date of Birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} />
          </div>

          {/* Gender */}
          <div className={styles.field}>
            <label>Gender
                  <span className={styles.required}>*</span>
            </label>
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select</option>
              {GenderOptions.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          {/* Blood Group */}
          <div className={styles.field}>
            <label>Blood Group</label>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
              <option value="">Select</option>
              {BloodGroupOptions.map((bg) => (
                <option key={bg.value} value={bg.value}>{bg.label}</option>
              ))}
            </select>
          </div>

          {/* Weight */}
          <div className={styles.field}>
            <label>Weight (kg)</label>
            <input type="number" name="weight" value={form.weight} onChange={handleChange} />
          </div>

          {/* Last Donation Date */}
          <div className={styles.field}>
            <label>Last Donation Date</label>
            <input
              type="date"
              name="lastDonationDate"
              value={form.lastDonationDate}
              onChange={handleChange}
            />
          </div>

            {/* Areas */}
          <div className={styles.field}>
            <label>Area
                  <span className={styles.required}>*</span>
            </label>
            <select name="area" value={form.area} onChange={handleChange} required>
              <option value="">Select</option>
              {areas.map((g) => (
                <option key={g.name} value={g._id}>{g.name}</option>
              ))}
            </select>
          </div>


          {/* Address */}
          <div className={`${styles.field} ${styles.full}`}>
            <label>Home Address</label>
            <textarea
              name="address"
              rows="3"
              value={form.address}
              onChange={handleChange}

            />
          </div>
          {/* Work Address */}
          <div className={`${styles.field} ${styles.full}`}>
            <label>Work Address</label>
            <textarea
              name="workAddress"
              rows="3"
              value={form.workAddress}
              onChange={handleChange}
            />
          </div>




          {/* Submit */}
          <div className={styles.actions}>
            <button type="submit">Save Admin</button>
          </div>
        </form>
      </div>

    </MainLayout>
  );
};

export default Add_Admin;
