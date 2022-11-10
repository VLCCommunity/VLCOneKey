/*---------------------------------------------------------------------------------------------
 *  Copyright (c) VLC Community. All rights reserved.
 *  VLC Community is student-run and not school-sanctioned, and is not in any way affiliated with or endorsed by the VLC.
 *  The VLC name, logo, and all other branding are property of the Virtual Learning Center.
 *--------------------------------------------------------------------------------------------*/

const express = require('express');
const router = express.Router();

const fetch = require('node-fetch');
const { studentsCollection, keyCollection } = require('../index');

router.get('/status', async (req, res) => {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bot ${process.env['DISCORD_TOKEN']}`,
    },
  });

  res.sendStatus(response.status);

  if (response.status != 200) {
    exec('kill 1'); // restart repl
  }
});

router.use(async (req, res, next) => {
  const apiKey = req.header('Authorization'); // get API key from Authorization header
  if (!apiKey) {
    // no API key
    return res.status(401).send({
      errors: [
        'Unauthorized! An API key is required. https://vlconekey.com/discord',
      ],
    });
  }

  const keyInDB = await keyCollection.findOne({ key: apiKey }); // search for API key in keyCollection
  if (!keyInDB) {
    // invalid API key
    return res.status(401).send({ errors: ['Unauthorized.'] });
  }

  console.log(
    `[API] ${req.method} ${req.url} - ${keyInDB.student.name} ${req.header(
      'x-forwarded-for'
    )}`
  );

  next();
});

router.get('/search', async (req, res) => {
  const query = req.body.query || req.query.query; // JSON or URL parameter
  if (!query) {
    return res
      .status(400)
      .send({ errors: ['Missing "query" field in JSON body.'] }); // Bad request
  }

  let results = [];

  await studentsCollection
    .find({
      $text: {
        $search: query,
      },
    })
    .limit(5) // limit to 4 results
    .sort({
      score: {
        $meta: 'textScore',
      },
    })
    .forEach((result) => results.push(result)); // someone PLEASE improve this

  res.send(results);
});

router.get('/users/:id', async (req, res) => {
  const user = await studentsCollection.findOne({
    _id: req.params.id,
  });

  if (!user) {
    return res.status(404).send({ errors: ['User not found!'] });
  }

  res.send(user);
});

module.exports = router;
