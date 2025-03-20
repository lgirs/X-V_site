module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/assets/images");
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

    return {
        dir: {
            input: "src",
            output: "_site"
        }
    };
};
