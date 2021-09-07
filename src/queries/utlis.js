const mapToJSON = payload => {
  return payload.map(item => item.toJSON());
};

module.exports = {
  mapToJSON,
};