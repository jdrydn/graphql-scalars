function pickValue(key, values) {
  return values ? (values[`${key}`] || null) : null;
}

module.exports = {
  pickValue,
};
