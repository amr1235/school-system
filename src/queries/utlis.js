const mapToJSON = payload => {
  return payload.map(item => item.toJSON());
};
const incrementAcademicYear = (prevAcademicYear) => {
  let years = prevAcademicYear.split("/");
  let firstYear = years[0];
  let secondYear = years[1];
  return [String(Number(firstYear) + 1),String(Number(secondYear) + 1)].join("/");
};
module.exports = {
  mapToJSON,
  incrementAcademicYear
};