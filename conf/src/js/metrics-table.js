let md = window.markdownit();

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

// document.querySelector('html').classList.toggle('fullscreen');

const {neverland: Component, render, html, useState, useEffect} = window.neverland;

let columnSpecs = [
	{
		key: 'metric',
		label: 'Metric',
		minWidth: 200,
		sortable: true
	},
	{
		key: 'intuition',
		label: 'Intuition',
		minWidth: 300,
		sortable: true
	},
	{
		key: 'scope',
		label: 'Scope',
		minWidth: 140,
		type: 'data',
		filter: true,
		values: [
			'individual',
			'group',
			'population'
		],
		transform: value => {
			switch (value) {
				case "individual":
					return html`<i class="far fa-user"></i> individual`;
				case "group":
					return html`<i class="far fa-users"></i> sub-group`;
				case "population":
					return html`<i class="far fa-globe-asia"></i> population`;
				default:
					return '';
			}
		},
		filters: {},
		sortable: true
	},
	{
		key: 'modelType',
		label: 'Model Type',
		minWidth: 160,
		type: 'data',
		filter: true,
		values: [
			'graph',
			'space'
		],
		filters: {},
		transform: value => {
			switch (value) {
				case "graph":
					return html`<i class="far fa-chart-network"></i> graph`;
				case "space":
					return html`<i class="far fa-chart-scatter"></i> space`;
				case "groups":
					return html`<i class="far fa-diagram-venn"></i> groups`;
				case "categories":
					return html`<i class="far fa-chart-simple"></i> categorical`;
				default:
					return '';
			}
		},
		sortable: true
	},
	{
		key: 'requiredStructure',
		label: 'Structure Required',
		minWidth: 230,
		type: 'tags',
		filter: true,
		values: [
			'groups',
			'signed edges'
		],
		filters: {},
		transform: value => {
			if (value == undefined) {
				return '';
			} else {
				let strs = value.split(', ');
				return strs.map(s => html`<div>${s}</div>`);
			}
		},
		sortable: false
	},
	{
		key: 'safeToOptimize',
		label: 'Safe to Optimize?',
		minWidth: 210,
		filter: true,
		values: [
			'No',
			'Maybe'
		],
		filters: {},
		transform: value => {
			if (value == undefined) {
				return '';
			} else {
				switch (value) {
					case 'No':
						return html`<span class="safe no">${value}</span>`;
					case 'Maybe':
						return html`<span class="safe maybe">${value}</span>`;
					default:
						return value;
				}
			}
		},
		sortable: true
	},
	// {
	// 	key: 'concept',
	// 	label: 'Concept',
	// 	minWidth: 150,
	// 	filter: true,
	// 	values: [],
	// 	filters: {},
	//  sortable: true
	// },
	{
		key: 'formula',
		label: 'Formula',
		transform: value => {
			return html`<span>${value}</span>`;
		},
		sortable: false
	},
	// {
	// 	key: 'limitations',
	// 	label: 'Limitations',
	// 	minWidth: 400,
	// 	transform: value => {
	// 		if (typeof(value) == "string") {
	// 			return { html: md.render(value) };
	// 		} else {
	// 			return '';
	// 		}
	// 	}
	// },
		// sortable: false
	{
		key: 'references',
		label: 'References',
		// minWidth: 200,
		maxWidth: 400,
		transform: value => {
			if (typeof(value) == "string") {
				return { html: md.render(value) };
			} else {
				return '';
			}
		},
		sortable: false
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
				<td class="${c.type ? c.type : ''}" style="${c.maxWidth ? `max-width: ${c.maxWidth}px;` : ''}">
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
					if (c.type == "tags") {
						let tags = [];
						metrics.forEach(m => {
							tags = tags.concat((m[c.key] == undefined ? '' : m[c.key]).split(', '));
						})
						c.values = Array(...(new Set(tags))).filter(d => Boolean(d)).sort();
					} else {
						c.values = Array(...(new Set(metrics.map(m => m[c.key])))).filter(d => Boolean(d)).sort();
					}
					if (metrics.map(m => m[c.key]).filter(d => d == undefined).length > 0) {
						c.values = c.values.concat(['NONE']);
					}

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
					return html`<th style="${c.minWidth ? `min-width: ${c.minWidth}px;` : ''}${c.maxWidth ? `max-width: ${c.maxWidth}px;` : ''}">
						<div>
							<div class="label">${c.label}</div>
							<div class="actions">
								${c.sortable ? html`<button
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
									</button>` : ''}
								
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
						if (c.type == 'tags') {
							let tags = (m[c.key] == undefined ? 'NONE' : m[c.key]).split(', '),
								hasTag = false;
							tags.forEach(t => {
								hasTag = hasTag | c.filters[t];
							})
							included = included & hasTag;
						} else {
							included = included & c.filters[m[c.key] == undefined ? 'NONE' : m[c.key]];
						}
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