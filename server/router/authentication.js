const express = require('express');
const rateLimit = require('express-rate-limit');

const userVerify = require('../../discord/userVerify');
const { database } = require('../..');
const {
  generateVerificationCode,
  sendVerificationEmail,
  emailToName,
  fetchDiscordUser,
  checkExistingDiscord,
  checkExistingEmail,
  validateEmailFormat,
  validateCodeFormat,
  rateLimitHandler
} = require('../utils');

const router = express.Router();

router.get('/', async (req, res) => {
  res.render('index', {
    authUrl: process.env.DISCORD_OAUTH_URL,
  });
});

// One request every 30 seconds
const emailRateLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 1,
  handler: rateLimitHandler
});

router.post('/email', emailRateLimiter, async (req, res) => {
  const accessToken = req.headers.authorization;
  const verificationCode = generateVerificationCode();

  let discordUser, email;

  try {
    email = validateEmailFormat(req.body.email);
    discordUser = await fetchDiscordUser(accessToken);

    await checkExistingDiscord(discordUser);

    await sendVerificationEmail(email, verificationCode);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }

  await database.statesCollection.updateOne(
    { _id: discordUser.id },
    {
      $set: {
        _id: discordUser.id,
        email: email,
        verification_code: verificationCode,
      },
    },
    { upsert: true },
  );

  return res.json({
    success: true,
    message: 'Verification code sent.',
  });
});

// One request every 5 seconds
const codeRateLimiter = rateLimit({
  windowMs: 5 * 1000,
  max: 1,
  handler: rateLimitHandler
});

router.post('/code', codeRateLimiter, async (req, res) => {
  const accessToken = req.headers.authorization;
  const code = req.body.code.trim();

  let discordUser;

  try {
    discordUser = await fetchDiscordUser(accessToken);
    validateCodeFormat(code);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }

  const userState = await database.statesCollection.findOne({
    _id: discordUser.id,
  });

  if (!userState) {
    return res.json({
      success: false,
      message: 'Unable to find your verification code. Please reload the page.',
    });
  } else if (code !== userState.verification_code) {
    return res.json({
      success: false,
      message: 'Incorrect code.',
    });
  }

  try {
    await checkExistingEmail(userState.email);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }

  const formattedName = await emailToName(userState.email);
  await userVerify(userState._id, formattedName);

  await database.statesCollection.deleteOne({
    _id: discordUser.id,
  });

  await database.studentsCollection.insertOne({
    _id: discordUser.id,
    name: formattedName,
    email: userState.email,
    timestamp: Date.now(),
  });

  console.log(`Verified ${discordUser.id} as ${formattedName}.`);

  return res.json({
    success: true,
    message: 'Verified.',
  });
});

module.exports = router;
