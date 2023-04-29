const axios = require("axios");
const ds = require("./docusign");
const getJwt = ds.getJwt;

const accountId = "d2dd0579-c4fd-4d12-b419-2b573cbefe5f";
const templateId = "6fa8b0d3-a8e7-4bad-ab58-6ae058fdb1aa";

async function getTemplateDetails(email, name, ccEmail, ccName) {
  try {
    // get consent code
    let accessTkn = await getJwt();
    let accessToken = accessTkn.accessToken;
    console.log(email, name, ccEmail, ccName);

    const response = await axios.get(
      `https://demo.docusign.net/restapi/v2.1/accounts/${accountId}/templates/${templateId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    let args = {
      templateId: templateId,
      signerEmail: email,
      signerName: name,
      ccEmail: ccEmail,
      ccName: ccName,
    };

    let resultsArgs = {
      envelopeArgs: args,
      accessToken: accessToken,
      accountId: accountId,
    };
    let results = await ds.sendEnvelopeFromTemplate(resultsArgs);
    let data = {
      results: results,
      templateDetails: response.data,
    };
    return data;
  } catch (error) {
    console.error("Error: ");
  }
}

module.exports = getTemplateDetails;
