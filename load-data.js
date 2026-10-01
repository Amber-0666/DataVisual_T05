async function loadData() {
	const [tvEnergyAllSizesByScreenType, tvEnergy55InchByScreenType, tvEnergy, areSpotPrices] = await Promise.all([
		d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv", d3.autoType),
		d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv", d3.autoType),
		d3.csv("data/Ex5_TV_energy.csv", d3.autoType),
		d3.csv("data/Ex5_ARE_Spot_Prices.csv", d3.autoType)
	]);

	return {
		tvEnergyAllSizesByScreenType,
		tvEnergy55InchByScreenType,
		tvEnergy,
		areSpotPrices
	};
}

window.chartDataPromise = loadData();
window.chartDataPromise.catch(error => console.error("Failed to load chart data:", error));