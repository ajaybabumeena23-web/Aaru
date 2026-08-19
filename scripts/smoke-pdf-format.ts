/**
 * Smoke checks for PDF money formatting + chart year ticks.
 */
import {
  formatForPDF,
  normalizePdfMoneyText,
  isInvestmentReturnInput,
  parsePercentFromLabelValue,
} from "../src/lib/pdf/format";
import { yearAxisTicks } from "../src/lib/pdf/premium-report";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

assert(formatForPDF(7_77_41_296) === "₹7,77,41,296", "full indian format");
assert(formatForPDF(1500) === "₹1,500", "thousands");
assert(!formatForPDF(2_50_000).includes("L"), "no Lakh abbrev");
assert(
  normalizePdfMoneyText("₹12.50 L monthly") === "₹12,50,000 monthly",
  "expand L"
);
assert(normalizePdfMoneyText("₹1.23 Cr") === "₹1,23,00,000", "expand Cr");
assert(normalizePdfMoneyText("₹5.0 K") === "₹5,000", "expand K");
assert(normalizePdfMoneyText("₹\u00A01,000") === "₹1,000", "strip nbsp");
assert(isInvestmentReturnInput("Expected Return"), "expected return input");
assert(!isInvestmentReturnInput("Interest Rate"), "loan rate excluded");
assert(parsePercentFromLabelValue("18%") === 18, "parse percent");

// SIP-style: 20 yearly points → 5/10/15/20 Years (not Year 1…Year 2)
const sip20 = yearAxisTicks(20, 20);
assert(
  sip20.map((t) => t.label).join("|") === "5 Years|10 Years|15 Years|20 Years",
  `sip20 labels got ${sip20.map((t) => t.label).join("|")}`
);
assert(sip20[0].index === 4 && sip20[3].index === 19, "sip20 indices");

// EMI-style: 240 monthly points, 20 years
const emi20 = yearAxisTicks(240, 20);
assert(
  emi20.map((t) => t.label).join("|") === "5 Years|10 Years|15 Years|20 Years",
  `emi20 labels got ${emi20.map((t) => t.label).join("|")}`
);
assert(emi20[0].index === 59 && emi20[3].index === 239, "emi20 indices");

console.log("PDF format smoke checks passed.");
