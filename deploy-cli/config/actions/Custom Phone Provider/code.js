/**
* Handler to be executed while sending a phone notification
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {CustomPhoneProviderAPI} api - Methods and utilities to help change the behavior of sending a phone notification.
*/
exports.onExecuteCustomPhoneProvider = async (event, api) => {
    const axios = require('axios');
    const jwt = require('jsonwebtoken');
  
    const { secrets } = event;
    //const { code, recipient, as_text } = event?.notification;
    const code = event?.notification?.code || '000000'
    const recipient = event?.notification.recipient
    const text = event?.notification.as_text
  
    const url = "https://us-central1-okta-ciam-demo.cloudfunctions.net/smsgateway";
  
    const token = jwt.sign(
      {}, 
      Buffer.from(secrets?.SMS_SECRET, 'base64').toString(),
      { 
        audience: 'urn:MySmsGateway', 
        expiresIn: 300,
        issuer: 'Auth0',
        subject: 'urn:Auth0'
      }
    );
  
    const options = {
      method: 'POST', 
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      url,
      data: {
        body: text,
        code,
        recipient
      }
    }
  
    console.log(options);
  
    try {
      await axios(options);
  
      console.log('sms successfully sent to gateway!');
  
    } catch (error) {
      console.log('sms gateway responded with error');
      console.error(error);
    }
  
    return;
};