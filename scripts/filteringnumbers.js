function filternumbers(input) {
  let value = input.value.replace(/[^0-9]/g, "");

  if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
  if (value.length > 5) value = value.slice(0, 5) + "/" + value.slice(5, 10);
  if (value.length > 0) {
    const day = value.slice(0, 2);
    if (day[0] > "3") value = "3" + value.slice(1);
    if (day[0] === "3" && day[1] > "1") value = "31" + value.slice(2);
  }
  if (value.length > 3) {
    const month = value.slice(3, 5);
    if (month[0] > "1") value = value.slice(0, 3) + "1";
    if (month[0] === "1" && month[1] > "2") value = value.slice(0, 4) + "2";
  }
  if (value.length > 6) {
    const year = value.slice(6, 10);
    if (year[0] !== "2") value = value.slice(0, 6) + "2";
    if (year[1] !== "0") value = value.slice(0, 7) + "0";
    if (year[2] !== "2") value = value.slice(0, 8) + "2";
    if (year[3] && (year[3] < "4" || year[3] > "9")) {
      value = value.slice(0, 8) + "2";
    }
  }
  input.value = value;
}
function getColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let r = (hash >> 24) & 0xff;
  let g = (hash >> 16) & 0xff;
  let b = (hash >> 8) & 0xff;
  const lightnessFactor = 0.4;
  r = Math.floor(r + (255 - r) * lightnessFactor);
  g = Math.floor(g + (255 - g) * lightnessFactor);
  b = Math.floor(b + (255 - b) * lightnessFactor);
  return `rgb(${r}, ${g}, ${b})`;
}
