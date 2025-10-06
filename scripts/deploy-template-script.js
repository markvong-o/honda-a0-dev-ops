// .github/workflows/deploy-template-script.js
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch"); // Using node-fetch for API calls
const { minify } = require("html-minifier-terser"); // For HTML minification

async function deployAuth0Prompt() {
  const auth0Domain = process.env.AUTH0_DOMAIN;
  const auth0ClientId = process.env.AUTH0_CLIENT_ID;
  const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
  const htmlFilePath = process.env.HTML_FILE_PATH;

  if (!auth0Domain || !auth0ClientId || !auth0ClientSecret || !htmlFilePath) {
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

  try {
    // 1. Read HTML content from file
    let htmlContent = fs.readFileSync(path.resolve(htmlFilePath), "utf8");
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

    // 3. Make the PUT request to Auth0 Management API
    const apiUrl = `https://${auth0Domain}/api/v2/branding/templates/universal-login`; // Endpoint for custom text
    console.log(`Making PUT request to: ${apiUrl}`);

    const updateResponse = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(minifiedHtmlContent),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(
        `Failed to update Auth0 prompt: ${updateResponse.status} - ${errorText}`
      );
    }

    console.log(`Successfully deployed Auth0 UL template!`);
    if (updateResponse.status === 200 || updateResponse.status === 201) {
      const responseJson = await updateResponse.json();
      console.log("Auth0 API Response:", JSON.stringify(responseJson, null, 2));
    }
  } catch (error) {
    console.error("Deployment failed:", error.message);
    process.exit(1); // Exit with a non-zero code to indicate failure
  }
}

deployAuth0Prompt();
