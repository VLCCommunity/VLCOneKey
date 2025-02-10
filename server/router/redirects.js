const express = require('express');
const router = express.Router();

// Discord Server
router.get('/discord', (_req, res) => {
  res.redirect('https://discord.gg/aGrNsyHPTT');
});

// Notion
router.get('/docs', (_req, res) => {
  res.redirect(
    'https://vlccommunity.notion.site/VLC-OneKey-4dc05c574d27492a907865fe1d02502a',
  );
});

module.exports = router;
