window.chartDataPromise.then(({ tvEnergy }) => {
	const container = d3.select("#scatter-chart");
	const data = tvEnergy.filter(row =>
		Number.isFinite(row.star2) && Number.isFinite(row.energy_consumpt)
	);
	const width = 520;
	const height = 230;
	const margin = { top: 14, right: 18, bottom: 48, left: 60 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;
	const x = d3.scaleLinear()
		.domain(d3.extent(data, row => row.star2))
		.nice()
		.range([0, innerWidth]);
	const y = d3.scaleLinear()
		.domain([0, d3.max(data, row => row.energy_consumpt)])
		.nice()
		.range([innerHeight, 0]);

	const svg = container.append("svg")
		.attr("class", "scatter-chart-svg")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "TV energy consumption by star rating");
	const chart = svg.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	chart.append("g")
		.attr("class", "chart-axis")
		.call(d3.axisLeft(y).ticks(5));

	chart.append("g")
		.attr("class", "chart-axis")
		.attr("transform", `translate(0,${innerHeight})`)
		.call(d3.axisBottom(x).ticks(6));

	chart.selectAll(".scatter-dot")
		.data(data)
		.join("circle")
		.attr("class", "scatter-dot")
		.attr("cx", row => x(row.star2))
		.attr("cy", row => y(row.energy_consumpt))
		.attr("r", 3)
		.append("title")
		.text(row => `${row.star2} stars: ${d3.format(",.1f")(row.energy_consumpt)} kWh/year`);

	chart.append("text")
		.attr("class", "chart-axis-label")
		.attr("x", innerWidth / 2)
		.attr("y", innerHeight + 40)
		.attr("text-anchor", "middle")
		.text("Star rating");

	chart.append("text")
		.attr("class", "chart-axis-label")
		.attr("transform", "rotate(-90)")
		.attr("x", -innerHeight / 2)
		.attr("y", -44)
		.attr("text-anchor", "middle")
		.text("Energy consumption (kWh/year)");
}).catch(error => console.error("Failed to render scatter plot:", error));