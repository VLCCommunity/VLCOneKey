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

  headerElement.innerText =
    'Enter your VLC Gmail to receive a verification code.';
}

async function emailSubmit(e) {
  e.preventDefault();

  const requestJson = Object.fromEntries(new FormData(e.target));
  const jsonResponse = await performRequest('/email', requestJson);

  if (jsonResponse.success) {
    showCodeInput();
  } else {
    toggleFormSubmit(e.target, false, "Send Code");
    raiseError(jsonResponse.message);
  }
}

function showCodeInput() {
  hideErrorCard();
  
  googleContainer.classList.remove('flex');
  googleContainer.classList.add('hidden');

  codeContainer.classList.remove('hidden');
  codeContainer.classList.add('flex');

  headerElement.innerText =
    'Enter the 6 digit code that was sent to your email.';
}

async function codeSubmit(e) {
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
    toggleFormSubmit(e.target, false, "Verify");
    raiseError(jsonResponse.message);
  }
}

function showVerified() {
  hideErrorCard();

  document.querySelector('main').innerHTML =
    `<img src="/images/OneKey_Wordmark.png" alt="VLC OneKey" />
      <div
        class="flex h-[19rem] flex-col items-center rounded-3xl bg-[#008037]"
      >
        <span class="material-symbols-outlined !text-[15rem]"> check </span>
        <p class="mt-[-3rem] text-4xl uppercase">Verified</p>
      </div>`;
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

const toggleFormSubmit = (formElement, disabled, textContent) => {
  const submitButton = formElement.querySelector("button[type=submit]");
  submitButton.disabled = disabled;
  submitButton.innerHTML = textContent;
}

const showLoadingIcon = (event) => {
  toggleFormSubmit(event.target, true, `
    <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>`);
}

for (const form of document.querySelectorAll("form")) {
  form.addEventListener("submit", showLoadingIcon);
}
