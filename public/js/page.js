/*---------------------------------------------------------------------------------------------
 *  Copyright (c) VLC Community. All rights reserved.
 *  VLC Community is student-run and not school-sanctioned, and is not in any way affiliated with or endorsed by the VLC.
 *  The VLC name, logo, and all other branding are property of the Virtual Learning Center.
 *--------------------------------------------------------------------------------------------*/

let googleUser = {};

gapi.load("auth2", () => {
  auth2 = gapi.auth2.init({
    client_id: googleSecret,
    cookiepolicy: "single_host_origin",
  });

  auth2.attachClickHandler(
    document.getElementById("google-button"),
    {},
    (googleUser) => {
      const id_token = googleUser.getAuthResponse().id_token;
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
            googleButton.classList.remove("bg-blue-800");
            googleButton.classList.add("bg-green-500");
            googleButton.innerHTML = "✅ VLC Gmail";

            const discordButton = document.getElementById("discord-button");
            discordButton.disabled = false;
            discordButton.classList.remove("hidden");
            discordButton.setAttribute(
              "onclick",
              `window.location.href = "${text}"`
            );

            document.getElementById("error-card").classList.add("hidden");
          }
        });
      });
    }
  );
});

const raiseError = (err) => {
  document.getElementById("error-box").innerHTML = `ERROR: ${err}`;
  document.getElementById("error-card").classList.remove("hidden");
};

if (discordCompleted) {
  const card = document.getElementById("card");
  card.classList.remove("bg-blue-600", "lg:w-1/4", "md:w-1/2", "w-10/12");
  card.classList.add("bg-green-500", "w-full");
  card.innerHTML = "<h1>✅ Verified.</h1>";
}

if (error) {
  raiseError(error);
}
