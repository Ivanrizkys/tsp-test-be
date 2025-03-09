/**
 * Takes an array and ensures it contains at most one element, throwing an error if multiple elements are found
 * @template T - The type of elements in the array
 * @param {string} message - The error message to display if multiple elements are found
 * @returns {function(T[]): T | null} A function that:
 *   - Throws an error if the input array has more than one element
 *   - Returns the single element if array has exactly one element
 *   - Returns null if the array is empty
 * @throws {Error} If the input array contains more than one element
 */
export const takeUniqueOrThrow = (message: string) => {
  return <T>(values: T[]): null | T => {
    if (values.length > 1) throw new Error(`Found non unique value: ${message}`);
    return values.length > 0 ? values[0] : null;
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
