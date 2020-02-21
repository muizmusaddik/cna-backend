const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Children = new Schema({
  Gender: String,
  DateOfBirth: String,
  selected: Boolean
})

const Loan = new Schema({
  LoanType: String,
  OutstandingAmount: String,
  NumberOfYears: String,
  CoveredWithInsurance: Boolean
})

const Legacy = new Schema({
  enabled: Boolean,
  recommended: Boolean,
  customized: Boolean,
  customization_type: String,
  customization_percentage: Number,
  customization_amount: String,
  expected: String,
})

const Investment = new Schema({
  enabled: Boolean,
  recommended: Boolean,
  customized: Boolean,
  customization_type: String,
  customization_percentage: Number,
  customization_amount: String,
  expected_investment_amount: String,
  risk_appetite: Number,
})

const Medical = new Schema({
  enabled: Boolean,
  recommended: Boolean,
  customized: Boolean,
  customization_type: String,
  customization_percentage: Number,
  customization_amount: String,
  expected_insured_type: String,
  plan_type: String,
})

const Education = new Schema({
  enabled: Boolean,
  recommended: Boolean,
  customized: Boolean,
  customization_type: String,
  customization_percentage: Number,
  customization_amount: String,
  expected_education_coverage: Number,
  expected_child_covered: {},
})

const Saving = new Schema({
  enabled: Boolean,
  recommended: Boolean,
  customized: Boolean,
  customization_type: String,
  customization_percentage: Number,
  customization_amount: String,
  expected_saving_return_type: String,
  expected_saving_return_amount: String,
})

const Retirement = new Schema({
  enabled: Boolean,
  recommended: Boolean,
  customized: Boolean,
  customization_type: String,
  customization_percentage: Number,
  customization_amount: String,
  expected_gcp: String,
})

const Forms  = new Schema({
  Legacy: Legacy,
  Investment: Investment,
  Medical: Medical,
  Education: Education,
  Saving: Saving,
  Retirement: Retirement,
})

const Svg = new Schema({
  fill: String
})

const PieData = new Schema({
  title: String,
  value: Number,
  key: String,
  svg: [Svg]
})

const LegacySuggestion = new Schema({
  name: String,
  sum_insured: Number,
  total_annual_premium: Number,
  policy_term: Number,
  premium_term: Number,
  minimum_premium: Number,
  eligible: Boolean,
  max_age: Number,
  type: String,
})

const InvestmentSuggestion = new Schema({
  name: String,
  sum_insured: Number,
  total_annual_premium: Number,
  policy_term: Number,
  premium_term: Number,
  account_value: Number,
  minimum_premium: Number,
  max_age: Number,
  eligible: Boolean,
  type: String,
})

const MedicalSuggestion = new Schema({
  name: String,
  sum_covered: Number,
  total_annual_premium: Number,
  certificate_term: Number,
  contribution_term: Number,
  max_age: Number,
  minimum_premium: Number,
  eligible: Boolean,
  plan_type: String,
  overall_limit: Number,
  deductible: String,
  type: String,
})

const EducationSuggestion = new Schema({
  name: String,
  sum_insured: Number,
  policy_term: Number,
  premium_term: Number,
  total_annual_premium: Number,
  account_value: Number,
  minimum_premium: Number,
  eligible: Boolean,
  child_age: Number,
  max_age: Number,
  type: String,
})

const SavingSuggestion = new Schema({
  name: String,
  sum_insured: Number,
  total_annual_premium: Number,
  minimum_premium: Number,
  eligible: Boolean,
  max_age: Number,
  gcp: Number,
  policy_term: Number,
  premium_term: Number,
  account_value: Number,
  type: String,
})

const RetirementSuggestion = new Schema({
  name: String,
  sum_insured: Number,
  total_annual_premium: Number,
  policy_term: Number,
  premium_term: Number,
  max_age: Number,
  gcp: Number,
  maturity_value: Number,
  account_value: Number,
  minimum_premium: Number,
  eligible: Boolean,
  type: String
})

const Profile = new Schema({
  uuid: String,
  customerName: String,
  customerDateOfBirth: String,
  totalInvestmentAmount: String,
  totalDepositAmount: String,
  totalFixedDepositAmount: String,
  totalInsuranceCoverage: String,
  totalMedicalCoverage: String,
  totalCICoverage: String,
  creditCardOutstandingAmount: String,
  totalFamilyInvestmentAmount: String,
  epfAmount: String,
  nationality: String,
  monthlyIncome: String,
  monthlyExpenses: String,
  familyDateOfBirth: String,
  gender: String,
  maritalStatus: String,
  familyWorkingSpouse: String,
  familyMaybankCustomer: String,
  epfEmployerPct: String,
  epfEmployeePct: String,
  childrenCount: Number,
  children: [Children],
  loans: [Loan]
})

const Need = new Schema({
  recommended: [String],
  custom: [String],
  forms: Forms
})

const Projection = new Schema({
  balance_of_gap: Number,
  epf: Number,
  financing_assets: Number,
  insurance: Number,
  insurance_ci: Number,
  insurance_legacy: Number,
  insurance_medical: Number,
  investment: Number,
  liabilities: Number,
  loans: [Loan],
  savings: Number,
  fixed_deposit: Number,
  sum_assured: Number,
  total_investable_assets: Number,
  protection_gap: Number,
  pie_data: [PieData]
})

const Suggestion = new Schema({
  Legacy: LegacySuggestion,
  Investment: InvestmentSuggestion,
  Medical: MedicalSuggestion,
  Education: EducationSuggestion,
  Saving: SavingSuggestion,
  Retirement: RetirementSuggestion
})

const CustomerSchema = new Schema({
  profiles: Profile,
  needs: Need,
  projection: Projection,
  suggested: Suggestion,
  sharedFrom: String,
  sharedTo: String,
  sharedOn: Date,
  shared: Boolean,
})

const UserSchema = new Schema({
  socket_id: String,
  name: String
})

module.exports = {
  CustomerSchema,
  UserSchema
}