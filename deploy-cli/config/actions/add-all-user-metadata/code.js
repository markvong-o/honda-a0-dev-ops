/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  let allUserMetadata = event.user.user_metadata;
  for(const [k,v] of Object.entries(allUserMetadata)) {
    api.idToken.setCustomClaim(`metadata://${k}`, v)
    api.accessToken.setCustomClaim(k, v)
  }
  // Add email separately
  api.idToken.setCustomClaim('email', event.user.email)
  api.accessToken.setCustomClaim('email', event.user.email)
};


/**
* Handler that will be invoked when this action is resuming after an external redirect. If your
* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
// exports.onContinuePostLogin = async (event, api) => {
// };
