export const dateRangeText = (selectedRange: "day" | "week" | "month"): string => {
  const now = new Date();
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  let startDate: Date;
  const endDate = now;

  switch (selectedRange) {
    case "day":
      return formatDate(now);
    case "week":
      const dayOfWeek = now.getDay(); 
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; 
      const diffToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; 
      
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      
      const sunday = new Date(now);
      sunday.setDate(now.getDate() + diffToSunday);
      
      return `${formatDate(monday)} - ${formatDate(sunday)}`;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    default:
      return "";
  }
};
