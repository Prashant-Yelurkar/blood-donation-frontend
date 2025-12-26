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
import { getEventDetailsById } from "@/Actions/Controllers/eventController";
import { useRouter } from "next/router";

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

  if (loading) return <MainLayout>Loading...</MainLayout>;
  if (!event) return <MainLayout>No Event Found</MainLayout>;

  const rejectionData = Object.entries(event.rejectionReasons || {}).map(
    ([reason, count]) => ({ reason, count })
  );

  const bloodGroupData = Object.entries(
    event.bloodGroupDistribution || {}
  ).map(([group, count]) => ({ group, count }));

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

  return (
    <MainLayout title={`Event: ${event.name}`}>
      <div className={styles.container}>
        {/* SUMMARY */}
        <div className={styles.summary}>
          <h2>{event.name}</h2>
          <ul>
            <li><strong>Date:</strong> {event.date}</li>
            <li><strong>Place:</strong> {event.place}</li>
            <li><strong>Total Registered:</strong> {event.totalRegistered}</li>
            <li><strong>Donated:</strong> {event.totalDonorVisited}</li>
            <li><strong>Rejected:</strong> {event.totalRejected}</li>
            <li><strong>Not Came:</strong> {event.totalRegisteredNotCome}</li>
            <li><strong>Calls Made:</strong> {event.totalCallMade}</li>
          </ul>
        </div>

        {/* EVENT STATS BAR CHART */}
        <div className={styles.chart}>
          <h3>Event Statistics</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={summaryData}
              margin={{ top: 30, right: 20, left: 10, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-20}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 13 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                fill="#4f46e5"
                radius={[6, 6, 0, 0]}
                label={{ position: "top", fontSize: 12 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DONOR CONVERSION PIE */}
        <div className={styles.chart}>
          <h3>Donor Conversion</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={conversionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                label
              >
                {conversionData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* REJECTION REASONS */}
        <div className={styles.chart}>
          <h3>Rejection Reasons</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={rejectionData}
                dataKey="count"
                nameKey="reason"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {rejectionData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BLOOD GROUP BAR */}
        <div className={styles.chart}>
          <h3>Blood Group Distribution</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={bloodGroupData}
              margin={{ top: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="group"
                angle={-15}
                textAnchor="end"
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventDetails;
