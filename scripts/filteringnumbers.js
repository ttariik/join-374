/**
 * Filters the input value to only allow numbers and "/" characters, 
 * formats the value as a date (DD/MM/YYYY), and validates the date.
 * @param {HTMLInputElement} input - The input element containing the date string.
 */
function filternumbers(input) {
  // Remove invalid characters (anything that is not a number or "/")
  let value = input.value.replace(/[^0-9\/]/g, ""); 

  // Automatically insert "/" separators at appropriate positions
  if (value.length > 2 && value[2] !== "/") {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }
  if (value.length > 5 && value[5] !== "/") {
    value = value.slice(0, 5) + "/" + value.slice(5);
  }

  // Split the formatted value into parts and validate each part
  const parts = value.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  /**
   * Validates the day, month, and year values and ensures they are within valid ranges.
   * Displays an error message if the validation fails.
   */
  if (
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1000 ||
    year > 9999
  ) {
    displayError("spandate", "Invalid date format.");
    return;
  }

  // Check if the date is valid and not in the past
  const inputDate = new Date(year, month - 1, day); // JavaScript months are 0-based
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Remove time from the current date for comparison

  if (inputDate < today) {
    displayError("spandate", "The date cannot be in the past.");
    return;
  }

  // Enforce a maximum length of 10 characters for the value (DD/MM/YYYY format)
  input.value = value.slice(0, 10);
}

/**
 * Generates a color from a given string.
 * The color is determined by hashing the string and adjusting the lightness for better readability.
 * @param {string} str - The input string to generate a color from.
 * @returns {string} - A CSS color string in the format `rgb(r, g, b)`.
 */
function getColorFromString(str) {
  let hash = 0;

  // Calculate a hash value based on the input string
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Extract RGB values from the hash
  let r = (hash >> 24) & 0xff;
  let g = (hash >> 16) & 0xff;
  let b = (hash >> 8) & 0xff;

  // Adjust the lightness of the color for better readability
  const lightnessFactor = 0.4;
  r = Math.floor(r + (255 - r) * lightnessFactor);
  g = Math.floor(g + (255 - g) * lightnessFactor);
  b = Math.floor(b + (255 - b) * lightnessFactor);

  // Return the color as an `rgb` string
  return `rgb(${r}, ${g}, ${b})`;
}