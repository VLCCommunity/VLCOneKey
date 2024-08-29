const fetch = require('node-fetch');
const crypto = require('crypto');
const { database } = require('..');

const emailToName = (email) => {
  let firstInitial;
  let lastName;

  if (email.startsWith('tl')) {
    firstInitial = email[2].toUpperCase();
    lastName = email.slice(3, -22);
  } else {
    firstInitial = email[0].toUpperCase();
    lastName = email.slice(1, -19);
  }

  // Capitalize the first letter of the last name
  lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

  return `${firstInitial}. ${lastName}`;
};

const generateVerificationCode = () => {
  // From 1 to 999999 (inclusive)
  const n = crypto.randomInt(0, 1000000);

  return n.toString().padStart(6, '0');
};

const sendVerificationEmail = async (email, code) => {
  const response = await fetch('https://api.smtp2go.com/v3/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Smtp2go-Api-Key': process.env.SMTP2GO_API_KEY,
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: 'VLC OneKey <verify@vlconekey.com>',
      to: [email],
      subject: 'Your verification code',
      html_body: `Your verification code is: ${code}<br><br>VLC OneKey | Verified once, verified forever.`,
    }),
  });

  const result = await response.json();

  if (result.data.error) {
    throw new Error(result.data.error);
  } else if (result.data.succeeded !== 1) {
    throw new Error('Unexpected response: ' + JSON.stringify(result.data));
  }
};

const fetchDiscordUser = async (accessToken) => {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) {
    const responseText = await response.text();
    console.error(responseText);

    throw new Error('Discord token is invalid.');
  }

  return await response.json();
};

const validateEmailFormat = (email) => {
  // Basic check to ensure email is present
  if (typeof email !== 'string' || email.length === 0) {
    throw new Error('Missing email field or empty value.');
  }

  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format.');
  }

  // Check if the email ends with '@virtuallearning.ca'
  if (!email.endsWith('@virtuallearning.ca')) {
    throw new Error('You must verify your VLC (@virtuallearning.ca) email.');
  }
};

const validateCodeFormat = (code) => {
  if (typeof code !== 'string' || code.length === 0) {
    throw new Error('Missing code field or empty value.');
  }

  if (code.length !== 6 || isNaN(code)) {
    throw new Error('Invalid code format.');
  }
};

const checkExistingUser = async (discordUser) => {
  const existingUser = await database.studentsCollection.findOne({
    _id: discordUser.id,
  });

  if (existingUser) {
    throw new Error(
      `Your account is already verified as ${existingUser.email}!`,
    );
  }
};

module.exports = {
  emailToName,
  generateVerificationCode,
  sendVerificationEmail,
  fetchDiscordUser,
  checkExistingUser,
  validateEmailFormat,
  validateCodeFormat,
};
