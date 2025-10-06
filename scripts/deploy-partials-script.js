// .github/workflows/deploy-partials-script.js
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch"); // Using node-fetch for API calls
const { minify } = require("html-minifier-terser"); // For HTML minification

async function deployAuth0Prompt() {
  const auth0Domain = process.env.AUTH0_DOMAIN;
  const auth0ClientId = process.env.AUTH0_CLIENT_ID;
  const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
  const promptType = process.env.PROMPT_TYPE;
  const promptSection = process.env.PROMPT_SECTION;
  // promptSection could be form-content-start;form-content-end;form-footer-start;form-footer-end
  // promptSection.split(';') = ['form-content-start', 'form-content-end'...]
  const promptSections = promptSection.split(";");
  const htmlFilePath = process.env.HTML_FILE_PATH;
  // htmlFilePath could be login/partials/form-content-start.html;login/partials/form-content-end.html
  // htmlFilePath.split(';') is ['login/partials/form-content-start.html','login/partials/form-content-end.html']
  const htmlFilePaths = htmlFilePath.split(";");

  if (
    !auth0Domain ||
    !auth0ClientId ||
    !auth0ClientSecret ||
    !promptType ||
    !promptSection ||
    !htmlFilePath
  ) {
    console.error("Missing required environment variables.");
    process.exit(1);
  }

  //  Obtain Auth0 Management API Access Token
  console.log("Obtaining Auth0 Management API access token...");
  const tokenResponse = await fetch(`https://${auth0Domain}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: auth0ClientId,
      client_secret: auth0ClientSecret,
      audience: `https://${auth0Domain}/api/v2/`,
      grant_type: "client_credentials",
    }),
  });
  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(
      `Failed to get Auth0 token: ${tokenResponse.status} - ${errorText}`
    );
  }
  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  console.log("Auth0 access token obtained.");

  const obj = {};

  for (let i = 0; i < promptSections.length; i++) {
    console.log(
      `Attempting to deploy prompt for type: ${promptType}, section: ${promptSections[i]}`
    );
    console.log(`Reading HTML from: ${htmlFilePaths[i]}`);

    try {
      // 1. Read HTML content from file
      let htmlContent = fs.readFileSync(path.resolve(htmlFilePaths[i]), "utf8");
      console.log("HTML content read successfully.");

      // 2. Minify the HTML content
      const minifiedHtmlContent = await minify(htmlContent, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        // Add other options as needed for more aggressive minification
      });
      console.log("HTML content minified.");

      obj[`${promptSections[i]}`] = minifiedHtmlContent;
    } catch (error) {
      console.error("Deployment failed:", error.message);
      process.exit(1); // Exit with a non-zero code to indicate failure
    }
  }
  // 4. Prepare the payload with escaped HTML
  // JSON.stringify will automatically escape the HTML string for the payload
  const payload = {
    [`${promptType}`]: obj, // Auth0 expects the HTML string here
  };
  console.log(payload);
  try {
    // 5. Make the PUT request to Auth0 Management API
    const apiUrl = `https://${auth0Domain}/api/v2/prompts/${promptType}/partials`; // Endpoint for custom text
    console.log(`Making PUT request to: ${apiUrl}`);

    const updateResponse = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(
        `Failed to update Auth0 prompt: ${updateResponse.status} - ${errorText}`
      );
    }

    console.log(
      `Successfully deployed Auth0 prompt for ${promptType} - ${promptSection}!`
    );
    const responseJson = await updateResponse.json();
    console.log("Auth0 API Response:", JSON.stringify(responseJson, null, 2));
  } catch (error) {
    console.error("Deployment failed:", error.message);
    process.exit(1); // Exit with a non-zero code to indicate failure
  }
}

deployAuth0Prompt();
