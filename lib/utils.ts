import dayjs from "dayjs";


// currency format utility
// export const formatCurrency = (value: number, currency = "USD"): string => {
//   try {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency,
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(value);
//   } catch(error) {
//     const formattedValue = value.toFixed(2)
//     return `${formattedValue}`;
//   }
// };
export const formatCurrency = (value: number, currency = "USD"): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

// data time formatting
export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

// status label formatting
export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};