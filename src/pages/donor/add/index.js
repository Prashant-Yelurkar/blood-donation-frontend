import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useState } from "react";
import styles from "./add.module.css";
import { BloodGroupOptions, GenderOptions } from "@/utils/Options";
import { addDonorAPI, seedDonorAPI } from "@/Actions/Controllers/DonorController";
import { getAllUsersAPI } from "@/Actions/Controllers/UserController";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { getAreaAPI } from "@/Actions/Controllers/areaController";
import { refracorReferalData } from "@/utils/dataRefractors";
import { useSelector } from "react-redux";

const AddUser = () => {
  const router = useRouter();
  const { eventID, searchValue } = router.query;
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [areas, setAreas] = useState([]);
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
    area: user?.area?.id,
  });


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

  const getReferals = async () => {
    try {
      const res = await getAllUsersAPI({area:form.area});
      if (res.success) {
        const data = await refracorReferalData(res.data.users);        
        setUsers(data);
      }
    } catch (err) {      
      console.error("Failed to load users");
    }
  }

  

  useEffect(() => {
  if (user?.area?.id) {
    setForm((prev) => ({
      ...prev,
      area: user.area.id,
    }));
  getReferals();
  }
}, [user?.area?.id]);



useEffect(() => {
  if (!user?.id) return;
  getAreas();
}, [user?.id]);

useEffect(()=>{
  if(!form.area) return;
  getReferals();
}, [form.area])





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
        setForm({
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
    area: user?.area?.id,
  })
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
          <div className={styles.field}>
            <label>Area
              <span className={styles.required}>*</span>
            </label>
            <select name="area" value={form.area} onChange={handleChange} required
            disabled={user.role!="SUPER_ADMIN"}>
              {user.role == "SUPER_ADMIN" && <option value="">Select</option>}
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

          {/* Referred By */}
          <div className={styles.field}>
            <label>Referred By
              <span className={styles.required}>*</span>
            </label>
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
                setForm({ ...form, referredBy: user ? user.id : value });
              }}
            />
            <datalist id="userList">
              <option value="DIRECT" />
              <option value="DESK" />
              <option value="DOOR_TO_DOOR" />
              {users.map((u) => (
                <option key={u._id} value={u.profile?.name? u.profile?.name : u.contact} />
              ))}
            </datalist>
          </div>



          {/* Submit */}
          <div className={styles.actions}>
            <button type="submit">Save Donor</button>
          </div>
        </form>
        {/* Excel Upload */}

        {
          user.role == "SUPER_ADMIN" &&
          <div className={styles.uploadBox}>
            <h3>Bulk Register Donor</h3>

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
        }


        {/* Download Template */}

        {
          user?.role == "ADMIN" &&
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
        }



      </div>

    </MainLayout>
  );
};

export default AddUser;
