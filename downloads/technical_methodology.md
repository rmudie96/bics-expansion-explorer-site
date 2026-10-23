# BICS Expansion Explorer: technical methodology

Version BICS_AUDITED_REFERENCE_20261022. Evidence cut-off: 22 October 2026. Status: published model estimates with documented limitations. Industry support allocations are modelled estimates.

## What is being costed

Additional annual electricity bill relief from extending eligibility to all manufacturing or the quantified production activities, with no minimum consumption threshold in the expansion, £40/MWh and automatic 100% uptake. The without-expansion baseline (CURRENT in data downloads) represents current eligibility using the published 2027/28 national forecast. Product/site restrictions remain represented in that baseline forecast. No site-consumption distribution is fitted or assumed.

These amounts are direct additional bill relief at the chosen £40 policy rate. They are not a net Exchequer funding requirement after system funding changes or future tax receipts. The first-year additional lump-sum payment and half-year introduction of Capacity Market relief are excluded: the calculation is a full-year equivalent.

## National manufacturing ledger

| Step | Electricity | Annual £40-equivalent |
| --- | ---: | ---: |
| Quantified manufacturing grid consumption, including known nuclear baseline only | 62.081803 TWh | £2,483.272m |
| Already receiving equivalent EII exemptions | 12.796831 TWh | −£511.873m |
| Existing BICS baseline | 14.409974 TWh | −£576.399m |
| Additional quantified manufacturing relief | 34.874998 TWh | £1,395.000m |

The subtraction is of electricity already exempt from the same charges. The EII line is not total Supercharger spending; its package contains other support. The BICS line is £40 times allocated forecast exempt electricity, not an observed manufacturing spending total.

## Electricity and existing-support data

DESNZ's [25 September 2026 RO calculation](https://www.gov.uk/government/publications/renewables-obligation-level-calculations-2027-to-2028/calculating-the-level-of-the-renewables-obligation-for-2027-to-2028) reports 15.7 TWh BICS-exempt consumption and 13.6 TWh EII-exempt consumption for 2027/28. EII outturn for 2025/26 was 12.7 TWh. These are separate exemptions. At the exercise's fixed £40 rate, the full BICS control is £628m, consistent in scale with the government's approximately £600m scheme announcement; £40 is not the exact forecast tariff for each levy/year.

The model uses DESNZ DUKES 2026 Table 5.2 broad public-distribution electricity controls for 2025. ONS APS 2024 aggregate electricity expenditure supplies broad industry shares, and ABS 2017–2023 median purchases supply class shares. Within each broad control, class allocations are raised where necessary to accommodate published baseline consumption, while the rest of the group is reduced proportionately so the total is conserved. These detailed industry estimates are based on expenditure proxies, rather than direct observations of factory consumption.

