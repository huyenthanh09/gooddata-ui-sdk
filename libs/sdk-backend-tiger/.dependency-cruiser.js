const depCruiser = require("../../common/config/dep-cruiser/default.config");

options = {
    forbidden: [
        ...depCruiser.DefaultRules,
        ...depCruiser.DefaultSdkRules,
        depCruiser.moduleWithDependencies("convertors", "src/convertors", ["src/types/*"]),
    ],
    options: depCruiser.DefaultOptions,
};

module.exports = options;
