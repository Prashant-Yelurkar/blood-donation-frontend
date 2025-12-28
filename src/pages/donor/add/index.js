import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useState } from "react";
import styles from "./add.module.css";
import { BloodGroupOptions, GenderOptions } from "@/utils/Options";
import { addDonorAPI, seedDonorAPI } from "@/Actions/Controllers/DonorController";
import { getAllUsersAPI } from "@/Actions/Controllers/UserController";
import { toast } from "sonner";
import { useRouter } from "next/router";

const AddUser = () => {
  const router = useRouter();
  const { eventID, searchValue } = router.query;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [users, setUsers] = useState([]);
  const [referredByName, setReferredByName] = useState("");
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    name: searchValue || "",
    email: "",
    contact: searchValue || "",
    dob: "",
    gender: "",
    bloodGroup: "",
    weight: "",
    address: "",
    workAddress: "",
    lastDonationDate: "",
    referredBy: "",
  });

  /* =========================
     Handle Input Change
  ========================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =========================
     Fetch Users (Referral)
  ========================== */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsersAPI();
        if (res.success) setUsers(res.data.users || []);
      } catch (err) {
        console.error("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  /* =========================
     Handle Excel / CSV Upload
  ========================== */
  const handleExcelChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadFile = async () => {
    if (!file) {
      toast.error("Please select Excel or CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await seedDonorAPI(formData);
      if (res.success) {
        toast.success("File uploaded successfully");
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch (err) {
      console.log(err);
      
      toast.error("Upload error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Submit Single Donor
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.contact && !form.email) {
      toast.error("Please provide Contact or Email");
      return;
    }

    setLoading(true);
    try {
      const res = await addDonorAPI(form);
      setStatus(res.status);
      if (res.success) {
        toast.success("Donor added successfully");
        if (eventID) {
          router.push(`/event/${eventID}/register?searchValue=${searchValue}`);
        }
      } else {
        toast.error(res.data?.message || "Failed to add donor");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Add Donor" loading={loading} status={status}>
      <div className={styles.container}>
        <h2>Add Donor</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Name */}
          <div className={styles.field}>
            <label>Name</label>
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
            <label>Gender</label>
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

          {/* Referred By */}
          <div className={styles.field}>
            <label>Referred By</label>
            <input
              list="userList"
              placeholder="Type name / email / contact"
              value={referredByName}
              onChange={(e) => {
                const value = e.target.value;
                setReferredByName(value);
                const user = users.find(
                  (u) => u.name === value || u.email === value || u.contact === value
                );
                setForm({ ...form, referredBy: user ? user._id : value });
              }}
            />
            <datalist id="userList">
              <option value="DIRECT" />
              <option value="DESK" />
              <option value="DOOR_TO_DOOR" />
              {users.map((u) => (
                <option key={u._id} value={u.name || u.email || u.contact} />
              ))}
            </datalist>
          </div>



          {/* Submit */}
          <div className={styles.actions}>
            <button type="submit">Save Donor</button>
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
              onClick={handleUploadFile}
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

export default AddUser;
