
function calculateCAGR(startValue, endValue, years) {
  if (startValue <= 0 || endValue <= 0 || years <= 0) return null;

  const ratio = endValue / startValue;
  const cagr = Math.pow(ratio, 1 / years) - 1;
  return cagr;
}


function calculatePercentageChange(previous, current) {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

module.exports = {
  calculateCAGR,
  calculatePercentageChange,
};
