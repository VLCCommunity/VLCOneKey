// Behond, the curse of not using a web framework...

const verifyContainer = document.getElementById('verify_container');
const googleContainer = document.getElementById('google_container');
const codeContainer = document.getElementById('code_container');
const codeInputs = Array.from(document.querySelectorAll('input.code_input'));
const headerElement = document.getElementById('header');
const errorCard = document.getElementById('error-card');
const errorInput = document.getElementById('error');

const fragment = new URLSearchParams(window.location.hash.slice(1));
const accessToken = fragment.get('access_token');

if (accessToken) {
  verifyContainer.innerHTML = `<button class="bg-[#008037] w-full flex justify-center items-center gap-4 rounded-2xl h-[4.5rem] py-4">
        <span class="material-symbols-outlined !text-[48px]">
          check
        </span>
        <img src="/images/discord.png" alt="Discord" class="text-3xl w-auto h-full">
      </button>
      <button class="bg-[#2c2f33] w-full flex justify-center rounded-2xl h-[4.5rem] py-4" onclick="startGoogleVerification();">
        <img src="/images/google.png" alt="Google" class="text-3xl w-auto h-full">
      </button>`;
}

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
  const response = await fetch(window.location.origin + endpoint, {
    method: method,
    body: JSON.stringify(jsonBody),
    headers: { 'Content-Type': 'application/json', Authorization: accessToken },
  });

  try {
    return await response.json();
  } catch (err) {
    return await response.text();
  }
};

function startGoogleVerification() {
  verifyContainer.classList.remove('flex');
  verifyContainer.classList.add('hidden');

  googleContainer.classList.remove('hidden');
  googleContainer.classList.add('flex');
}

async function emailSubmit(e) {
  hideErrorCard();

  e.preventDefault();

  const requestJson = Object.fromEntries(new FormData(e.target));
  const jsonResponse = await performRequest('/email', requestJson);

  if (jsonResponse.success) {
    showCodeInput();
  } else {
    raiseError(jsonResponse.message);
  }
}

async function codeSubmit(e) {
  hideErrorCard();

  e.preventDefault();

  let code = '';
  for (const codeInput of codeInputs) {
    code += codeInput.value.toString();
  }

  const requestJson = { code };
  const jsonResponse = await performRequest('/code', requestJson);

  if (jsonResponse.success) {
    showVerified();
  } else {
    raiseError(jsonResponse.message);
  }
}

function showVerified() {
  document.querySelector('main').innerHTML =
    `<img src="/images/OneKey_Wordmark.png" alt="VLC OneKey" />
      <div
        class="flex h-[19rem] flex-col items-center rounded-3xl bg-[#008037]"
      >
        <span class="material-symbols-outlined !text-[15rem]"> check </span>
        <p class="mt-[-3rem] text-4xl uppercase">Verified</p>
      </div>`;
}

function showCodeInput() {
  googleContainer.classList.remove('flex');
  googleContainer.classList.add('hidden');

  codeContainer.classList.remove('hidden');
  codeContainer.classList.add('flex');

  headerElement.innerText =
    'Enter the 6 digit code that was sent to your email.';
}

function hideErrorCard() {
  errorCard.classList.add('hidden');
  errorInput.innerHTML = '';
}

function raiseError(err) {
  errorCard.classList.remove('hidden');
  errorInput.innerHTML = `ERROR: ${err}`;
}

function codePasted(event) {
  event.stopPropagation();
  event.preventDefault();

  clipboardData = event.clipboardData || window.clipboardData;
  pastedData = clipboardData.getData('Text');

  const match = pastedData.match(/\b\d{6}\b/);

  if (match) {
    const code = match[0];

    for (let i = 0; i < 6; i++) {
      const codeInput = codeInputs[i];
      const number = code.charAt(i);

      codeInput.value = number;
    }
  } else {
    alert('Unable to find 6 digit code in pasted content.');
  }
}

function incrementFocus(event) {
  event.preventDefault();

  const input = event.target;

  // Check if the input is a valid digit (0-9) and the length is 1
  if (!isNaN(event.key)) {
    const currentInputIndex = codeInputs.indexOf(input);

    codeInputs[currentInputIndex].value = event.key;

    // If it's not the last input, move to the next one
    if (currentInputIndex < codeInputs.length - 1) {
      codeInputs[currentInputIndex + 1].focus();
    }
  }
}

for (const codeInput of codeInputs) {
  codeInput.addEventListener('paste', codePasted);
  codeInput.addEventListener('keypress', incrementFocus);
}
