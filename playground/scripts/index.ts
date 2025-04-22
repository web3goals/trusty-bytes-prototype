import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("Starting script...");
}

main().catch((error) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
