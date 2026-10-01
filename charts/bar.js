window.chartDataPromise.then(({ tvEnergy55InchByScreenType }) => {
	const container = d3.select("#bar-chart");
	const data = tvEnergy55InchByScreenType;
	const width = 520;
	const height = 220;
	const margin = { top: 18, right: 16, bottom: 42, left: 58 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const x = d3.scaleBand()
		.domain(data.map(row => row.Screen_Tech))
		.range([0, innerWidth])
		.padding(0.32);
	const y = d3.scaleLinear()
		.domain([0, d3.max(data, row => row["Mean(Labelled energy consumption (kWh/year))"]) * 1.15])
		.nice()
		.range([innerHeight, 0]);

	const svg = container.append("svg")
		.attr("class", "bar-chart-svg")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Mean annual energy consumption for 55-inch televisions by screen type");
	const chart = svg.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	chart.append("g")
		.attr("class", "chart-axis")
		.call(d3.axisLeft(y).ticks(4));

	chart.append("g")
		.attr("class", "chart-axis")
		.attr("transform", `translate(0,${innerHeight})`)
		.call(d3.axisBottom(x));

	chart.selectAll(".bar")
		.data(data)
		.join("rect")
		.attr("class", "bar")
		.attr("x", row => x(row.Screen_Tech))
		.attr("y", row => y(row["Mean(Labelled energy consumption (kWh/year))"]))
		.attr("width", x.bandwidth())
		.attr("height", row => innerHeight - y(row["Mean(Labelled energy consumption (kWh/year))"]))
		.attr("rx", 3)
		.attr("fill", (row, index) => ["#147d70", "#d89b32", "#d7654d"][index % 3]);

	chart.selectAll(".bar-value")
		.data(data)
		.join("text")
		.attr("class", "bar-value")
		.attr("x", row => x(row.Screen_Tech) + x.bandwidth() / 2)
		.attr("y", row => y(row["Mean(Labelled energy consumption (kWh/year))"]) - 7)
		.attr("text-anchor", "middle")
		.text(row => d3.format(".1f")(row["Mean(Labelled energy consumption (kWh/year))"]));

	chart.append("text")
		.attr("class", "chart-axis-label")
		.attr("transform", "rotate(-90)")
		.attr("x", -innerHeight / 2)
		.attr("y", -43)
		.attr("text-anchor", "middle")
		.text("Mean energy use (kWh/year)");
}).catch(error => console.error("Failed to render bar chart:", error));