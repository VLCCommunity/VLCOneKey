const express = require('express');
const crypto = require('crypto');

const router = express.Router();

const { database, discordBot } = require('../..');
const userVerify = require('../../discord/userVerify');
const fetch = require('node-fetch');

router.get('/authresponse', (req, res) => {
  res.cookie('authcode', req.query.code);
  res.redirect('/');
});

// index & Discord sign in
router.get('/', async (req, res) => {
  // let error, verified;

  // // if discord oauth code
  // if (req.query.code) {
  //   const state = await statesCollection.findOne({ state: req.query.state });

  //   // verify state
  //   if (!state) {
  //     error = "Missing or invalid state";
  //   } else {
  //     // get oauth token from discord using code
  //     let response = await fetch("https://discord.com/api/oauth2/token", {
  //       method: "POST",
  //       body: new URLSearchParams({
  //         client_id: "919271957051105311",
  //         client_secret: process.env["DISCORD_SECRET"],
  //         grant_type: "authorization_code",
  //         code: req.query.code,
  //         redirect_uri: "https://vlconekey.com",
  //       }).toString(),
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     });

  //     // json response
  //     let data = await response.json();
  //     if (response.status !== 200) {
  //       console.log(data);
  //       error = "Invalid Discord OAuth token";
  //     } else {
  //       // fetch discord ID from api
  //       response = await fetch("https://discord.com/api/users/@me", {
  //         headers: {
  //           Authorization: `Bearer ${data.access_token}`,
  //         },
  //       });
  //       data = await response.json();

  //       // check if discord already verified
  //       discordInDB = await database.studentsCollection.findOne({
  //         _id: data.id,
  //       });
  //       if (discordInDB) {
  //         error = `${data.username}#${data.discriminator} already verified as ${discordInDB.email}!`;
  //       } else {
  //         // Verification is completed
  //         try {
  //           database.studentsCollection.insertOne({
  //             _id: data.id,
  //             name: state.name,
  //             email: state.email,
  //             timestamp: Date.now(),
  //           });
  //           userVerify(data.id, state.name);
  //           console.log(`🔓 Verified ${data.id} as ${state.name}.`);
  //         } catch (error) {
  //           discordBot.error(
  //             `❌ Failed to verify ${data.id} as ${state.name}.`
  //           );
  //         }
  //         verified = true;

  //         // delete all previous user states
  //         statesCollection.deleteMany({ email: state.email });
  //       }
  //     }
  //   }

  //   if (error) {
  //     res.statusCode = 405;
  //   }
  // }

  const discordCompleted = req.cookies.authcode !== undefined;

  console.log('Discord Completed:', discordCompleted);

  res.render('index', {
    discordCompleted,
    error: '',
  });
});

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

  return await response.json();
};

const generateVerificationCode = () => {
  // From 1 to 999999 (inclusive)
  const n = crypto.randomInt(0, 1000000);

  return n.toString().padStart(6, '0');
};

router.post('/email', async (req, res) => {
  const email = req.body.email?.toLowerCase();

  // Basic check to ensure email is present
  if (!email) {
    return res.json({
      success: false,
      message: 'Missing email field in JSON body.',
    });
  }

  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.json({
      success: false,
      message: 'Invalid email format.',
    });
  }

  // Check if the email ends with '@virtuallearning.ca'
  // if (!email.endsWith('@virtuallearning.ca')) {
  //   return res.json({
  //     success: false,
  //     message: 'You must verify your VLC (@virtuallearning.ca) email.',
  //   });
  // }

  const verificationCode = generateVerificationCode();
  const result = await sendVerificationEmail(email, verificationCode);

  console.log(result);

  return res.json({
    success: true,
    message: 'Email is valid!',
  });
});

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

module.exports = router;
