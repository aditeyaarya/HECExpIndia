module.exports = function (eleventyConfig) {
  // Copy static assets as-is to the output folder
  eleventyConfig.addPassthroughCopy({ "static": "static" });

  // Copy all CSV datasets
  eleventyConfig.addPassthroughCopy({ "HEC Experience India Dataset - news.csv": "HEC Experience India Dataset - news.csv" });
  eleventyConfig.addPassthroughCopy({ "HEC Experience India Dataset - bollywood.csv": "HEC Experience India Dataset - bollywood.csv" });
  eleventyConfig.addPassthroughCopy({ "HEC Experience India Dataset - restaurants.csv": "HEC Experience India Dataset - restaurants.csv" });
  eleventyConfig.addPassthroughCopy({ "HEC Experience India Dataset - recipes.csv": "HEC Experience India Dataset - recipes.csv" });
  eleventyConfig.addPassthroughCopy({ "HEC Experience India Dataset - events.csv": "HEC Experience India Dataset - events.csv" });
  eleventyConfig.addPassthroughCopy({ "HEC Experience India Dataset - resources.csv": "HEC Experience India Dataset - resources.csv" });
  eleventyConfig.addPassthroughCopy({ "HEC Experience India Dataset - about me.csv": "HEC Experience India Dataset - about me.csv" });

  // Return Eleventy configuration
  return {
    dir: {
      input: "templates",   // where your index.html (Jinja/Nunjucks) lives
      output: "_site"       // Eleventy will build here
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["njk", "html", "md"]
  };
};
