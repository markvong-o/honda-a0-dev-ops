/**
* Handler that will be called during the execution of a PreUserRegistration flow.
*
* @param {Event} event - Details about the context and user that is attempting to register.
* @param {PreUserRegistrationAPI} api - Interface whose methods can be used to change the behavior of the signup.
*/

exports.onExecutePreUserRegistration = async (event, api) => {
  /**
   * Only allow users registering with an @okta.com or @atko.email domain 
   * to proceed with self service registration.
   * 
   * Otherwise, deny the registration attempt.
   */
  if (event.connection.strategy === 'auth0') {
    const allowedDomains = ['atko.email', 'okta.com']
    const userEmail = event.user.email;
    const domain = userEmail?.split('@')[1];
    const canRegister = domain && allowedDomains.includes(domain);
    if (!canRegister) {
      api.access.deny('Invalid Domain', 'Only Okta or Atko users may enroll.');
    }
  }

};
