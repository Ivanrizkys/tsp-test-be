/**
 * Takes an array and ensures it contains exactly one element, returning that element.
 * Throws an error if the array doesn't contain exactly one element.
 *
 * @template T - The type of elements in the array
 * @param {string} message - The error message to display if the array doesn't contain exactly one element
 * @returns {function(T[]): T} - A function that takes an array and returns its single element
 * @throws {Error} - If the array is empty or contains multiple elements
 *
 * @example
 * const getSingleUser = takeUniqueOrThrow("User");
 * const user = getSingleUser(users); // Throws if users.length !== 1
 */
export const takeUniqueOrThrow = (message: string) => {
  return <T>(values: T[]): T => {
    if (values.length !== 1) throw new Error(`Found non unique or inexistent value: ${message}`);
    return values[0]!;
  };
};

/**
 * Generates a work order number with format: WO-YYYYMMDDHH-XXX
 * Where YYYYMMDDHH is the current date with hour and XXX is a unique identifier based on timestamp
 * @returns {string} - The formatted work order number
 */
export const generateWorkOrderNumber = () => {
  // Get current date and time
  const now = new Date();

  // Format year, month, day, and hour
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");

  // Create date string in YYYYMMDDHH format
  const dateTimeString = `${year}${month}${day}${hour}`;

  // Generate unique identifier using timestamp
  // Take the last 3 digits of the timestamp (milliseconds)
  const timestamp = now.getTime().toString().slice(-3);

  // Create work order number
  return `WO-${dateTimeString}-${timestamp}`;
};

/**
 * Calculates the difference in seconds between two dates, returning an integer value.
 *
 * @param {Date} date1 - The first date
 * @param {Date} date2 - The second date
 * @returns {number} The absolute difference in seconds (integer) between the two dates
 * @example
 * // Calculate difference between two specific dates
 * const startDate = new Date('2025-03-01T10:00:00');
 * const endDate = new Date('2025-03-01T10:05:30');
 * const diffInSeconds = getSecondsBetweenDates(startDate, endDate);
 * console.log(diffInSeconds); // Outputs: 330 (5 minutes and 30 seconds)
 *
 * @example
 * // Calculate time taken by an operation
 * const start = new Date();
 * // ... some operation ...
 * const end = new Date();
 * console.log(`Operation took ${getSecondsBetweenDates(start, end)} seconds`);
 */
export const getSecondsBetweenDates = (date1: Date, date2: Date): number => {
  // Convert both dates to milliseconds
  const date1Ms: number = date1.getTime();
  const date2Ms: number = date2.getTime();

  // Calculate the difference in milliseconds
  const differenceMs: number = Math.abs(date2Ms - date1Ms);

  // Convert milliseconds to seconds
  return Math.floor(differenceMs / 1000);
};

export const dateNowWithUtcPlus7 = () => {
  const date = new Date();
  return new Date(date.getTime() + 7 * 60 * 60 * 1000);
};
