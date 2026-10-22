# BICS expansion: audited draft and national costing reconciliation

Version BICS_AUDITED_REFERENCE_20261022. Evidence cut-off: 22 October 2026. Status: published model estimates with documented limitations. The external benchmark remains unreconciled and industry support allocations remain modelled.

## What is being costed

Additional annual electricity bill relief from extending eligibility to all manufacturing or the quantified production activities, with no minimum consumption threshold in the expansion, £40/MWh and automatic 100% uptake. CURRENT now represents actual-policy eligibility using the published 2027/28 national forecast, rather than assuming entire listed industries already receive relief. Product/site restrictions remain represented in that baseline forecast. No site-consumption distribution is fitted or assumed.

These amounts are direct additional bill relief at the chosen £40 policy rate. They are not a net Exchequer funding requirement after system funding changes or future tax receipts. The first-year additional lump-sum payment and half-year introduction of Capacity Market relief are excluded: the calculation is a full-year equivalent.

## National manufacturing ledger

| Step | Electricity | Annual £40-equivalent |
| --- | ---: | ---: |
| Quantified manufacturing grid consumption, including known nuclear baseline only | 62.081803 TWh | £2,483.272m |
| Already receiving equivalent EII exemptions | 12.796831 TWh | −£511.873m |
| Existing BICS baseline | 14.409974 TWh | −£576.399m |
| Additional quantified manufacturing relief | 34.874998 TWh | £1,395.000m |

The subtraction is of electricity already exempt from the same charges. The EII line is not total Supercharger spending; its package contains other support. The BICS line is £40 times allocated forecast exempt electricity, not an observed manufacturing spending total.

## Sources and the corrections

DESNZ's [25 September 2026 RO calculation](https://www.gov.uk/government/publications/renewables-obligation-level-calculations-2027-to-2028/calculating-the-level-of-the-renewables-obligation-for-2027-to-2028) reports 15.7 TWh BICS-exempt consumption and 13.6 TWh EII-exempt consumption for 2027/28. EII outturn for 2025/26 was 12.7 TWh. These are separate exemptions. At the exercise's fixed £40 rate, the full BICS control is £628m, consistent in scale with the government's approximately £600m scheme announcement; £40 is not the exact forecast tariff for each levy/year.

The previous £703.675m manufacturing baseline was a model assumption: all grid electricity left in listed industries after overlap was treated as already covered. It was not government expenditure. It excluded expansion benefits within those industries. That assumption has been replaced.

The previous electricity allocation also combined rigid ECUK modelled SIC2 shares with incompatible DBT eligible consumption estimates. For example, all pharmaceuticals were allocated 0.492 TWh although DBT's lower eligible-consumption estimate alone was 1.230 TWh. Aircraft had the same contradiction. Published support must not be clipped away to fit those smaller modelled quantities.

We retain DESNZ DUKES 2026 Table 5.2 broad public-distribution electricity controls for 2025. ONS APS 2024 aggregate electricity expenditure supplies broad industry shares, and ABS 2017–2023 median purchases supply class shares. Within each broad control, class allocations are raised where necessary to accommodate published baseline consumption, while the rest of the group is reduced proportionately so the total is conserved. This is a transparent reconciliation of proxies, not a new observation of factory consumption.

