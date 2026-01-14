import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useState } from "react";
import styles from "./details.module.css";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { BloodGroupOptions, GenderOptions } from "@/utils/Options";
import { getDonorDetailsAPI, refractrUpdateDonorAPI, updateDonorAPI } from "@/Actions/Controllers/DonorController";
import { getAreaAPI } from "@/Actions/Controllers/areaController";
import { refracorReferalData, refractorUserDetails, refractrUpdateUser } from "@/utils/dataRefractors";
import { getAllUsersAPI } from "@/Actions/Controllers/UserController"; // Make sure you have an API to fetch users
import { useSelector } from "react-redux";

const EditDonors = () => {
  const router = useRouter();
  const { id, edit } = router.query;
  const { user } = useSelector((state) => state.user)
  const [areas, setAreas] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(edit);
  const [form, setForm] = useState({});
  const [updatedFields, setUpdatedFields] = useState({});

  useEffect(() => {
    if (!router.isReady) return;
    if (!id) return;
    getDonorDetails(id);
  }, [id, router.isReady]);

  useEffect(()=>{
    if(!isEditable) return;
    getAreas();
    getUsers(); 
  }, [isEditable])
  
  const getDonorDetails = async (id) => {
    setLoading(true);
    try {
      const res = await getDonorDetailsAPI(id);
      if (res.success) {
        const fr = await refractorUserDetails(res.data.donor);
        setAreas([fr.area])
        setForm(fr);
      } else {
        toast.error(res.message || "Failed to fetch donor details");
      }
    } catch (err) {
      toast.error("An error occurred while fetching donor details");
    } finally {
      setLoading(false);
    }
  };

  const getAreas = async () => {
    try {
      const res = await getAreaAPI();
      if (res.success) {
        setAreas(res.data.areas);
      } else {
        toast.error(res.data.message || "Unable to load Areas");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load Areas!");
    }
  };
  const getUsers = async () => {
    try {
      const res = await getAllUsersAPI(); // Make sure this returns an array of users
      if (res.success) {        
        const fr = await refracorReferalData(res.data.users);     
        setUsers(fr);
      } else {
        toast.error(res.data?.message || "Failed to load users");
      }
    } catch (error) {
      log
      toast.error(error.message || "Failed to fetch users");
    }
  };

  const handleChange = (e) => {
    setUpdatedFields({ ...updatedFields, [e.target.name]: e.target.value });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReferralChange = (value) => {
    const staticTypes = ["DIRECT", "DESK", "DOOR_TO_DOOR"];
    console.log(value);
    
    if (staticTypes.includes(value)) {
      setForm({
        ...form,
        referral: { type: value, referredUser: null, name: value },
      });
      setUpdatedFields({
        ...updatedFields,
        referral: { type: value },
      });
      return;
    }

    // Update the input value while typing
    setForm({
      ...form,
      referral: { ...form.referral, name: value, type: "USER" },
    });

    

    // Match user if exists
    const user = users.find(
      (u) => u?.name === value || u.email === value || u.contact === value
    );

    if (user) {
      setUpdatedFields({
        ...updatedFields,
        referral: { type: "USER", referredUser: user?.id },
      });
    } else {
      setUpdatedFields({
        ...updatedFields,
        referral: { type: "USER" },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await refractrUpdateUser(updatedFields);
      const res = await updateDonorAPI(id, data);
      if (res.success) {
        toast.success("Donor updated successfully");
        setIsEditable(false);
      } else {
        toast.error(res.data?.message || "Failed to update donor");
      }
    } catch (err) {
      toast.error("An error occurred while updating donor");
    } finally {
      setLoading(false);
    }
  };


  return (
    <MainLayout title={isEditable ? "Edit Donor" : "Donor Details"} loading={loading}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{isEditable ? "Edit Donor" : "Donor Details"}</h2>
          {!isEditable && (
            <button className={styles.editBtn} onClick={() => setIsEditable(true)}>
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
                value={form.name || ""}
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
                value={form.email || ""}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </div>

            <div>
              <label>Contact</label>
              <input
                name="contact"
                placeholder="Contact"
                value={form.contact || ""}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </div>

            <div>
              <label>Date of Birth</label>
              <input
                name="dob"
                type="date"
                value={form.dob || ""}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </div>

            <div>
              <label>Gender *</label>
              <select
                name="gender"
                value={form.gender || ""}
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
                value={form.bloodGroup || ""}
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
                value={form.weight || ""}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </div>

            <div>
              <label>Last Donation Date</label>
              <input
                name="lastDonationDate"
                type="date"
                value={form.lastDonationDate || ""}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </div>
            {(user.role == "SUPER_ADMIN" || user.role == "ADMIN") &&
              <>
                <div className={styles.field}>
                  <label>Area<span className={styles.required}>*</span></label>
                  <select
                    name="area"
                    value={form.area?._id || ""}
                    onChange={(e)=> {
                      const update = areas.find((a)=> a._id == e.target.value);
                      setForm({...form , area:update});
                      setUpdatedFields( {...updatedFields , area:update})
                    }}
                    required
                    disabled={!isEditable}
                  >
                    <option value="">Select</option>
                    {areas.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Referred By<span className={styles.required}>*</span></label>
                  <input
                    disabled={!isEditable}
                    list="userList"
                    placeholder="Type name / email / contact"
                    value={form?.referral?.type == "USER" ? form?.referral?.name : form?.referral?.type}
                    onChange={(e) => handleReferralChange(e.target.value)}
                  />
                  <datalist id="userList">
                    <option value="DIRECT" />
                    <option value="DESK" />
                    <option value="DOOR_TO_DOOR" />
                    {users.map((u) => (
                       <option key={u.id} value={u?.name ? u?.name : u.contact} />
                    ))}
                  </datalist>
                </div>

                <div className={styles.field}>
                  <label>Active <span className={styles.required}>*</span></label>
                  <select
                    name="isActive"
                    value={form.isActive}
                    onChange={handleChange}
                    required
                    disabled={!isEditable}
                  >
                    <option value="true">ACTIVE</option>
                    <option value="false">INACTIVE</option>
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
              value={form.address || ""}
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
              value={form.workAddress || ""}
              onChange={handleChange}
              rows={3}
              disabled={!isEditable}
            />
          </div>

          {isEditable && (
            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn}>
                Update Donor
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

export default EditDonors;
