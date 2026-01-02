import MainLayout from "@/components/Layout/MainLayout";
import React, { useEffect, useState } from "react";
import styles from "./edit.module.css";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  getEventDetailsById,
  updateEventAPI,
} from "@/Actions/Controllers/eventController";
import { getAllVolunteersAPI } from "@/Actions/Controllers/VolunteerController";

const EventDetails = () => {
  const router = useRouter();
  const { id, edit } = router.query; // edit=true makes form editable by default
  const { user } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const [isEditable, setIsEditable] = useState(edit === "true");

  const [allVolunteers, setAllVolunteers] = useState([]);
  const [callVolunteers, setCallVolunteers] = useState([]);
  const [attendanceVolunteers, setAttendanceVolunteers] = useState([]);

  // Fetch Event Details
  const getEventDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getEventDetailsById(id);
      if (res.success) {
        const event = res.data.event;

        // Populate volunteers by role
        const calls = [];
        const attendance = [];
        if (event.volunteers?.length > 0) {
          event.volunteers.forEach((v) => {
            if (v.permissions?.canCall) calls.push(v.user._id || v.user);
            if (v.permissions?.canAcceptAttendance) attendance.push(v.user._id || v.user);
          });
        }

        setCallVolunteers(calls);
        setAttendanceVolunteers(attendance);
        setForm(event);

        // Fetch volunteers for this event's area
        if (event.area) getVolunteers(event.area._id || event.area);
      } else {
        toast.error(res.message || "Failed to fetch event details");
      }
    } catch (err) {
      toast.error("Server error while fetching event details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Volunteers for given area
  const getVolunteers = async (areaId) => {
    if (!areaId) return;
    try {
      const res = await getAllVolunteersAPI({ area: areaId });
      if (res.success) setAllVolunteers(res.data.volunteers);
    } catch (err) {
      toast.error("Failed to fetch volunteers");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addVolunteer = (userId, type) => {
    if (!userId) return;
    if (type === "CALL" && !callVolunteers.includes(userId)) {
      setCallVolunteers([...callVolunteers, userId]);
    }
    if (type === "ATTENDANCE" && !attendanceVolunteers.includes(userId)) {
      setAttendanceVolunteers([...attendanceVolunteers, userId]);
    }
  };

  const removeVolunteer = (userId, type) => {
    if (type === "CALL") {
      setCallVolunteers(callVolunteers.filter((id) => id !== userId));
    }
    if (type === "ATTENDANCE") {
      setAttendanceVolunteers(attendanceVolunteers.filter((id) => id !== userId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const volunteersPayload = [];

    callVolunteers.forEach((id) => {
      const existing = volunteersPayload.find((v) => v.user.toString() === id);
      if (existing) existing.permissions.canCall = true;
      else
        volunteersPayload.push({
          user: id,
          permissions: { canCall: true, canAcceptAttendance: false },
        });
    });

    attendanceVolunteers.forEach((id) => {
      const existing = volunteersPayload.find((v) => v.user.toString() === id);
      if (existing) existing.permissions.canAcceptAttendance = true;
      else
        volunteersPayload.push({
          user: id,
          permissions: { canCall: false, canAcceptAttendance: true },
        });
    });

    const payload = { ...form, volunteers: volunteersPayload };

    try {
      const res = await updateEventAPI(id, payload);
      if (res.success) {
        toast.success("Event updated successfully");
        setIsEditable(false);
      } else {
        toast.error(res.message || "Failed to update event");
      }
    } catch (err) {
        console.log(err);
        
      toast.error("Server error while updating event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    getEventDetails();
  }, [router.isReady, id]);

  return (
    <MainLayout title={isEditable ? "Edit Event" : "Event Details"} loading={loading}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{isEditable ? "Edit Event" : "Event Details"}</h2>
          {!isEditable && (
            <button className={styles.editBtn} onClick={() => setIsEditable(true)}>
              Edit
            </button>
          )}
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Event Basic Info */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Event Name *</label>
              <input
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                placeholder="Event Name"
                disabled={!isEditable}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={form.date?.split("T")[0] || ""}
                onChange={handleChange}
                disabled={!isEditable}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Start Time *</label>
              <input
                type="time"
                name="startTime"
                value={form.startTime || ""}
                onChange={handleChange}
                disabled={!isEditable}
                required
              />
            </div>

            <div className={styles.field}>
              <label>End Time *</label>
              <input
                type="time"
                name="endTime"
                value={form.endTime || ""}
                onChange={handleChange}
                disabled={!isEditable}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Area *</label>
            <input type="text" value={form.area?.name || ""} disabled />
          </div>

          <div className={styles.field}>
            <label>Place *</label>
            <input
              name="place"
              value={form.place || ""}
              onChange={handleChange}
              disabled={!isEditable}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              rows={4}
              disabled={!isEditable}
            />
          </div>

          {/* Completed Field */}
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              name="completed"
              checked={form.completed || false}
              onChange={handleChange}
              disabled={!isEditable}
            />
            <label>Completed</label>
          </div>

          {/* Volunteers Section */}
          <div className={styles.volunteersSection}>
            <h3>Volunteers</h3>

            {/* Call Volunteers */}
            <div className={styles.volunteerGroup}>
              {isEditable && (
                <select
                  onChange={(e) => addVolunteer(e.target.value, "CALL")}
                  className={styles.dropdown}
                >
                  <option value="">Add Call Volunteer</option>
                  {allVolunteers.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.profile?.name}
                    </option>
                  ))}
                </select>
              )}
              <strong>Call Volunteers:</strong>
              <ul className={styles.volunteerList}>
                {callVolunteers.map((id) => (
                  <li key={id}>
                    {allVolunteers.find((v) => v._id === id)?.profile?.name || id}
                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => removeVolunteer(id, "CALL")}
                      >
                        ❌
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Attendance Volunteers */}
            <div className={styles.volunteerGroup}>
              {isEditable && (
                <select
                  onChange={(e) => addVolunteer(e.target.value, "ATTENDANCE")}
                  className={styles.dropdown}
                >
                  <option value="">Add Attendance Volunteer</option>
                  {allVolunteers.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.profile?.name}
                    </option>
                  ))}
                </select>
              )}
              <strong>Attendance Volunteers:</strong>
              <ul className={styles.volunteerList}>
                {attendanceVolunteers.map((id) => (
                  <li key={id}>
                    {allVolunteers.find((v) => v._id === id)?.profile?.name || id}
                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => removeVolunteer(id, "ATTENDANCE")}
                      >
                        ❌
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.checkbox}>
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive || false}
              onChange={handleChange}
              disabled={!isEditable}
            />
            <label>Event Active</label>
          </div>

          {isEditable && (
            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn}>
                Update Event
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

export default EventDetails;