The [September 2026 final impact assessment](https://www.legislation.gov.uk/ukia/2026/149/pdfs/ukia_20260149_en.pdf), Annex A, provides the current methodological basis and confirms grid-only consumption and removal of overlapping EII support. APS 2021/22 mean business electricity/purchases ratios are not used as aggregate electricity expenditure: a mean of ratios is not a ratio of totals.

## Allocating the known current-support total

DBT July 2026 sector bounds sum to 6.5015–20.5983 TWh. The later national forecast is 15.7 TWh. For the reference, each class is placed at the same fraction within its published interval:

`class current MWh = class lower + fraction × (class upper − class lower)`

`fraction = (15,700,000 − sum of lower MWh) / sum of interval widths = 0.652523977`

This fraction is derived from the published national total; it is not a probability, an empirical class estimate or a freely chosen sensitivity parameter. The distribution between industries remains a modelling assumption. Support retains all listed non-manufacturing activities, including gas manufacture and eligible waste activities.

For group grid consumption, solve `grid_i = max(current_i, k × APS/ABS weight_i)` with k chosen to match the group's electricity total. Then allocate the 13.6 TWh EII control proportionally across eligible classes, capped at `grid_i − current_i`, redistributing capped allocations until the national total is represented. This preserves both support controls, never deducts the same MWh twice and never creates negative new consumption. A binding baseline floor can produce a zero modelled increment; it is not evidence that every business in that class already receives support.

## Match the reference period

Electricity is projected from observed calendar 2025 to FY2027/28 using sector-specific reference electricity trends in [DESNZ EEP 2024–2050 Annex F](https://assets.publishing.service.gov.uk/media/6981d642e8900d4c455f374a/Annex_F_final_energy_demand_TWh.ods), published February 2026. Financial-year demand is approximated as 75% of calendar 2027 plus 25% of calendar 2028, divided by the corresponding calendar 2025 forecast. Multipliers are 1.822702119 for iron/steel, 0.994229335 for other industry and 1.008816189 for commercial services. Applying total-electricity trends to grid electricity assumes a fixed grid share. Operational refinery/coal budgets are held at observed 2025 levels, since these forecasts do not identify a matching operational series. Whole-economy electricity growth is not used as manufacturing growth.

## Coverage and uncertainty

A separate 2023–2025 mean-consumption comparison is provided in consumption_comparison.md and the labelled national, industry and constituency CSVs. It uses the same DUKES 2026 revision, grid coverage, GB fraction, FY2027/28 projection multipliers and support totals. The latest-year central estimate and its local allocation ranges are unchanged. The average is an alternative recent consumption baseline, not recovered demand or a confidence interval. Each local method is compared with itself across the two bases.

Manufacturing and production amounts remain quantified subtotals. Nuclear fuel processing and gas manufacture retain their known current baseline, but their additional electricity cannot be split reliably from the combined Other Fuel Industries control. The unallocated control is 0.583042 TWh. Even assigning all of it to additional nuclear manufacturing electricity would add no more than £23.322m within that retained control; this is a coverage ceiling, not a forecast or confidence interval. Other utilities and GB/onshore extraction increments remain unestimated. No invented 20%, 70% or 60/40 shares are used.

Water, waste and repair electricity uses an expenditure share of the broader commercial control, reconciled jointly to known support floors. Its industry coverage and price differences are proxies. The commercial denominator includes transport businesses whose traction electricity is separately classified, and is not a direct observation of water/waste meters. The UK-to-GB adjustment uses the uniform published 2025 public-supply consumption fraction, not industry-specific GB consumption.

Local ranges compare employment, regional GVA and regional purchases allocations of the same national industry reference. BRES 2024 workplace employees locate industry activity; ABS 2024 regional output/purchases per worker modify employment weights, then weights are normalised separately within each class. These ranges do not include all uncertainty in national disaggregation, baseline shares, forecasts or individual sites and are not confidence intervals. Additional national allocation methods and projection alternatives are separate audit comparisons; agreement is not validation.

## Make UK comparison

Make UK's May 2026 Delivering the British Industrial Competitiveness Scheme reports £3.3bn annual expanded-scheme cost and £40/MWh, but does not supply the consumption/cost bridge or an explicit deduction of the current scheme. 82.5 TWh is only the implied arithmetic (£3.3bn / £40); it is not a published consumption dataset. Their June 2025 paper reports £750m per £10/MWh, implying a different 75 TWh. Neither number has been used to rescale this model.

Our like-for-like starting point is £2.483272bn before either existing-support deduction, not the £1.395000bn increment. The remaining difference to £3.3bn is £816.728m before deductions. The reports do not establish precisely how much is due to territorial coverage, consumption vintage, own generation or scheme overlap. Do not assert a complete reconciliation without the underlying Make UK/Flint calculation.

Make UK's forecast additional tax receipts are a separate macroeconomic claim and are not deducted from direct bill savings here.

## Contemporary official-data cross-check

DUKES2025 reported 82.2TWh of UK industrial electricity in 2024. The historical total preserved in February2026 EEP AnnexF is 82.20203263616051TWh, giving GBP3.288081305bn at GBP40/MWh, which rounds to GBP3.3bn. This is numerically compatible with Make UK's headline, not proof that it used that total. It includes other generation and broader industrial activities, rather than GB manufacturing grid consumption after existing relief.

DUKES2026 revised 2024 industrial consumption to78.2727597TWh. The 30June2026 sector-definition paper confirms SIC33 and36–39 moved from industry tocommercial; supplier revisions also apply, so the whole3.929TWh difference must not be attributed to reclassification. The current model retains repair and water/waste through separate commercial-control allocations.

References: https://assets.publishing.service.gov.uk/media/68dbe477ef1c2f72bc1e4c4d/DUKES_2025_Chapters_1-7.pdf and https://assets.publishing.service.gov.uk/media/6a3e9eb733bc5beefd3c4bd9/Methodology_changes_sector_definitons_DUKES_2026.pdf.

## Verification

48/48 financial checks pass. Conservation, non-negativity, support bounds and software functionality are checked. These tests cannot establish empirical accuracy of individual factory or constituency bills. The draft must not be described as 100% accurate or fully reconciled with Make UK.


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

We average broad controls, not unavailable detailed annual factory readings. Keep APS 2024/ABS class weights fixed, then repeat the existing class reconciliation to the unchanged BICS floors. For repair, water and waste, keep the APS 2024 share of the commercial parent fixed and change its parent grid total to the three-year average. The tiny metal-ore expenditure proxy has no matching annual grid series and is held fixed. Known-current-only nuclear/gas allocations and all coverage gaps are unchanged. No own generation or unmeasured utility/offshore consumption is added.

Keep BICS at 15.7 TWh with the same class split, and EII at 13.6 TWh in both bases. Reallocate EII using the same capped-proportional rule against each base's industry electricity. Thus EII's manufacturing share can change slightly, although national EII support stays fixed. Additional industry relief = (grid MWh - current BICS MWh - equivalent EII MWh) x GBP 40. Uptake is 100%; expansion has no 33 MWh threshold.

## Interaction with local allocations

Apply exactly the same saved employment, GVA-adjusted and purchases-adjusted geographical matrices to each base's industry relief. Local changes therefore reflect the industries present in that constituency and how their consumption changed; they are not a uniform national percentage applied to every seat. Each base's local range is its own minimum and maximum across the three methods. The change range is the minimum and maximum of mean-minus-latest within each method, never the difference between unmatched endpoints. Every method's 632 seat estimates sum to its own national total. Neither local range is a confidence interval. The map, industry breakdown and main headlines retain the latest-year central base; the comparison tables and labelled downloads show the alternative separately.

## Interpretation

Averaging reduces dependence on a single recent year. It does not estimate how much consumption would return if energy prices fell: all three years may reflect high prices, closures, efficiency improvements and changing industrial output. It also does not resolve Make UK's unpublished consumption and support bridge. Do not combine the two consumption bases into a national uncertainty interval or describe the average as recovered demand.

Source: [DESNZ DUKES electricity tables](https://www.gov.uk/government/statistics/electricity-chapter-5-digest-of-united-kingdom-energy-statistics-dukes), 30 July 2026. Published FY2027/28 support controls and EEP projection assumptions remain those documented in the central technical methodology.
