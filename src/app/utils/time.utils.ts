/**
 * Parse API datetime format (YYYYMMDDHHmmss) to ISO string
 * @param dateStr - Date string in format YYYYMMDDHHmmss
 * @returns ISO date string
 */
export const parseAPIDateTime = (dateStr: string): string => {
  if (!dateStr || dateStr.length !== 14) {
    return new Date().toISOString();
  }

  try {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    const second = dateStr.substring(12, 14);

    const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }

    return date.toISOString();
  } catch (error) {
    console.error("Error parsing API datetime:", error);
    return new Date().toISOString();
  }
};

/**
 * Format API datetime to human-readable format
 * @param timestamp - Date string in format YYYYMMDDHHmmss
 * @returns Formatted date string (YYYY-MM-DD HH:mm:ss) or 'N/A'
 */
export const formatAPIDateTime = (timestamp: string): string => {
  if (!timestamp || timestamp.length < 8) return "N/A";
  try {
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    const day = timestamp.substring(6, 8);
    const hour = timestamp.substring(8, 10) || "00";
    const minute = timestamp.substring(10, 12) || "00";
    const second = timestamp.substring(12, 14) || "00";
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  } catch {
    return timestamp;
  }
};

/**
 * Format API datetime to short format (hh:mm DD/MM/YY)
 * @param timestamp - Date string in format YYYYMMDDHHmmss or YYYY-MM-DD HH:mm:ss
 * @returns Formatted date string (hh:mm DD/MM/YY) or 'N/A'
 */
export const formatAPIDateTimeShort = (timestamp: string): string => {
  if (!timestamp || timestamp.length < 8) return "N/A";

  try {
    let year, month, day, hour, minute;

    if (timestamp.includes("-")) {
      year = timestamp.substring(2, 4);
      month = timestamp.substring(5, 7);
      day = timestamp.substring(8, 10);
      hour = timestamp.substring(11, 13);
      minute = timestamp.substring(14, 16);
    } else {
      year = timestamp.substring(2, 4);
      month = timestamp.substring(4, 6);
      day = timestamp.substring(6, 8);
      hour = timestamp.substring(8, 10) || "00";
      minute = timestamp.substring(10, 12) || "00";
    }

    return `${hour}:${minute} ${day}/${month}/${year}`;
  } catch {
    return timestamp;
  }
};

/**
 * Format Date object to dd/mm/yyyy
 * @param date - Date object
 * @returns Formatted date string (dd/mm/yyyy)
 */
export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format Date object or date string to dd/mm
 * @param input - Date object | ISO string | API format (YYYYMMDDHHmmss)
 * @returns Formatted string (dd/mm) or 'N/A'
 */
export const formatDayMonth = (input: Date | string | undefined): string => {
  if (!input) return "N/A";
  try {
    let date: Date;

    if (input instanceof Date) {
      date = input;
    } else if (/^\d{14}$/.test(input)) {
      const iso = parseAPIDateTime(input);
      date = new Date(iso);
    } else {
      date = new Date(input);
    }

    if (isNaN(date.getTime())) return "N/A";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  } catch {
    return "N/A";
  }
};

/**
 * Format Date object to ISO (YYYY-MM-DD)
 * @param date - Date object
 * @returns ISO date string (YYYY-MM-DD)
 */
export const formatISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDefaultDates = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    fromDate: formatDate(oneMonthAgo),
    toDate: formatDate(today),
  };
};

export const formatDateToAPI = (dateStr?: string): string => {
  if (!dateStr) return "";
  return dateStr.replace(/-/g, "");
};

export const formatISOToApiDateTime = (dateStr?: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(
    date.getHours(),
  )}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
};

/**
 * Format Date or API date string to short format (e.g., "Jun 2")
 * @param input - Date object | ISO string | API format (YYYYMMDDHHmmss)
 * @returns Formatted string (e.g., "Jun 2") or 'N/A'
 */
export const formatShortMonthDay = (input: Date | string): string => {
  if (!input) return "N/A";

  try {
    let date: Date;

    if (input instanceof Date) {
      date = input;
    } else if (/^\d{14}$/.test(input)) {
      // API format YYYYMMDDHHmmss
      const iso = parseAPIDateTime(input);
      date = new Date(iso);
    } else {
      // ISO or other valid string
      date = new Date(input);
    }

    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};