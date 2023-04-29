const docusign = require("docusign-esign");
const fs = require("fs");
const path = require("path");
const process = require("process");

const basePath = "https://demo.docusign.net/restapi";

// The envelope definition. This is where you set the parameters of your envelope, including the
// template ID and role.
const envelopeArgs = {
  signerEmail: "itsdeveshanand@gmail.com", // Enter signer email address
  signerName: "Devesh Anand", // Enter signer name
  templateId: "6fa8b0d3-a8e7-4bad-ab58-6ae058fdb1aa", // Enter template ID
  templateRoleName: "admin", // Enter template role name
  accessToken: "41ec3bce-eff3-46d3-b27a-288b46a40615", // Enter access token
};

const jwtConfig = {
  dsJWTClientId: "41ec3bce-eff3-46d3-b27a-288b46a40615",
  impersonatedUserGuid: "9f22d3e8-4102-4e52-a904-7328b6d311eb",
  dsOauthServer: "https://account-d.docusign.com",
};

async function getJwt() {
  const jwtLifeSec = 10 * 60, // requested lifetime for the JWT is 10 min
    dsApi = new docusign.ApiClient();
  const SCOPES = ["signature", "impersonation"];
  dsApi.setOAuthBasePath(jwtConfig.dsOauthServer.replace("https://", "")); // it should be domain only.
  let rsaKey = fs.readFileSync("./pvt.key");
  console.log("getjwt runnning");

  try {
    const results = await dsApi.requestJWTUserToken(
      jwtConfig.dsJWTClientId,
      jwtConfig.impersonatedUserGuid,
      SCOPES,
      rsaKey,
      jwtLifeSec
    );
    const accessToken = results.body.access_token;
    // console.log("access token:   " + accessToken);

    // get user info
    const userInfoResults = await dsApi.getUserInfo(accessToken);

    // use the default account
    let userInfo = userInfoResults.accounts.find(
      (account) => account.isDefault === "true"
    );

    return {
      accessToken: results.body.access_token,
      apiAccountId: userInfo.accountId,
      basePath: `${userInfo.baseUri}/restapi`,
    };
  } catch (e) {
    console.log(e);
  }
}

function makeEnvelope(args) {
  // create the envelope definition
  let env = new docusign.EnvelopeDefinition();
  env.templateId = args.templateId;

  let signer1 = docusign.TemplateRole.constructFromObject({
    email: args.signerEmail,
    name: args.signerName,
    roleName: "signer",
  });

  let cc1 = new docusign.TemplateRole();
  cc1.email = args.ccEmail;
  cc1.name = args.ccName;
  cc1.roleName = "cc";

  env.templateRoles = [signer1, cc1];
  env.status = "sent"; // requests that the envelope be created and sent.

  return env;
}

const sendEnvelopeFromTemplate = async (args) => {
  console.log("temproles:::", args, "------");

  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

  let envelope = makeEnvelope(args.envelopeArgs);

  let results = await envelopesApi.createEnvelope(args.accountId, {
    envelopeDefinition: envelope,
  });
  console.log(`Envelope was created. EnvelopeId ${results.envelopeId}`);

  return results;
};

module.exports = { sendEnvelopeFromTemplate, makeEnvelope, getJwt };
