import dotenv from "dotenv";
import chalk from "chalk";
import fs from "fs";
import * as readline from "node:readline/promises";
import { Client } from "@notionhq/client";
// Environment Variables
dotenv.config();

// Init Chalk
const { green, yellow, red, blue } = chalk;

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

function checkAnki() {
  console.log(green("-> Checking for Anki"));
  if (!fs.existsSync("/Applications/Anki.app")) {
    console.log(yellow("- Anki is installed"));
  } else {
    console.log(yellow("- Anki is not installed"));
    console.log(yellow("- Please install Anki"));
    process.exit(1);
  }
}

async function main() {
  console.log(green("-> Config"));
  console.log(yellow("- Notion API Key: ") + red(process.env.NOTION_API_KEY));
  checkAnki();
  console.log(green("-> Enter Notion Page ID"));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let pageId = await rl.question("Enter Notion Page URL: ");

  const pageIdMatch = pageId.match(/([a-f0-9]{32})/);
  if (pageIdMatch) {
    const pageIdMatched = pageIdMatch[0];
    console.log(yellow("- Page ID: ") + red(pageIdMatched));
    pageId = pageIdMatched;
  } else {
    console.log(red("Invalid Notion Page URL"));
  }
  pageId = `${pageId.slice(0, 8)}-${pageId.slice(8, 12)}-${pageId.slice(12, 16)}-${pageId.slice(16, 20)}-${pageId.slice(20)}`;
  notion.pages
    .retrieve({
      page_id: pageId,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });

  process.exit(0);
}

main();
