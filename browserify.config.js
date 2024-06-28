module.exports = {
  entries: ["public/article.js"],
  bundleName: "bundle.js", // Output bundle file name
  outputDir: "dist", // Output directory
  debug: true, // Enable source maps
  extensions: [".js"],
  transform: [
    ["browserify-css", { global: true }], // Optional, if you use CSS
    ["browserify-shim", { global: true }], // Optional, for non-CommonJS libs
  ],
};
