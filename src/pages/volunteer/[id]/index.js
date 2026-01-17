import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useRef, useState } from "react";
import styles from "./details.module.css";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { getAllVolunteersDetailsAPI, updateVolunteerAPI } from "@/Actions/Controllers/VolunteerController";

import { BloodGroupOptions, GenderOptions } from "@/utils/Options";
import { refractorUserDetails, refractrUpdateUser } from "@/utils/dataRefractors";
import { getAreaAPI } from "@/Actions/Controllers/areaController";
import { useSelector } from "react-redux";



const EditVolunteer = () => {
  const router = useRouter();
  const { id, edit } = router.query;
  const [areas, setAreas] = useState([]);


  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(edit);
  const [form, setForm] = useState({});
  const [updatedFields, setUpdatedFields] = useState({});
  useEffect(() => {
    if (!router.isReady) return;
    if (!id) return;
    getVolunteerDetails(id);
  }, [id, router.isReady]);


  useEffect(() => {
    if (!isEditable) return;
    fetchAreas();

  }, [isEditable])

  const getVolunteerDetails = async (id) => {
    setLoading(true);
    try {
      const res = await getAllVolunteersDetailsAPI(id);
      if (res.success) {
        const fr = await refractorUserDetails(res.data.volunteer);
        setForm(fr);
        setAreas([fr.area])
      } else {

        toast.error(res.message || "Failed to fetch volunteer details");
      }
    } catch (err) {
      console.log(err);

      toast.error("An error occurred while fetching volunteer details");
    } finally {
      setLoading(false);
    }
  };

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


  const handleChange = (e) => {
    setUpdatedFields({ ...updatedFields, [e.target.name]: e.target.value });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await refractrUpdateUser(updatedFields);
    console.log(data);

    try {
      const res = await updateVolunteerAPI(id, data);
      if (res.success) {
        toast.success('Volunteer updated successfully');
        setIsEditable(false);
      } else {
        toast.error(res.data.message || 'Failed to update volunteer');
      }
    }
    catch (err) {
      toast.error('An error occurred while updating volunteer');
    }
    finally {
      setLoading(false);
    }
  };
  const { user } = useSelector((state) => state.user)
  return (
    <MainLayout title="Edit Volunteer" loading={loading}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2> {isEditable ? "Edit Volunteer" : "Volunteer Details"} </h2>

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
                {
                  GenderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                }
              </select>
            </div>

            <div>
              <label>Blood Group </label>
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
              (user.role == "SUPER_ADMIN" ) &&
                <div>
                  <label>
                    Area
                    <span className={styles.required}>*</span>
                  </label>
                  <select
                    name="area"
                    value={form.area?._id || ""}
                    onChange={(e) => {
                      const update = areas.find((a) => a._id == e.target.value);
                      setForm({ ...form, area: update });
                      setUpdatedFields({ ...updatedFields, area: update })
                    }}
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


     
            }

            {
              (user.role == "SUPER_ADMIN" || user.role == "ADMIN") &&
                <div>
                  <label>Is Active *</label>
                  <select
                    name="isActive"
                    value={form.isActive}
                    onChange={handleChange}
                    required
                    disabled={!isEditable}
                  >
                    <option value="false">Active</option>
                    <option value="true">Inactive</option>
                  </select>
                </div>
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
              placeholder="Work Address"
              value={form.workAddress}
              onChange={handleChange}
              rows={3}
              disabled={!isEditable}
            />
          </div>

          {isEditable && (
            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn}>
                Update Volunteer
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

export default EditVolunteer;
