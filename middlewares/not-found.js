const notFound = (req, res) =>
  res.status(404).render("404", {
    title: "Page Not Found",
  });

module.exports = notFound;
