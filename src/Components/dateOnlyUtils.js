export function formatDate(dateTime) {
  const date = new Date(dateTime);
  const options = { month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const day = date.getDate();
  const suffix = ["th", "st", "nd", "rd"][day % 10] || "th";
  const ordinalDay = `${day}${suffix}`;

  return formattedDate.replace(day.toString(), ordinalDay);
}
