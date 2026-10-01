window.chartDataPromise.then(({ areSpotPrices }) => {
	const container = d3.select("#line-chart");
	const data = areSpotPrices;
	const width = 640;
	const height = 270;
	const margin = { top: 18, right: 164, bottom: 38, left: 54 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;
	const series = Object.keys(data[0])
		.filter(key => key !== "Year")
		.map((key, index) => ({
			key,
			label: key === "Average Price (notTas-Snowy)"
				? "Average"
				: key.replace(" ($ per megawatt hour)", ""),
			color: d3.schemeTableau10[index]
		}));
	const values = data.flatMap(row => series
		.map(item => row[item.key])
		.filter(Number.isFinite));
	const x = d3.scaleLinear()
		.domain(d3.extent(data, row => row.Year))
		.range([0, innerWidth]);
	const y = d3.scaleLinear()
		.domain(d3.extent(values))
		.nice()
		.range([innerHeight, 0]);

	const svg = container.append("svg")
		.attr("class", "line-chart-svg")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Electricity spot prices by Australian region from 1998 onward");
	const chart = svg.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	chart.append("g")
		.attr("class", "chart-axis")
		.call(d3.axisLeft(y).ticks(5));

	chart.append("g")
		.attr("class", "chart-axis")
		.attr("transform", `translate(0,${innerHeight})`)
		.call(d3.axisBottom(x).ticks(6).tickFormat(d3.format("d")));

	const line = item => d3.line()
		.defined(row => Number.isFinite(row[item.key]))
		.x(row => x(row.Year))
		.y(row => y(row[item.key]));

	chart.selectAll(".price-line")
		.data(series)
		.join("path")
		.attr("class", "price-line")
		.attr("d", item => line(item)(data))
		.attr("fill", "none")
		.attr("stroke", item => item.color)
		.attr("stroke-width", 2);

	const legend = svg.append("g")
		.attr("class", "line-chart-legend")
		.attr("transform", `translate(${width - margin.right + 16},${margin.top + 6})`);
	const legendItem = legend.selectAll(".line-legend-item")
		.data(series)
		.join("g")
		.attr("class", "line-legend-item")
		.attr("transform", (item, index) => `translate(0,${index * 25})`);

	legendItem.append("line")
		.attr("x1", 0)
		.attr("x2", 18)
		.attr("y1", 5)
		.attr("y2", 5)
		.attr("stroke", item => item.color)
		.attr("stroke-width", 2.5);

	legendItem.append("text")
		.attr("x", 25)
		.attr("y", 9)
		.text(item => item.label);

	chart.append("text")
		.attr("class", "chart-axis-label")
		.attr("transform", "rotate(-90)")
		.attr("x", -innerHeight / 2)
		.attr("y", -40)
		.attr("text-anchor", "middle")
		.text("Price ($/MWh)");
}).catch(error => console.error("Failed to render line chart:", error));