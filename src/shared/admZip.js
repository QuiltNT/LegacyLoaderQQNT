export default (() => {
    const major_node = path.join(process.resourcesPath, "app", "major.node");
    require(major_node).load("internal_admzip", module);
    return exports.admZip.default;
})();
