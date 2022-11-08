---
permalink: false
templateEngineOverride: njk
tags: post
title: Metrics
slug: metrics
menuTitle: Metrics
position: 3
---

This page contains a comprehensive review of metrics that have been proposed to quantify the degree of division or "polarization" in the public sphere.

- The metrics are designed to summarize an abstract model of the public sphere, which we assume is either a graph (e.g. a network of Twitter followers) or a set of points in Euclidean space (e.g. user embeddings on a social media platform).
- Graph-based models can be converted into space-based models using graph embeddings. Space-based models can be converted into graph-based models using techniques from topological data analysis.
- The semantics and provenance of the underlying model matter just as much as the metrics that are applied "on top".
- Not yet making any strong claims about which are most valid. Many of these should not be used for optimization.

# Table of Metrics

<div class="outer-wrap" id="table-of-metrics">
	<button onclick="document.querySelector('html').classList.toggle('fullscreen')">
		<span class="expand"><i class="fas fa-expand-wide"></i>&ensp;View Fullscreen</span>
		<span class="compress"><i class="fas fa-compress-wide"></i>&ensp;Exit</span>
	</button>
	<div class="inner-wrap"></div>
</div>

# Notation

# Future Work

<script>

	document.onkeydown = function(evt) {
		evt = evt || window.event;
		let isEscape = false;
		if ("key" in evt) {
			isEscape = (evt.key === "Escape" || evt.key === "Esc");
		}
		if (isEscape) {
			document.querySelector('html').classList.toggle('fullscreen');
		}
	};

	const {neverland: Component, render, html, useState, useEffect} = window.neverland;

	let columnSpecs = [
		{
			key: 'metric',
			label: 'Metric',
			minWidth: 200
		},
		{
			key: 'concept',
			label: 'Concept',
			minWidth: 200,
			filter: true,
			values: [],
			filters: {}
		},
		{
			key: 'modelType',
			label: 'Model Type',
			minWidth: 250,
			type: 'data',
			filter: true,
			values: [
				'graph',
				'space'
			],
			filters: {},
			transform: value => {
				return value == "graph"
						? html`<i class="fal fa-chart-network"></i> GRAPH`
						: (value == "space" 
							? html`<i class="fal fa-chart-scatter"></i> SPACE`
							: value
				  		  )
			}
		},
		{
			key: 'scope',
			label: 'Scope',
			minWidth: 200,
			type: 'data',
			filter: true,
			values: [
				'individual',
				'group',
				'population'
			],
			filters: {},
		},
		{
			key: 'needsGroups',
			label: 'Needs Groups',
			minWidth: 250,
			filter: true,
			values: [],
			filters: {},
			transform: value => {
				return value == 'Yes'
					? html`<i class="fas fa-check"></i>`
					: html`<i class="fas fa-times"></i>`
			}
		},
		{
			key: 'intuition',
			label: 'Intuition',
			minWidth: 400
		},
		{
			key: 'formula',
			label: 'Formula',
			transform: value => {
				return html`<span>${value}</span>`;
			}
		},
		{
			key: 'limitations',
			label: 'Limitations',
			minWidth: 600
		},
		
	]

	const Row = Component(function(m, columns, setColumns) {

		return html.for(m)`<tr onclick="${() => {
			setColumns(prevColumns => {
				let columns = [...prevColumns];
				columns.forEach(c => {
					c.showFilters = false;
				})
				return columns;
			})
		}}">

			${columns.map((c, idx) => {
				return html`
					<td class="${c.type ? c.type : ''}">
						${c.transform
							? c.transform(m[c.key])
							: m[c.key]
						}
					</td>
				`;
			})}
			
		</tr>`;

	})

	const Table = Component(function() {

		let [metrics, setMetrics] = useState([]);
		let [sort, setSort] = useState({
			key: false,
			direction: -1
		});

		useEffect(() => {

			fetch('/data/metrics.json')
				.then(response => response.json())
				.then(data => {
					setMetrics(data);
				})

		}, []);

		let [columns, setColumns] = useState(columnSpecs);

		useEffect(() => {

			setColumns(prevColumns => {
				let columns = [...prevColumns];
				columns = columns.map(c => {
					if (c.filter) {
						c.values = Array(...(new Set(metrics.map(m => m[c.key])))).filter(d => Boolean(d)).sort();
						c.filters = {};
						for (let v of c.values) {
							c.filters[v] = true;
						}
					}
					return c;
				})
				return columns;
			})

		}, [JSON.stringify(metrics)])

		useEffect(() => {
			if (MathJax.typeset) {
				MathJax.typeset();
			}
		}, [JSON.stringify(columns), sort.key, sort.direction])

		return html`<table class="metrics-table">

			<thead>
				<tr>
					${columns.map(c => {
						return html`<th style="${c.minWidth ? `min-width: ${c.minWidth}px;` : ''}">
							<div>
								<div class="label">${c.label}</div>
								<div class="actions">
									<button
										onclick="${() => {
											setSort(prevSort => {
												let sort = {...prevSort};
												sort.direction = (sort.key == c.key) ? -1*sort.direction : 1;
												sort.key = c.key;
												return sort;
											})
										}}"
										class="${sort.key == c.key ? 'active' : ''}"
										>
											${sort.key != c.key
												? html`<i class="fas fa-sort"></i>`
												: (sort.direction == 1
													? html`<i class="fad fa-sort-up"></i>`
													: html`<i class="fad fa-sort-down"></i>`)}
										</button>
									
									${c.filter
										? html`<button
											onclick="${() => {
												setColumns(prevColumns => {
													let columns = [...prevColumns];
													columns = columns.map(d => {
														if (d.key == c.key) {
															d.showFilters = !Boolean(d.showFilters);
														}
														return d;
													})
													return columns;
												})
											}}"
											class="${(c.showFilters | Object.values(c.filters).filter(d => !d).length > 0) ? 'active' : ''}"
											><i class="fas fa-filter"></i></button>` : ''}
									
									${c.filter ? html`<div class="filters ${c.showFilters ? '' : 'hide'}">
										${c.values.map(d => html`<div>
											<input
												type="checkbox"
												id="${c.key}-${d}"
												name="${c.key}-${d}"
												checked="${c.filters[d]}"
												onchange="${() => {
													setColumns(prevColumns => {
														let columns = [...prevColumns];
														columns = columns.map(col => {
															if (col.key == c.key) {
																col.filters[d] = !col.filters[d];
															}
															return col;
														})
														return columns;
													})
												}}">
											<label for="${c.key}-${d}">${d}</label>
										</div>`)}
									</div>` : ''}
								
								</div>
							</div>
						</th>`;
					})}
				</tr>
			</thead>

			<tbody>

				${JSON.parse(JSON.stringify(metrics))
					.filter(m => {
						let included = true;
						columns.filter(c => c.filter).forEach(c => {
							included = included & c.filters[m[c.key]];
						})
						return included;
					})
					.sort((a, b) => {
						if (sort.key) {
							return sort.direction * ( 2*Number(a[sort.key] > b[sort.key]) - 1 );
						} else {
							return 1;
						}
					})
					.map(m => Row(m, columns, setColumns))}

			</tbody>

		</table>`;

	});

	render(document.querySelector('.inner-wrap'), Table());

</script>