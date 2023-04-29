const app = require("express")();
const bodyParser = require("body-parser");
const docusign = require("./controllers");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("docusign server");
});

app.post("/docusign", docusign);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
