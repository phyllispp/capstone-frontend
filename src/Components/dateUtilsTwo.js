export function formatDateTwo(dateTime) {
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = new Date(dateTime).toLocaleTimeString("en-US", options);
  return formattedDate;
}
