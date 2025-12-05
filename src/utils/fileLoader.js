const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const dayjs = require("dayjs");

function loadNavData(csvFilePath) {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(csvFilePath);

    if (!fs.existsSync(absolutePath)) {
      return reject(new Error(`File not found: ${absolutePath}`));
    }

    const records = [];

    fs.createReadStream(absolutePath)
      .pipe(csv())
      .on("data", (row) => {
        try {
          const fundName = row["Fund Name"]?.trim();
          const dateStr = row["Date"];
          const navStr = row["NAV"];

          if (!fundName || !dateStr || !navStr) return; // skip bad rows

          const date = dayjs(dateStr, ["YYYY-MM-DD", "DD-MM-YYYY", "DD/MM/YYYY"]);
          const nav = parseFloat(navStr);

          if (!date.isValid() || isNaN(nav)) return;

          records.push({
            fundName,
            date: date.toDate(),
            nav,
          });
        } catch (err) {
          
        }
      })
      .on("end", () => {
        resolve(records);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

module.exports = {
  loadNavData,
};
