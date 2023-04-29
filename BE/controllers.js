const sendEnvelope = require("./scripts");

const docusign = async (req, res) => {
  try {
    let { email, name } = req.body;
    let ccEmail = "itsdeveshanand@gmail.com",
      ccName = "Devesh Anand";
    let results = await sendEnvelope(email, name, ccEmail, ccName);

    res.send(results);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

module.exports = docusign;
