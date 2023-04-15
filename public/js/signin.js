/*---------------------------------------------------------------------------------------------
 *  Copyright (c) VLC Community. All rights reserved.
 *  VLC Community is student-run and not school-sanctioned, and is not in any way affiliated with or endorsed by the VLC.
 *  The VLC name, logo, and all other branding are property of the Virtual Learning Center.
 *--------------------------------------------------------------------------------------------*/

const signin = () => {
  // Normal Sign in button
  try {
    document.querySelector("[role=button]").click();
  } catch {
    // GSI Overlay
    document.querySelector('[tabindex="0"]').click();
  }
};

function handleCredentialResponse(credential) {
  const id_token = credential.credential;
  const googleButton = document.getElementById("google-button");

  googleButton.innerHTML = "↻ Verifying...";
  fetch(window.location.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: id_token,
    }),
  }).then((response) => {
    response.text().then((text) => {
      if (response.status != 200) {
        raiseError(text);
        googleButton.innerHTML = "VLC Gmail";
      } else {
        googleButton.classList.remove("w3-black");
        googleButton.classList.add("w3-green");
        googleButton.innerHTML = "✅ VLC Gmail";

        const discordButton = document.getElementById("discord-button");
        discordButton.disabled = false;
        discordButton.classList.remove("w3-disabled");
        discordButton.setAttribute(
          "onclick",
          `window.location.href = "${text}"`
        );

        document.getElementById("error-card").classList.add("w3-hide");
      }
    });
  });
}

const raiseError = (err) => {
  document.getElementById("error-box").innerHTML = `ERROR: ${err}`;
  document.getElementById("error-card").classList.remove("w3-hide");
};

if (discordCompleted) {
  const card = document.getElementById("card");
  card.classList.add("w3-padding-64", "w3-green", "w3-center");
  card.classList.remove("w3-blue");
  card.innerHTML = "<h1>✅ Verified.</h1>";
}

if (error) {
  raiseError(error);
}
