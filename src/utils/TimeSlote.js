// Helper: format hour to 24-hour HH:00
const format24Hour = (hour) => {
  return `${String(hour).padStart(2, "0")}:00`;
};

// Base time slots
const BASE_TIME_SLOTS = [
  { start: 8, end: 9 },
  { start: 9, end: 10 },
  { start: 10, end: 11 },
  { start: 11, end: 12 },
  { start: 12, end: 13 },
  { start: 13, end: 14 },
  { start: 14, end: 15 },
  { start: 15, end: 16 },
  { start: 16, end: 17 },
  { start: 17, end: 18 },
  { start: 18, end: 19 },
  { start: 19, end: 20 },
  { start: 20, end: 21 },
];

// Final exported slots
export const TIME_SLOTS = [
  ...BASE_TIME_SLOTS.map(slot => ({
    ...slot,
    label: `${format24Hour(slot.start)} - ${format24Hour(slot.end)}`
  })),
  { label: "ANY TIME" } // ✅ always last
];

// Auto-select time slot based on current time (24-hour logic)
export const getAutoTimeSlot = () => {
  const now = new Date();
  const hour = now.getHours();

  const slot = TIME_SLOTS.find(
    s => s.start !== undefined && hour >= s.start && hour < s.end
  );

  if (slot) return slot.label;

  const nextSlot = TIME_SLOTS.find(
    s => s.start !== undefined && s.start > hour
  );

  return nextSlot ? nextSlot.label : "ANY TIME";
};
