import MainLayout from "@/components/Layout/MainLayout";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import styles from "./details.module.css";
import { getEventDetailsById, getEventReport, registerBulk } from "@/Actions/Controllers/eventController";
import { useRouter } from "next/router";
import axios from "axios";


const COLORS = [
  "#4f46e5",
  "#22c55e",
  "#f97316",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
  "#eab308",
];

const EventDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Upload states
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await getEventDetailsById(id);
        if (res.data.success) {
          setEvent(res.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select CSV or Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      const res = await registerBulk(id, formData);
      if (res.data.success) {
        alert("Donors registered successfully");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <MainLayout>Loading...</MainLayout>;
  if (!event) return <MainLayout>No Event Found</MainLayout>;

  const rejectionData = Object.entries(event.rejectionReasons || {}).map(
    ([reason, count]) => ({ reason, count })
  );

  const bloodGroupData = Object.entries(event.bloodGroupDistribution || {}).map(
    ([group, count]) => ({ group, count })
  );

  const summaryData = [
    { name: "Registered", value: event.totalRegistered || 0 },
    { name: "Donated", value: event.totalDonorVisited || 0 },
    { name: "Rejected", value: event.totalRejected || 0 },
    { name: "Not Came", value: event.totalRegisteredNotCome || 0 },
  ];

  const conversionData = [
    { name: "Donated", value: event.totalDonorVisited || 0 },
    { name: "Rejected", value: event.totalRejected || 0 },
    { name: "Not Came", value: event.totalRegisteredNotCome || 0 },
  ];

const handleDownload = async () => {
  try {
    const res = await getEventReport(id);

    const url = window.URL.createObjectURL(res.data); // create blob URL
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Event_${event.name}_Report.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); // clean up
  } catch (err) {
    console.error(err);
    alert("Failed to download report");
  }
};




  return (
    <MainLayout title={`Event: ${event.name}`}>
      <div className={styles.container}>
        {/* BULK UPLOAD */}
        <div className={styles.uploadBox}>
          <h3>Bulk Register Donors</h3>

          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
          />

          <button
            className={styles.uploadBtn}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload & Register"}
          </button>

          <p className={styles.hint}>Accepted formats: CSV, XLSX</p>
        </div>
        
        {/* SUMMARY */}
        <div className={styles.summary}>
          <h2>{event.name}</h2>
          <ul>
            <li>
              <strong>Date:</strong> {event.date}
            </li>
            <li>
              <strong>Place:</strong> {event.place}
            </li>
            <li>
              <strong>Total Registered:</strong> {event.totalRegistered}
            </li>
            <li>
              <strong>Donated:</strong> {event.totalDonorVisited}
            </li>
            <li>
              <strong>Rejected:</strong> {event.totalRejected}
            </li>
            <li>
              <strong>Not Came:</strong> {event.totalRegisteredNotCome}
            </li>
            <li>
              <strong>Calls Made:</strong> {event.totalCallMade}
            </li>
          </ul>
        </div>
        {/* EVENT BAR */}
        <div className={styles.chart}>
          <h3>Event Statistics</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-20} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* CONVERSION PIE */}
        <div className={styles.chart}>
          <h3>Donor Conversion</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={conversionData} dataKey="value" label>
                {conversionData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* REJECTION REASONS */}{" "}
        <div className={styles.chart}>
          {" "}
          <h3>Rejection Reasons</h3>{" "}
          <ResponsiveContainer width="100%" height={300}>
            {" "}
            <PieChart>
              {" "}
              <Pie
                data={rejectionData}
                dataKey="count"
                nameKey="reason"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {" "}
                {rejectionData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}{" "}
              </Pie>{" "}
              <Tooltip /> <Legend />{" "}
            </PieChart>{" "}
          </ResponsiveContainer>{" "}
        </div>
        {/* BLOOD GROUP */}
        <div className={styles.chart}>
          <h3>Blood Group Distribution</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={bloodGroupData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DOWNLOAD REPORT */}
      <div className={styles.downloadBox}>
        <h3>Download Event Report</h3>
        <button className={styles.uploadBtn} onClick={handleDownload}>
          Download Excel
        </button>
      </div>
    </MainLayout>
  );
};

export default EventDetails;
