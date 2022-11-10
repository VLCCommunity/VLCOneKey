/*---------------------------------------------------------------------------------------------
 *  Copyright (c) VLC Community. All rights reserved.
 *  VLC Community is student-run and not school-sanctioned, and is not in any way affiliated with or endorsed by the VLC.
 *  The VLC name, logo, and all other branding are property of the Virtual Learning Center.
 *--------------------------------------------------------------------------------------------*/

const express = require('express');
const router = express.Router();

// VLC OneKey notion
router.get('/info', (_req, res) => {
  res.redirect('http://docs.vlconekey.com');
});

// Uptimerobot status
router.get('/status', (_req, res) => {
  res.redirect('https://status.vlconekey.com');
});

// Terms & Conditions
router.get('/terms', (_req, res) => {
  res.redirect(
    'https://vlccommunity.notion.site/VLC-OneKey-Terms-and-Conditions-53d53468331d4f74bc1f0d358a8810d5'
  );
});

// VLC OneKey Discord Server
router.get('/discord', (_req, res) => {
  res.redirect('https://discord.gg/aGrNsyHPTT');
});

// Replit
router.get('/code', (_req, res) => {
  res.redirect('https://github.com/VLCCommunity/VLCOneKey');
});

// API Documentation
router.get('/api', (_req, res) => {
  res.redirect(
    'https://vlccommunity.notion.site/VLC-OneKey-API-Documentation-0f42bdf48e00434792a58bbeb9273f2e'
  );
});

module.exports = router;
