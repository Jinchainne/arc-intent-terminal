import fs from "node:fs/promises";
import path from "node:path";
import solc from "solc";

const projectRoot = process.cwd();
const contractPath = path.join(projectRoot, "contracts", "ArcTradeIntentLedger.sol");
const source = await fs.readFile(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "ArcTradeIntentLedger.sol": {
      content: source
    }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    },
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"]
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors?.some((entry) => entry.severity === "error")) {
  for (const error of output.errors) {
    console.error(error.formattedMessage);
  }
  process.exit(1);
}

const artifact = output.contracts["ArcTradeIntentLedger.sol"]?.ArcTradeIntentLedger;
if (!artifact) {
  console.error("ArcTradeIntentLedger artifact not found.");
  process.exit(1);
}

const targetPath = path.join(projectRoot, "lib", "arc", "intentLedgerArtifact.ts");
const fileContent = `export const arcTradeIntentLedgerArtifact = ${JSON.stringify(
  {
    abi: artifact.abi,
    bytecode: `0x${artifact.evm.bytecode.object}`
  },
  null,
  2
)} as const;\n`;

await fs.writeFile(targetPath, fileContent, "utf8");
console.log(`Wrote ${targetPath}`);
