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
