import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useRef, useState } from "react";
import styles from "./details.module.css";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { BloodGroupOptions, GenderOptions } from "@/utils/Options";
import {
  getAdminByIdAPI,
  updateAdminAPI,
} from "@/Actions/Controllers/adminController";
import { getAreaAPI } from "@/Actions/Controllers/areaController";
import { refractorUserDetails, refractrUpdateUser } from "@/utils/dataRefractors";
import { useSelector } from "react-redux";

const EditAdmin = () => {
  const router = useRouter();
  const { id, edit } = router.query;
  const {user} = useSelector((state)=> state.user);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    weight: "",
    lastDonationDate: "",
    area: "",
    address: "",
    workAddress: "",
    isActive:"false"
  });

  const [updatedFields, setUpdatedFields] = useState({});
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    if (!router.isReady) return;
    setIsEditable(edit === "true");
  }, [router.isReady, edit]);

  useEffect(() => {
    if (!router.isReady) return;
    if(!user.role) return;
    if (!id) return;

   
    getAdminDetails(id);
    if(user.role =="SUPER_ADMIN")
      fetchAreas();
  }, [id, router.isReady, user.role]);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const res = await getAreaAPI();
      const areas = res.data.areas || [];
      setAreas(areas);
    } catch {
      setStatus({ type: "error", message: "Failed to load areas" });
    } finally {
      setLoading(false);
    }
  };

  const getAdminDetails = async (id) => {
    setLoading(true);
    try {
      const res = await getAdminByIdAPI(id);
      if (res.success) {
        const fr = await refractorUserDetails(res.data.admin);
        setForm(fr);        
      } else {
        toast.error(res.message || "Failed to fetch admin details");
      }
    } catch (err) {
      console.log(err);

      toast.error("An error occurred while fetching admin details");
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
    const data = await refractrUpdateUser(updatedFields);
    try {
      const res = await updateAdminAPI(id, data);
      if (res.success) {
        toast.success("Admin updated successfully");
        setIsEditable(false);
      } else {
        toast.error(res.data.message || "Failed to update Admin");
      }
    } catch (err) {
      toast.error("An error occurred while updating Admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      title={isEditable ? "Edit Donor" : "Donor Details"}
      loading={loading}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <h2> {isEditable ? "Edit Admin" : "Admin Details"} </h2>

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
          <div className={styles.grid}>
            <div>
              <label>Full Name *</label>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={!isEditable}
              />
            </div>

            <div>
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </div>

            <div>
              <label>Contact</label>
              <input
                name="contact"
                placeholder="Contact"
                value={form.contact}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </div>

            <div>
              <label>Date of Birth </label>
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </div>

            <div>
              <label>Gender *</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                disabled={!isEditable}
              >
                <option value="">Select Gender</option>
                {GenderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Blood Group *</label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                disabled={!isEditable}
              >
                <option value="">Select Blood Group</option>
                {BloodGroupOptions.map((bg) => (
                  <option key={bg.value} value={bg.value}>
                    {bg.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Weight (kg)</label>
              <input
                name="weight"
                type="number"
                placeholder="Weight"
                value={form.weight}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </div>

            <div>
              <label>Last Donateion Date</label>
              <input
                name="lastDonationDate"
                type="date"
                value={form.lastDonationDate}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </div>

{
  user.role =="SUPER_ADMIN" &&
  <>
  
              <div>
              <label>
                Area
                <span className={styles.required}>*</span>
              </label>
              <select
                name="area"
                value={form.area}
                onChange={handleChange}
                required
                disabled={!isEditable}
              >
                {areas.map((g) => (
                  <option key={g.name} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label>Is Active *</label>
              <select
                name="isActive"
                value={form.isActive}
                onChange={handleChange}
                required
                disabled={!isEditable}
              >
                <option value="false">False</option>
                <option value="true">True</option>
              </select>
            </div>
  </>
}


          </div>

          <div>
            <label>Address</label>
            <textarea
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              disabled={!isEditable}
            />
          </div>
          <div>
            <label>Work Address</label>
            <textarea
              name="workAddress"
              placeholder="Address"
              value={form.workAddress}
              onChange={handleChange}
              rows={3}
              disabled={!isEditable}
            />
          </div>

          {isEditable && (
            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn}>
                Update Admin
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

export default EditAdmin;
