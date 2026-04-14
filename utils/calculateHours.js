exports.calculateHours = (checkIn, checkOut) => {
  return (checkOut - checkIn) / (1000 * 60 * 60);
};