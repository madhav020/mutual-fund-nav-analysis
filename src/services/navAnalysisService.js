

const dayjs = require("dayjs");
const { EXPECTED_YEARS } = require("../config/constants");
const { calculateCAGR, calculatePercentageChange } = require("../utils/math");


function groupByFund(records) {
  const map = {};
  for (const r of records) {
    if (!map[r.fundName]) {
      map[r.fundName] = [];
    }
    map[r.fundName].push({ date: r.date, nav: r.nav });
  }

  
  for (const fundName of Object.keys(map)) {
    map[fundName].sort((a, b) => a.date - b.date);
  }

  return map;
}


function calculateFundCAGRs(records) {
  const grouped = groupByFund(records);
  const result = [];

  for (const [fundName, navList] of Object.entries(grouped)) {
    if (navList.length < 2) continue;

    const first = navList[0];
    const last = navList[navList.length - 1];

  
    const diffYears =
      dayjs(last.date).diff(dayjs(first.date), "day") / 365.25 || EXPECTED_YEARS;

    const cagr = calculateCAGR(first.nav, last.nav, diffYears);

    if (cagr !== null) {
      result.push({ fundName, cagr, startNav: first.nav, endNav: last.nav });
    }
  }

  return result;
}


function getTopFundsByCAGR(fundCagrs, n = 2) {
  return [...fundCagrs]
    .sort((a, b) => b.cagr - a.cagr)
    .slice(0, n);
}


function getWorstFundsByCAGR(fundCagrs, n = 2) {
  return [...fundCagrs]
    .sort((a, b) => a.cagr - b.cagr)
    .slice(0, n);
}


function detectNavSwings(records, thresholdPercent = 5) {
  const grouped = groupByFund(records);
  const swings = [];

  for (const [fundName, navList] of Object.entries(grouped)) {
    for (let i = 1; i < navList.length; i++) {
      const prev = navList[i - 1];
      const curr = navList[i];

      const change = calculatePercentageChange(prev.nav, curr.nav);
      if (change === null) continue;

      if (Math.abs(change) > thresholdPercent) {
        swings.push({
          fundName,
          date: curr.date,
          previousNav: prev.nav,
          currentNav: curr.nav,
          percentageChange: change,
        });
      }
    }
  }

  return swings;
}

module.exports = {
  calculateFundCAGRs,
  getTopFundsByCAGR,
  getWorstFundsByCAGR,
  detectNavSwings,
};
