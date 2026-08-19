/**
 * Smoke checks for PDF money formatting (no K/L/Cr; tight ₹).
 */
import {
  formatForPDF,
  normalizePdfMoneyText,
  isInvestmentReturnInput,
  parsePercentFromLabelValue,
} from "../src/lib/pdf/format";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

assert(formatForPDF(7_77_41_296) === "₹7,77,41,296", "full indian format");
assert(formatForPDF(1500) === "₹1,500", "thousands");
assert(!formatForPDF(2_50_000).includes("L"), "no Lakh abbrev");
assert(normalizePdfMoneyText("₹12.50 L monthly") === "₹12,50,000 monthly", "expand L");
assert(normalizePdfMoneyText("₹1.23 Cr") === "₹1,23,00,000", "expand Cr");
assert(normalizePdfMoneyText("₹5.0 K") === "₹5,000", "expand K");
assert(normalizePdfMoneyText("₹\u00A01,000") === "₹1,000", "strip nbsp");
assert(isInvestmentReturnInput("Expected Return"), "expected return input");
assert(!isInvestmentReturnInput("Interest Rate"), "loan rate excluded");
assert(parsePercentFromLabelValue("18%") === 18, "parse percent");

console.log("PDF format smoke checks passed.");
