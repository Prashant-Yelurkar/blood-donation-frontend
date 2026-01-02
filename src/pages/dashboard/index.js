// import React from "react";
// import MainLayout from "@/components/Layout/MainLayout";
// import {
//   PieChart, Pie, Cell, Legend, ResponsiveContainer,
//   BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
// } from "recharts";
// import styles from "./dashboard.module.css";

// const COLORS = ["#4caf50", "#f44336", "#ff9800", "#2196f3"];

// const EventDashboard = () => {
//   // Dummy Data
//   const summary = {
//     totalRegistered: 120,
//     totalAttended: 95,
//     totalRejected: 15,
//     totalNotCame: 10,
//     totalCallsMade: 200,
//   };

//   const bloodGroupData = [
//     { name: "A+", value: 30 },
//     { name: "B+", value: 25 },
//     { name: "O+", value: 20 },
//     { name: "AB+", value: 20 },
//   ];

//   const rejectionReasons = [
//     { name: "Low Hemoglobin", value: 5 },
//     { name: "Medical Reasons", value: 7 },
//     { name: "Personal", value: 3 },
//   ];

//   const stackedData = [
//     { bloodGroup: "A+", Donated: 20, Rejected: 5, Pending: 5 },
//     { bloodGroup: "B+", Donated: 15, Rejected: 5, Pending: 5 },
//     { bloodGroup: "O+", Donated: 18, Rejected: 2, Pending: 0 },
//     { bloodGroup: "AB+", Donated: 12, Rejected: 3, Pending: 5 },
//   ];

//   return (
//     <MainLayout title="Event Dashboard">
//       <div className={styles.container}>
//         {/* Event Summary */}
//         <div className={styles.summaryGrid}>
//           <div className={styles.card}>Registered: {summary.totalRegistered}</div>
//           <div className={styles.card}>Attended: {summary.totalAttended}</div>
//           <div className={styles.card}>Rejected: {summary.totalRejected}</div>
//           <div className={styles.card}>Not Came: {summary.totalNotCame}</div>
//           <div className={styles.card}>Calls Made: {summary.totalCallsMade}</div>
//         </div>

//         {/* Blood Group Distribution */}
//         <div className={styles.chartContainer}>
//           <h3>Blood Group Distribution</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={bloodGroupData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 label
//               >
//                 {bloodGroupData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Legend verticalAlign="bottom" />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Rejection Reasons */}
//         <div className={styles.chartContainer}>
//           <h3>Rejection Reasons</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={rejectionReasons}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 label
//               >
//                 {rejectionReasons.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Legend verticalAlign="bottom" />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Stacked Bar Chart */}
//         <div className={styles.chartContainer}>
//           <h3>Donated / Rejected / Pending by Blood Group</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={stackedData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="bloodGroup" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="Donated" stackId="a" fill="#4caf50" />
//               <Bar dataKey="Rejected" stackId="a" fill="#f44336" />
//               <Bar dataKey="Pending" stackId="a" fill="#ff9800" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </MainLayout>
//   );
// };

// export default EventDashboard;


import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import MainLayout from "@/components/Layout/MainLayout";
import { toast } from "sonner";

import { dashboardSummmary } from "@/Actions/Controllers/DashboardController";
import { registerSocketUser } from "@/socket/socket";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardSummmary()
      if (res.data.success) {
        setData(res.data.data);
      } else {
        toast.error("Failed to load dashboard");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const {user} = useSelector((state)=> state.user)
  useEffect(() => {
    if(!user.id) return;
    fetchDashboard();
  }, [user.id]);

  const s = data?.summary;




  return (
    <MainLayout title="Dashboard" loading={loading}>
      {!data ? null : (
        <div className={styles.container}>

          {/* ===== SUMMARY CARDS ===== */}
          <div className={styles.grid}>
            <Card title="Total Events" value={s.totalEvents} />
            <Card title="Active Events" value={s.activeEvents} />
            <Card title="Users" value={s.totalUsers} />
            <Card title="Registered" value={s.totalRegistered} />
            <Card title="Donated" value={s.totalDonated} color="green" />
            <Card title="Rejected" value={s.totalRejected} color="red" />
            <Card title="Pending" value={s.totalPending} color="orange" />
            <Card title="Calls Made" value={s.totalCalls} />
          </div>

          {/* ===== CHART DATA ===== */}
          <div className={styles.row}>
            <div className={styles.card}>
              <h3>Blood Group Distribution</h3>
              {data.charts.bloodGroupDistribution.length === 0 ? (
                <p className={styles.empty}>No data</p>
              ) : (
                data.charts.bloodGroupDistribution.map((b) => (
                  <div key={b._id} className={styles.listItem}>
                    <span>{b._id}</span>
                    <strong>{b.count}</strong>
                  </div>
                ))
              )}
            </div>

            <div className={styles.card}>
              <h3>Rejection Reasons</h3>
              {data.charts.rejectionReasons.length === 0 ? (
                <p className={styles.empty}>No data</p>
              ) : (
                data.charts.rejectionReasons.map((r) => (
                  <div key={r._id} className={styles.listItem}>
                    <span>{r._id}</span>
                    <strong>{r.count}</strong>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ===== RECENT EVENTS ===== */}
          <div className={styles.card}>
            <h3>Recent Events</h3>

            {data.recentEvents.length === 0 ? (
              <p className={styles.empty}>No events</p>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Place</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentEvents.map((e) => (
                      <tr key={e._id}>
                        <td>{e.name}</td>
                        <td>{new Date(e.date).toLocaleDateString()}</td>
                        <td>{e.place}</td>
                        <td>
                          <span
                            className={`${styles.badge} ${
                              e.isActive ? styles.green : styles.red
                            }`}
                          >
                            {e.isActive ? "Active" : "Closed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

const Card = ({ title, value, color }) => (
  <div className={`${styles.statCard} ${styles[color] || ""}`}>
    <p>{title}</p>
    <h2>{value}</h2>
  </div>
);

export default Dashboard;
