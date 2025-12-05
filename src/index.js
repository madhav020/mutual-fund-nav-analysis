
const path = require("path");
const dayjs = require("dayjs");

let inquirer;
try {
  inquirer = require("inquirer");

  if (inquirer && inquirer.default) {
    inquirer = inquirer.default;
  }
} catch (err) {
  console.error("Failed to require inquirer. Make sure it's installed.");
  console.error("Error:", err.message);
  process.exit(1);
}
// ---------------------------------------------------------------------

const { loadNavData } = require("./utils/fileLoader");
const {
  calculateFundCAGRs,
  getTopFundsByCAGR,
  getWorstFundsByCAGR,
  detectNavSwings,
} = require("./services/navAnalysisService");

const DATA_FILE = path.join(__dirname, "..", "data", "nav_data.csv");

async function mainMenu() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose an operation:",
      choices: [
        { name: "1. Show Top 2 Performing Mutual Funds (CAGR)", value: "top" },
        { name: "2. Show 2 Worst Performing Mutual Funds (CAGR)", value: "worst" },
        { name: "3. Detect NAV Swings (> ±5%)", value: "swings" },
        { name: "4. Exit", value: "exit" },
      ],
    },
  ]);

  return answers.action;
}

function printCagrResults(title, list) {
  console.log("\n===============================");
  console.log(title);
  console.log("===============================");
  if (!list.length) {
    console.log("No funds found.");
    return;
  }
  list.forEach((item, index) => {
    const { fundName, cagr, startNav, endNav } = item;
    console.log(
      `${index + 1}. ${fundName}\n   Start NAV: ${startNav.toFixed(
        2
      )}, End NAV: ${endNav.toFixed(2)}, CAGR: ${(cagr * 100).toFixed(2)}%\n`
    );
  });
}

function printNavSwings(swings) {
  console.log("\n===============================");
  console.log("NAV Swings (> ±5%)");
  console.log("===============================");
  if (!swings.length) {
    console.log("No swings greater than ±5% found.");
    return;
  }

  swings.forEach((s, i) => {
    console.log(
      `${i + 1}. Fund: ${s.fundName}\n   Date: ${dayjs(s.date).format(
        "YYYY-MM-DD"
      )}\n   Previous NAV: ${s.previousNav.toFixed(
        2
      )}, Current NAV: ${s.currentNav.toFixed(2)}\n   Change: ${s.percentageChange.toFixed(
        2
      )}%\n`
    );
  });
}

async function run() {
  try {
    console.log("Loading NAV data from file:", DATA_FILE);
    const records = await loadNavData(DATA_FILE);
    console.log(`Loaded ${records.length} NAV records.\n`);

    const fundCagrs = calculateFundCAGRs(records);

    let exit = false;
    while (!exit) {
      const choice = await mainMenu();

      switch (choice) {
        case "top": {
          const topFunds = getTopFundsByCAGR(fundCagrs, 2);
          printCagrResults("Top 2 Funds by CAGR", topFunds);
          break;
        }
        case "worst": {
          const worstFunds = getWorstFundsByCAGR(fundCagrs, 2);
          printCagrResults("2 Worst Funds by CAGR", worstFunds);
          break;
        }
        case "swings": {
          const swings = detectNavSwings(records, 5);
          printNavSwings(swings);
          break;
        }
        case "exit":
        default:
          exit = true;
          console.log("Exiting... Goodbye!");
          break;
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
