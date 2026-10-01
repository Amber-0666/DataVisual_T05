window.chartDataPromise.then(({ tvEnergyAllSizesByScreenType }) => {
	const container = d3.select("#donut-chart");
	const data = tvEnergyAllSizesByScreenType;
	const valueKey = "Mean(Labelled energy consumption (kWh/year))";
	const width = 520;
	const height = 230;
	const center = { x: 125, y: height / 2 };
	const total = d3.sum(data, row => row[valueKey]);
	const colors = ["#147d70", "#d89b32", "#d7654d"];
	const pie = d3.pie()
		.sort(null)
		.value(row => row[valueKey]);
	const arc = d3.arc()
		.innerRadius(47)
		.outerRadius(82)
		.padAngle(0.025)
		.cornerRadius(2);

	const svg = container.append("svg")
		.attr("class", "donut-chart-svg")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Mean annual energy consumption by TV screen technology across all sizes");

	svg.append("g")
		.attr("transform", `translate(${center.x},${center.y})`)
		.selectAll("path")
		.data(pie(data))
		.join("path")
		.attr("class", "donut-slice")
		.attr("d", arc)
		.attr("fill", (item, index) => colors[index % colors.length]);

	svg.append("text")
		.attr("class", "donut-center-label")
		.attr("x", center.x)
		.attr("y", center.y - 2)
		.attr("text-anchor", "middle")
		.text("kWh/year");

	const legend = svg.append("g")
		.attr("class", "donut-legend")
		.attr("transform", "translate(255,70)");
	const legendItem = legend.selectAll(".donut-legend-item")
		.data(data)
		.join("g")
		.attr("class", "donut-legend-item")
		.attr("transform", (row, index) => `translate(0,${index * 36})`);

	legendItem.append("rect")
		.attr("width", 11)
		.attr("height", 11)
		.attr("rx", 2)
		.attr("fill", (row, index) => colors[index % colors.length]);

	legendItem.append("text")
		.attr("class", "donut-legend-name")
		.attr("x", 18)
		.attr("y", 9)
		.text(row => row.Screen_Tech);

	legendItem.append("text")
		.attr("class", "donut-legend-value")
		.attr("x", 18)
		.attr("y", 24)
		.text(row => `${d3.format(",.1f")(row[valueKey])} kWh/year (${d3.format(".1%")(row[valueKey] / total)})`);
}).catch(error => console.error("Failed to render donut chart:", error));