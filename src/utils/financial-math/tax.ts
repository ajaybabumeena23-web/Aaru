import {
  EQUITY_LTCG_EXEMPTION,
  EQUITY_LTCG_RATE,
  EQUITY_STCG_RATE,
  NEW_REGIME_87A,
  NEW_REGIME_SLABS,
  NEW_STANDARD_DEDUCTION,
  OLD_REGIME_87A,
  OLD_REGIME_SLABS,
  OLD_STANDARD_DEDUCTION,
  REAL_ESTATE_LTCG_RATE,
  REAL_ESTATE_STCG_RATE,
  type TaxBreakdown,
  type TaxSlab,
} from "./constants";
import { round0, round2 } from "./helpers";

function taxFromSlabs(
  income: number,
  slabs: TaxSlab[]
): Pick<TaxBreakdown, "taxBeforeRebate" | "slabWise"> {
  let remaining = Math.max(0, income);
  let prevCap = 0;
  let tax = 0;
  const slabWise: TaxBreakdown["slabWise"] = [];

  for (const slab of slabs) {
    const cap = slab.upTo;
    const band = cap === null ? remaining : Math.min(remaining, cap - prevCap);
    if (band <= 0 && cap !== null) {
      prevCap = cap;
      continue;
    }
    const slice = Math.max(0, band);
    const sliceTax = slice * slab.rate;
    tax += sliceTax;
    slabWise.push({
      from: prevCap,
      to: cap,
      rate: slab.rate,
      tax: round0(sliceTax),
    });
    remaining -= slice;
    if (cap !== null) prevCap = cap;
    if (remaining <= 0) break;
  }

  return { taxBeforeRebate: round0(tax), slabWise };
}

export type IncomeTaxInput = {
  grossIncome: number;
  /** Chapter VI-A / 80C etc. — applied only in old regime. */
  deductions80C?: number;
  otherDeductions?: number;
  /** HRA / other exemptions — old regime. */
  exemptions?: number;
  isSalaried?: boolean;
  /** Apply 4% health & education cess. */
  applyCess?: boolean;
};

export type RegimeTaxResult = TaxBreakdown & {
  regime: "old" | "new";
  standardDeduction: number;
};

export function calculateIncomeTax(
  input: IncomeTaxInput
): { old: RegimeTaxResult; new: RegimeTaxResult; better: "old" | "new" | "same" } {
  const {
    grossIncome,
    deductions80C = 0,
    otherDeductions = 0,
    exemptions = 0,
    isSalaried = true,
    applyCess = true,
  } = input;

  const oldStd = isSalaried ? OLD_STANDARD_DEDUCTION : 0;
  const newStd = isSalaried ? NEW_STANDARD_DEDUCTION : 0;

  const oldTaxable = Math.max(
    0,
    grossIncome - oldStd - deductions80C - otherDeductions - exemptions
  );
  const newTaxable = Math.max(0, grossIncome - newStd);

  const old = buildRegimeResult("old", oldTaxable, OLD_REGIME_SLABS, OLD_REGIME_87A, oldStd, applyCess);
  const neu = buildRegimeResult("new", newTaxable, NEW_REGIME_SLABS, NEW_REGIME_87A, newStd, applyCess);

  let better: "old" | "new" | "same" = "same";
  if (old.totalTax < neu.totalTax) better = "old";
  else if (neu.totalTax < old.totalTax) better = "new";

  return { old, new: neu, better };
}

function buildRegimeResult(
  regime: "old" | "new",
  taxableIncome: number,
  slabs: TaxSlab[],
  rebateCfg: { maxIncome: number; maxRebate: number },
  standardDeduction: number,
  applyCess: boolean
): RegimeTaxResult {
  const { taxBeforeRebate, slabWise } = taxFromSlabs(taxableIncome, slabs);
  let rebate87A = 0;
  if (taxableIncome <= rebateCfg.maxIncome) {
    rebate87A = Math.min(taxBeforeRebate, rebateCfg.maxRebate);
  }
  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate87A);
  const cess = applyCess ? round0(taxAfterRebate * 0.04) : 0;
  const totalTax = taxAfterRebate + cess;
  const effectiveRate =
    taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;

  return {
    regime,
    taxableIncome: round0(taxableIncome),
    taxBeforeRebate,
    rebate87A: round0(rebate87A),
    taxAfterRebate: round0(taxAfterRebate),
    cess,
    totalTax: round0(totalTax),
    effectiveRate: round2(effectiveRate),
    slabWise,
    standardDeduction,
  };
}

export type CapitalGainsInput = {
  asset: "equity" | "real-estate";
  purchasePrice: number;
  salePrice: number;
  /** Holding period in months. */
  holdingMonths: number;
  /** Optional indexed cost for real estate (legacy path). */
  indexedCost?: number;
};

