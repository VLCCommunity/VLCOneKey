const express = require('express');
const userVerify = require('../../discord/userVerify');
const { database } = require('../..');
const {
  generateVerificationCode,
  sendVerificationEmail,
  emailToName,
  fetchDiscordUser,
  checkExistingUser,
  validateEmailFormat,
  validateCodeFormat,
} = require('../utils');

const router = express.Router();

router.get('/', async (req, res) => {
  res.render('index', {
    authUrl: process.env.DISCORD_OAUTH_URL,
  });
});

router.post('/email', async (req, res) => {
  const accessToken = req.headers.authorization;
  const email = req.body.email?.trim().toLowerCase();
  const verificationCode = generateVerificationCode();

  let discordUser;

  try {
    discordUser = await fetchDiscordUser(accessToken);
    await checkExistingUser(discordUser);
    validateEmailFormat(email);
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

router.post('/code', async (req, res) => {
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

  if (code !== userState.verification_code) {
    return res.json({
      success: false,
      message: 'Incorrect code.',
    });
  }

  const formattedName = emailToName(userState.email);
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
