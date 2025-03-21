module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/arcade");

    // Generate a collection for tags
    eleventyConfig.addCollection("tagList", function(collectionApi) {
        let tagSet = new Set();
        collectionApi.getAll().forEach(item => {
            if ("tags" in item.data) {
                let tags = item.data.tags;
                tags = Array.isArray(tags) ? tags : [tags];
                tags.forEach(tag => tagSet.add(tag));
            }
        });
        return [...tagSet];
    });

    // ✅ Ensure Markdown posts in "src/posts/" are processed
    eleventyConfig.addCollection("posts", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/posts/*.md");
    });

    return {
        dir: {
            input: "src",
            includes: "_includes",
            output: "_site"
        }
    };
};