export type CapitalGainsResult = {
  gain: number;
  isLongTerm: boolean;
  rate: number;
  exemptionUsed: number;
  tax: number;
  netProceeds: number;
};

export function calculateCapitalGains(
  input: CapitalGainsInput
): CapitalGainsResult {
  const { asset, purchasePrice, salePrice, holdingMonths, indexedCost } = input;
  const cost = indexedCost ?? purchasePrice;
  const gain = round0(salePrice - cost);

  if (asset === "equity") {
    const isLongTerm = holdingMonths >= 12;
    if (gain <= 0) {
      return {
        gain,
        isLongTerm,
        rate: isLongTerm ? EQUITY_LTCG_RATE : EQUITY_STCG_RATE,
        exemptionUsed: 0,
        tax: 0,
        netProceeds: salePrice,
      };
    }
    if (isLongTerm) {
      const exemptionUsed = Math.min(gain, EQUITY_LTCG_EXEMPTION);
      const tax = round0(Math.max(0, gain - EQUITY_LTCG_EXEMPTION) * EQUITY_LTCG_RATE);
      return {
        gain,
        isLongTerm: true,
        rate: EQUITY_LTCG_RATE,
        exemptionUsed,
        tax,
        netProceeds: salePrice - tax,
      };
    }
    const tax = round0(gain * EQUITY_STCG_RATE);
    return {
      gain,
      isLongTerm: false,
      rate: EQUITY_STCG_RATE,
      exemptionUsed: 0,
      tax,
      netProceeds: salePrice - tax,
    };
  }

  // Real estate: LTCG if held > 24 months
  const isLongTerm = holdingMonths > 24;
  if (gain <= 0) {
    return {
      gain,
      isLongTerm,
      rate: isLongTerm ? REAL_ESTATE_LTCG_RATE : REAL_ESTATE_STCG_RATE,
      exemptionUsed: 0,
      tax: 0,
      netProceeds: salePrice,
    };
  }
  const rate = isLongTerm ? REAL_ESTATE_LTCG_RATE : REAL_ESTATE_STCG_RATE;
  const tax = round0(gain * rate);
  return {
    gain,
    isLongTerm,
    rate,
    exemptionUsed: 0,
    tax,
    netProceeds: salePrice - tax,
  };
}

/** HRA exemption u/s 10(13A) — minimum of three rules. */
export function calculateHraExemption(input: {
  basicSalary: number;
  hraReceived: number;
  rentPaid: number;
  isMetro: boolean;
}): {
  exemption: number;
  taxableHra: number;
  components: { rule: string; amount: number }[];
} {
  const { basicSalary, hraReceived, rentPaid, isMetro } = input;
  const pct = isMetro ? 0.5 : 0.4;
  const rule1 = hraReceived;
  const rule2 = Math.max(0, rentPaid - 0.1 * basicSalary);
  const rule3 = pct * basicSalary;
  const exemption = round0(Math.max(0, Math.min(rule1, rule2, rule3)));
  return {
    exemption,
    taxableHra: round0(Math.max(0, hraReceived - exemption)),
    components: [
      { rule: "Actual HRA received", amount: round0(rule1) },
      { rule: "Rent paid − 10% of basic", amount: round0(rule2) },
      {
        rule: isMetro ? "50% of basic (metro)" : "40% of basic (non-metro)",
        amount: round0(rule3),
      },
    ],
  };
}

export type TakeHomeInput = {
  monthlyGross: number;
  /** Employee EPF % of basic (default 12). */
  epfPct?: number;
  basicPctOfGross?: number;
  professionalTaxMonthly?: number;
  /** Annual tax estimate / 12 for TDS proxy. */
  annualTaxLiability?: number;
};

export function calculateTakeHomeSalary(input: TakeHomeInput): {
  monthlyGross: number;
  basic: number;
  epfEmployee: number;
  professionalTax: number;
  tds: number;
  netMonthly: number;
} {
  const {
    monthlyGross,
    epfPct = 12,
    basicPctOfGross = 50,
    professionalTaxMonthly = 200,
    annualTaxLiability = 0,
  } = input;
  const basic = round0(monthlyGross * (basicPctOfGross / 100));
  const epfEmployee = round0(basic * (epfPct / 100));
  const tds = round0(annualTaxLiability / 12);
  const netMonthly = round0(
    monthlyGross - epfEmployee - professionalTaxMonthly - tds
  );
  return {
    monthlyGross: round0(monthlyGross),
    basic,
    epfEmployee,
    professionalTax: professionalTaxMonthly,
    tds,
    netMonthly,
  };
}
