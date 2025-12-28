import MainLayout from "@/components/Layout/MainLayout";
import React, { useState } from "react";
import styles from "./add.module.css";
import { BloodGroupOptions, GenderOptions } from "@/utils/Options";
import { addVolunteerAPI, seedVolunteerAPI } from "@/Actions/Controllers/VolunteerController";
import { toast } from "sonner";

const AddVolunteer = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [excelFile, setExcelFile] = useState(null); 
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    weight: "",
    address: "",
    workAddress: "",
    lastDonationDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleUploadExcel = async () => {
    if (!excelFile) {
      toast.error("Please select an Excel file first");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", excelFile);
      console.log(excelFile);

      const res = await seedVolunteerAPI(formData);
      if (res.success) {
        toast.success("Excel file uploaded successfully");
      } else {
        toast.error(res.data?.message || "Failed to upload Excel");
      }
    } catch (err) {
      toast.error("Error uploading Excel file");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contact && !form.email) {
      toast.error("Please provide at least one identifier: Contact or Email");
      return;
    }
    setLoading(true);
    try {
      const res = await addVolunteerAPI(form);
      setStatus(res.status);
      if (res.success) {
        toast.success("Volunteer added successfully");
      } else {
        toast.error(res.data?.message || "Failed to add volunteer");
      }
    } catch (err) {
      toast.error("An error occurred while adding volunteer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Add Volunteer" loading={loading} status={status}>
      <div className={styles.container}>
        <h2>Add Volunteer</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Name */}
          <div className={styles.field}>
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label>Email </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Contact */}
          <div className={styles.field}>
            <label>Contact *</label>
            <input
              type="tel"
              name="contact"
              value={form.contact}
              onChange={handleChange}
            />
          </div>

          {/* DOB */}
          <div className={styles.field}>
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
             
            />
          </div>

          {/* Gender */}
          <div className={styles.field}>
            <label>Gender *</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              {GenderOptions.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Blood Group */}
          <div className={styles.field}>
            <label>Blood Group</label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
           
            >
              <option value="">SELECT</option>
              {BloodGroupOptions.map((bg) => (
                <option key={bg.value} value={bg.value}>
                  {bg.label}
                </option>
              ))}
            </select>
          </div>

          {/* Weight */}
          <div className={styles.field}>
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
            />
          </div>

          {/* Last Donation Date */}
          <div className={styles.field}>
            <label>Last Donation Date</label>
            <input
              name="lastDonationDate"
              type="date"
              value={form.lastDonationDate}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <div className={`${styles.field} ${styles.full}`}>
            <label>Address</label>
            <textarea
              name="address"
              rows="3"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className={`${styles.field} ${styles.full}`}>
            <label>Work Address</label>
            <textarea
              name="workAddress"
              rows="3"
              value={form.workAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.actions}>
            <button type="submit">Save Volunteer</button>
          </div>
        </form>
                  {/* Excel Upload */}
        
          <div className={styles.uploadBox}>
            <h3>Bulk Register Volunteer</h3>

            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleExcelChange}
            />

            <button
              className={styles.uploadBtn}
              onClick={handleUploadExcel}
            disabled={loading}
            >
              {loading ? "Uploading..." : "Upload & Register"}
            </button>

            <p className={styles.hint}>Accepted formats: CSV, XLSX</p>
          </div>

          {/* Download Template */}
          <div className={styles.field}>
            <label>Download Excel Template</label>
            <a
              href="/templates/volunteer_template.csv"
              download
              className={styles.downloadButton}
            >
              Download Template
            </a>
          </div>
      </div>
    </MainLayout>
  );
};

export default AddVolunteer;
