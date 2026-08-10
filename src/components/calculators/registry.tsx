import type { ComponentType } from "react";
import { StepUpSipCalculator } from "@/components/calculators/StepUpSipCalculator";
import { AdvancedPrepaymentCalculator } from "@/components/calculators/AdvancedPrepaymentCalculator";
import { SipCalculator } from "@/components/calculators/investment/SipCalculator";
import { LumpSumCalculator } from "@/components/calculators/investment/LumpSumCalculator";
import { SwpCalculator } from "@/components/calculators/investment/SwpCalculator";
import { XirrCalculator } from "@/components/calculators/investment/XirrCalculator";
import { EmiCalculator } from "@/components/calculators/debt/EmiCalculator";
import { TenureVsEmiCalculator } from "@/components/calculators/debt/TenureVsEmiCalculator";
import { RefinanceCalculator } from "@/components/calculators/debt/RefinanceCalculator";
import { FlatVsReducingCalculator } from "@/components/calculators/debt/FlatVsReducingCalculator";
import { RentVsBuyCalculator } from "@/components/calculators/debt/RentVsBuyCalculator";
import { FireCalculator } from "@/components/calculators/retirement/FireCalculator";
import { ReverseSipCalculator } from "@/components/calculators/retirement/ReverseSipCalculator";
import { ChildEducationCalculator } from "@/components/calculators/retirement/ChildEducationCalculator";
import { IncomeTaxCalculator } from "@/components/calculators/taxation/IncomeTaxCalculator";
import { CapitalGainsCalculator } from "@/components/calculators/taxation/CapitalGainsCalculator";
import { HraCalculator } from "@/components/calculators/taxation/HraCalculator";
import { TakeHomeCalculator } from "@/components/calculators/taxation/TakeHomeCalculator";
import { PpfCalculator } from "@/components/calculators/government/PpfCalculator";
import { NpsCalculator } from "@/components/calculators/government/NpsCalculator";
import { EpfCalculator } from "@/components/calculators/government/EpfCalculator";
import { SsyCalculator } from "@/components/calculators/government/SsyCalculator";
import { PostOfficeCalculator } from "@/components/calculators/government/PostOfficeCalculator";
import { FdRdCalculator } from "@/components/calculators/government/FdRdCalculator";

/** Maps `category/slug` → live calculator component. */
export const CALCULATOR_REGISTRY: Record<string, ComponentType> = {
  "investment/sip": SipCalculator,
  "investment/step-up-sip": StepUpSipCalculator,
  "investment/lump-sum": LumpSumCalculator,
  "investment/swp": SwpCalculator,
  "investment/xirr": XirrCalculator,
  "debt/emi": EmiCalculator,
  "debt/advanced-prepayment": AdvancedPrepaymentCalculator,
  "debt/tenure-vs-emi": TenureVsEmiCalculator,
  "debt/refinance": RefinanceCalculator,
  "debt/flat-vs-reducing": FlatVsReducingCalculator,
  "debt/rent-vs-buy": RentVsBuyCalculator,
  "retirement/fire": FireCalculator,
  "retirement/reverse-sip": ReverseSipCalculator,
  "retirement/child-education": ChildEducationCalculator,
  "taxation/income-tax": IncomeTaxCalculator,
  "taxation/capital-gains": CapitalGainsCalculator,
  "taxation/hra-exemption": HraCalculator,
  "taxation/take-home-salary": TakeHomeCalculator,
  "government/ppf": PpfCalculator,
  "government/nps": NpsCalculator,
  "government/epf": EpfCalculator,
  "government/ssy": SsyCalculator,
  "government/post-office": PostOfficeCalculator,
  "government/fd-rd": FdRdCalculator,
};
