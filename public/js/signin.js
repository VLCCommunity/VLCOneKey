/**
 * Sends a `method` request with json `jsonBody` to `endpoint`. Returns JSON or text response.
 *
 * The method will attempt to convert HTTP responses to JSON, and if it fails, it will return the
 * raw response text as returned by the server.
 *
 * @param {string}                  endpoint   The endpoint to send the GET request to.
 * @param {object} [jsonBody={}]    jsonBody   The JSON to send.
 * @param {string} [method="POST"]  method     The HTTP request method.
 */
const performRequest = async (endpoint, jsonBody = {}, method = 'POST') => {
  const response = await fetch(window.location.href, {
    method: method,
    body: JSON.stringify(jsonBody),
  });

  try {
    return await response.json();
  } catch (err) {
    return await response.text();
  }
};

function startGoogleVerification() {
  const verifyContainer = document.getElementById('verify_container');
  const googleContainer = document.getElementById('google_container');

  verifyContainer.classList.remove('flex');
  verifyContainer.classList.add('hidden');

  googleContainer.classList.remove('hidden');
  googleContainer.classList.add('flex');
}

const emailSubmit = async (e) => {
  e.preventDefault();
  const requestJson = Object.fromEntries(new FormData(e.target));

  const response = await fetch('/email', {
    method: 'POST',
    body: JSON.stringify(requestJson),
    headers: { 'Content-Type': 'application/json' },
  });

  const jsonResponse = await response.json();

  if (jsonResponse.success) {
    showCodeInput();
  } else {
    raiseError(jsonResponse.message);
  }
};

function showCodeInput() {
  alert('Enter code bro');
}

/*
if (response.status != 200) {
    raiseError(text);
    googleButton.childNodes[0].nodeValue = 'VLC Gmail';
  } else {
    googleButton.classList.remove('w3-black');
    googleButton.classList.add('w3-green');
    googleButton.innerHTML = '✅ VLC Gmail';

    const discordButton = document.getElementById('discord-button');
    discordButton.disabled = false;
    discordButton.classList.remove('w3-disabled');
    discordButton.setAttribute(
      'onclick',
      `window.location.href = "${text}"`,
    );

    document.getElementById('error-card').classList.add('w3-hide');
  }
*/

const raiseError = (err) => {
  document.getElementById('error-card').classList.remove('hidden');
  document.getElementById('error').innerHTML = `ERROR: ${err}`;
};

// // Verified successfully
// if (discordCompleted) {
//   const card = document.getElementById('card');
//   card.classList.add('w3-padding-64', 'w3-green', 'w3-center');
//   card.classList.remove('w3-blue');
//   card.innerHTML = '<h1>✅ Verified.</h1>';
// }
