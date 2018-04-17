const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');

// create a new instance of keygrip with our cookie secret
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = ({ _id }) => {
  // create a session object like we have in the app
  const sessionObject = {
    passport: {
      user: _id.toString()
    }
  };

  // convert the object into a base64 encoded string
  const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');

  // sign the string with keygrip with our session secret key
  const sig = keygrip.sign('session=' + session);

  return { session, sig };
};
