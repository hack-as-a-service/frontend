module.exports = (on, config) => {
	if (config.testingType === "component") {
		require("@cypress/react/plugins/next")(on, config);
	}
	return config;
};
