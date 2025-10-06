/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
    
    const { ManagementClient } = require('auth0');
    const auth0 = new ManagementClient({
        domain: event.secrets.DOMAIN,
        clientId: event.secrets.CLIENT_ID,
        clientSecret: event.secrets.CLIENT_SECRET,
    });

    // @ts-ignore


    if (event.user && event.user.enrolledFactors.length === 0) {
        let res = await auth0.users.createAuthenticationMethod({ id: event.user.user_id }, { "type": "email", "email": event.user.email })
    }

    api.redirect.sendUserTo(`https://${event.request.hostname}/continue`)

};


/**
* Handler that will be invoked when this action is resuming after an external redirect. If your
* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onContinuePostLogin = async (event, api) => {
    console.log("enrolled factors:", event.user.enrolledFactors);
    // Only trigger mfa if one session exists
    if (event.session && event.session.clients && event.session.clients.length === 0) {
        api.authentication.challengeWithAny([{ type: 'email' }])
    }
};
