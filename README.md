# Mutual Fund NAV Analysis (Console Application)

## Overview

This is a console-based Node.js application that analyzes mutual fund NAV data:

- Calculates **CAGR** (Compound Annual Growth Rate) for each fund.
- Displays the **Top 2** and **Worst 2** funds based on CAGR.
- Detects **NAV swings greater than ±5%** between consecutive dates.

All analysis is performed using NAV data downloaded from the **AMFI** website for **5 mutual funds** over the last **7 years**.

## Tech Stack

- Node.js (JavaScript)
- csv-parser
- dayjs
- inquirer (for CLI menu)

## Project Structure

```text
mutual-fund-nav-analysis/
├─ data/
│  └─ nav_data.csv
├─ src/
│  ├─ index.js
│  ├─ config/
│  │  └─ constants.js
│  ├─ utils/
│  │  ├─ fileLoader.js
│  │  └─ math.js
│  ├─ services/
│  │  └─ navAnalysisService.js
├─ package.json
└─ README.md


for runnig the project

git clone <your_repo_url>.git
cd mutual-fund-nav-analysis

npm install

node src/index.js

