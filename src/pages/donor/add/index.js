import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useState } from "react";
import styles from "./add.module.css";
import { BloodGroupOptions, GenderOptions } from "@/utils/Options";
import { addDonorAPI } from "@/Actions/Controllers/DonorController";
import { getAllUsersAPI } from "@/Actions/Controllers/UserController";
import { toast } from "sonner";
import { useRouter } from "next/router";

const AddUser = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const [status, setStatus] = useState(null);
  const [users, setUsers] = useState([]);
  const [referredByName, setReferredByName] = useState("");
  const { eventID, searchValue } = router.query;

  const [form, setForm] = useState({
    name: searchValue,
    email: "",
    contact: searchValue,
    dob: "",
    gender: "",
    bloodGroup: "",
    weight: "",
    address: "",
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
     Fetch Users for Referral
  ========================== */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsersAPI();
        if (res.success) {
          setUsers(res.data.users || []);
        }
      } catch (err) {
        console.error("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  /* =========================
     Submit Form
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
        if(eventID)
          router.push(`/event/${eventID}/register?searchValue=${searchValue}`)
      } else {
        toast.error(res.data?.message || "Failed to add donor");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!router.isReady) return;

  if (searchValue) {
    setForm((prev) => ({
      ...prev,
      name: searchValue,
      contact: searchValue,
    }));
  }
}, [router.isReady, searchValue]);

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
            <input name="email" type="email" value={form.email} onChange={handleChange} />
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
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} >
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
            <label>Address</label>
            <textarea
              name="address"
              rows="3"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* 🔽 Referred By (Autocomplete) */}
          <div className={styles.field}>
            <label>Referred By (Optional)</label>

            <input
              list="userList"
              placeholder="Type name / email / contact"
              value={referredByName}
              onChange={(e) => {
                const value = e.target.value;
                setReferredByName(value);

                const selectedUser = users.find(
                  (u) =>
                    u.name === value ||
                    u.email === value ||
                    u.contact === value
                );

                setForm({
                  ...form,
                  referredBy: selectedUser ? selectedUser._id : "",
                });
              }}
            />

            <datalist id="userList">
              <option value={"DIRECT"}>DIRECT</option>
              <option value={"DESK"}>DESK</option>
              <option value={"DOOR_TO_DOOR"}>DOOR_TO_DOOR</option>

              {users.map((u) => (
                <option
                  key={u._id}
                  value={u.name || u.email || u.contact}
                />
              ))}
            </datalist>
          </div>


          {/* Submit */}
          <div className={styles.actions}>
            <button type="submit">Save Donor</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddUser;
