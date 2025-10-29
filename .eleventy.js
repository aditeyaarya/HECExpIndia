module.exports = function (eleventyConfig) {
  // Copy all static assets (images, CSS, JS, etc.)
  eleventyConfig.addPassthroughCopy({ "static": "static" });

  // Copy all data files (CSV, JSON, etc.) into the build output
  // This includes: about_me.csv, bollywood.csv, events.csv, news.csv,
  // recipes.csv, resources.csv, restaurants.csv
  eleventyConfig.addPassthroughCopy("data");

  // Return Eleventy configuration
  return {
    dir: {
      input: ".",       // your templates and data live in the project root
      output: "_site"   // Eleventy builds here
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["njk", "html", "md"]
  };
};
