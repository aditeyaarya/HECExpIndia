module.exports = function (eleventyConfig) {
  // Copy static assets and data folder to the output
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("data");

  return {
    dir: {
      // IMPORTANT: look for templates and _data at the project root
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["njk", "html", "md"],
  };
};