The [September 2026 final impact assessment](https://www.legislation.gov.uk/ukia/2026/149/pdfs/ukia_20260149_en.pdf), Annex A, provides the current methodological basis and confirms grid-only consumption and removal of overlapping EII support.

## Allocating the known current-support total

DBT July 2026 sector bounds sum to 6.5015–20.5983 TWh. The September 2026 national forecast is 15.7 TWh. For the reference, each class is placed at the same fraction within its published interval:

`class current MWh = class lower + fraction × (class upper − class lower)`

`fraction = (15,700,000 − sum of lower MWh) / sum of interval widths = 0.652523977`

This fraction is derived from the published national total; it is not a probability, an empirical class estimate or a measure of uncertainty. The distribution between industries remains a modelling assumption. Support retains all listed non-manufacturing activities, including gas manufacture and eligible waste activities.

For group grid consumption, solve `grid_i = max(current_i, k × APS/ABS weight_i)` with k chosen to match the group's electricity total. Then allocate the 13.6 TWh EII control proportionally across eligible classes, capped at `grid_i − current_i`, redistributing capped allocations until the national total is represented. This preserves both support controls, never deducts the same MWh twice and never creates negative new consumption. A binding baseline floor can produce a zero modelled increment; it is not evidence that every business in that class already receives support.

## Match the reference period

Electricity is projected from observed calendar 2025 to FY2027/28 using sector-specific reference electricity trends in [DESNZ EEP 2024–2050 Annex F](https://assets.publishing.service.gov.uk/media/6981d642e8900d4c455f374a/Annex_F_final_energy_demand_TWh.ods), published February 2026. Financial-year demand is approximated as 75% of calendar 2027 plus 25% of calendar 2028, divided by the corresponding calendar 2025 forecast. Multipliers are 1.822702119 for iron/steel, 0.994229335 for other industry and 1.008816189 for commercial services. Applying total-electricity trends to grid electricity assumes a fixed grid share. Operational refinery/coal budgets are held at observed 2025 levels, since these forecasts do not identify a matching operational series. Whole-economy electricity growth is not used as manufacturing growth.

## Reading without and with expansion

The explorer compares current BICS relief (without expansion) with the combined current and expanded relief (with expansion). Current eligibility uses the published 2027/28 forecast of 15.7 TWh, valued at the exercise rate of GBP40/MWh: GBP628m nationally. It is a modelled allocation of forecast qualifying electricity, not observed payments. The published current-policy forecast retains its product and minimum-consumption restrictions; the expansion has no minimum threshold. No new site distribution or threshold parameter is used.

Within each geographical method, with-expansion relief equals current BICS plus the selected manufacturing or production increment. It retains existing eligible non-manufacturing activities. Equivalent EII relief is already excluded from the increment and is not subtracted again. Combined constituency ranges are the minimum and maximum of the three paired totals, not the sum of separately calculated range endpoints. The labelled without_with_expansion.csv export contains both expansions, all 632 seats and all three allocation methods. Map measures change shading, ranking, tooltips and national total. Constituency cards show both policy totals. The range-construction box and its recent-consumption comparison use manufacturing expansion as the worked example; industry breakdowns show the increase from the selected expansion.

## Coverage and uncertainty

A separate 2023–2025 mean-consumption comparison is provided in consumption_comparison.md and the labelled national, industry and constituency CSVs. It uses the same DUKES 2026 revision, grid coverage, GB fraction, FY2027/28 projection multipliers and support totals. The main estimates use the latest-year consumption base. The average is an alternative recent consumption baseline, not recovered demand or a confidence interval. Each local method is compared with itself across the two bases.

Manufacturing and production amounts remain quantified subtotals. Nuclear fuel processing and gas manufacture retain their known current baseline, but their additional electricity cannot be split reliably from the combined Other Fuel Industries control. The unallocated control is 0.583042 TWh. Even assigning all of it to additional nuclear manufacturing electricity would add no more than £23.322m within that retained control; this is a coverage ceiling, not a forecast or confidence interval. Other utilities and GB/onshore extraction increments remain unestimated.

Water, waste and repair electricity uses an expenditure share of the broader commercial control, reconciled jointly to known support floors. Its industry coverage and price differences are proxies. The commercial denominator includes transport businesses whose traction electricity is separately classified, and is not a direct observation of water/waste meters. The UK-to-GB adjustment uses the uniform published 2025 public-supply consumption fraction, not industry-specific GB consumption.

Local ranges compare employment, regional GVA and regional purchases allocations of the same national industry reference. BRES 2024 workplace employees locate industry activity; ABS 2024 regional output/purchases per worker modify employment weights, then weights are normalised separately within each class. These ranges do not include all uncertainty in national disaggregation, baseline shares, forecasts or individual sites and are not confidence intervals. Additional national allocation methods and projection alternatives are separate audit comparisons; agreement is not validation.

## Make UK comparison

Make UK's May 2026 report, Delivering the British Industrial Competitiveness Scheme, reports a £3.3bn annual cost for an expanded scheme and proposes £40/MWh relief. Its published headline does not identify the detailed electricity quantities or deductions for existing support behind that total. It cannot be compared directly with the additional savings above current support calculated here.

This model's manufacturing calculation starts with approximately £2.48bn before existing-support deductions. Its geographical scope, grid-electricity coverage and reference periods are set out above. The published Make UK costing does not provide enough information to quantify each source of difference. Make UK's forecast additional tax receipts are a separate macroeconomic estimate and are not deducted from direct bill savings here.

## Verification

48/48 financial checks pass. Conservation, non-negativity, support bounds and software functionality are checked. These tests cannot establish empirical accuracy of individual factory or constituency bills. The estimates remain subject to the data, allocation and coverage limitations described above.


# Recent-consumption baseline comparison

Model BICS_AUDITED_REFERENCE_20261022. Model estimates with documented limitations, 22 October 2026.

| Expansion | Latest 2025 base | 2023-2025 mean base | Change |
| --- | ---: | ---: | ---: |
| CURRENT | GBP 628.000m | GBP 628.000m | GBP +0.000m (+0.00%) |
| C_ALL | GBP 1,395.000m | GBP 1,456.903m | GBP +61.903m (+4.44%) |
| BE_ALL | GBP 1,548.574m | GBP 1,614.437m | GBP +65.863m (+4.25%) |
| BE_EXTRA | GBP 153.574m | GBP 157.534m | GBP +3.960m (+2.58%) |

## Reproducible calculation

Use the public-distribution columns of DESNZ DUKES 2026 Table 5.2, sheet 5.2: Excel columns BY (2023), CB (2024), CE (2025). These are the same revised industry definitions and data vintage. Each control's alternative base is (2023 GWh + 2024 GWh + 2025 GWh) / 3. Convert GWh to MWh by multiplying by 1,000, then apply the same 2025 GB fraction (0.974120504369) and the same 2025-to-FY2027/28 growth factor as the central model. The average is an alternative consumption level; historical years are not separately projected to 2027/28 before averaging.

The growth factors remain 1.822702118848 for iron/steel, 0.994229335053 for other industry, 1.008816188969 for commercial activity, and 1 for refinery and coal operational electricity. All raw control observations and factors are in consumption_comparison_controls.csv. The original source hash is 2da4938c1aef7074637ca535079f289fbc9e9b93bffb611030c4397f7ddd2095.

The model averages broad industry totals while keeping APS 2024/ABS detailed-industry weights fixed. The resulting estimates are constrained to accommodate the same allocated current BICS consumption. For repair, water and waste, the APS 2024 share of the broader commercial total is held fixed and the three-year average replaces the parent electricity total. The metal-ore expenditure proxy has no matching annual grid series and is held fixed. Known-current-only nuclear/gas allocations and all coverage gaps are unchanged. No own generation or unmeasured utility/offshore consumption is added.

BICS remains at 15.7 TWh with the same detailed-industry split, and EII remains at 13.6 TWh in both bases. EII is allocated using the same capped-proportional rule against each base’s industry electricity. Thus EII's manufacturing share can change slightly, although national EII support stays fixed. Additional industry relief = (grid MWh - current BICS MWh - equivalent EII MWh) x GBP 40. Uptake is 100%; expansion has no 33 MWh threshold.

## Interaction with local allocations

The same employment, GVA-adjusted and purchases-adjusted geographical weights are applied to each base’s industry relief. Local changes therefore reflect the industries present in that constituency and how their consumption changed; they are not a uniform national percentage applied to every seat. Each base's local range is its own minimum and maximum across the three methods. The change range is the minimum and maximum of mean-minus-latest within each method, never the difference between unmatched endpoints. Every method's 632 seat estimates sum to its own national total. Neither local range is a confidence interval. The map, industry breakdown and main headlines retain the latest-year central base; the comparison tables and labelled downloads show the alternative separately.

## Interpretation

Averaging reduces dependence on a single recent year. It does not estimate how much consumption would return if energy prices fell: all three years may reflect high prices, closures, efficiency improvements and changing industrial output. The two consumption bases are alternative assumptions, rather than the endpoints of a national uncertainty interval or estimates of demand recovery.

Source: [DESNZ DUKES electricity tables](https://www.gov.uk/government/statistics/electricity-chapter-5-digest-of-united-kingdom-energy-statistics-dukes), 30 July 2026. Published FY2027/28 support controls and EEP projection assumptions remain those documented in the central technical methodology.
