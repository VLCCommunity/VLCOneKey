# 🔒 VLC OneKey: An Identity Verification Platform
### The most secure and effective form of student identity verification on Discord. 

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Discord](https://img.shields.io/discord/919273334821228574.svg)](https://vlconekey.com/discord)

**VLC OneKey** is a secure and efficient verification system designed for VLC students on Discord. It streamlines the verification process by linking a student’s VLC Gmail with their Discord account, automatically assigning roles and updating nicknames across multiple servers for seamless access and secure identification.

---

## 🚀 Features

- **Automated Verification:**  
  Simplifies identity verification by integrating Discord OAuth with VLC Gmail authentication.
  
- **Seamless Role Management:**  
  Automatically updates roles and nicknames on Discord servers once verification is complete.

- **Scalable Architecture:**  
  Combines a robust Discord bot with a lightweight Express server and a MongoDB backend.

---

## 🔍 How It Works

### Discord Bot

- **Built With:** [discord.js](https://discord.js.org/)
- **Key Commands:**
  - **Check:** [check.js](discord/commands/check.js)
  - **Search:** [search.js](discord/commands/search.js)
  - **Privacy:** [privacy.js](discord/commands/privacy.js)
  - **Setup:** [setup.js](discord/commands/setup.js)
- **Event Handling:**  
  Listens for events and logs updates via [index.js](discord/index.js).

### Express Server

- **Verification Interface:**  
  Provides a web interface for initiating the verification process via Discord OAuth.
- **Email Verification:**  
  Sends a six-digit code to the user's VLC Gmail, managed through [authentication.js](server/router/authentication.js).

### MongoDB

- **Data Management:**  
  Stores student and guild data, including temporary verification codes and persistent records.
- **Database Connection:**  
  Managed by [database/index.js](database/index.js).

### Verification Process Flow

1. **Discord Sign-In:**  
   The user signs in via Discord.
2. **Email Verification:**  
   A six-digit verification code is sent to their VLC Gmail.
3. **Code Submission:**  
   The user enters the code on the verification page.
4. **Role Update:**  
   Upon successful verification, the bot updates the user's roles and nickname across servers.

> **Pro Tip:** Utility functions for email formatting, code generation, and API calls (SMTP2GO) are handled in [server/utils.js](server/utils.js).

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- A [Discord Bot](https://discord.com/developers/applications) token
- A MongoDB database
- [SMTP2GO](https://www.smtp2go.com/) API key

### Installation

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/yourusername/vlc-onekey.git
   cd vlc-onekey
   ```

2. **Install Dependencies:**

   ```sh
   npm install
   ```

3. **Configure Environment Variables:**

   - Rename `.env.example` to `.env`.
   - Fill in the required variables:
     - `DISCORD_TOKEN`
     - `MONGO_URI`
     - `SMTP2GO_API_KEY`
     - *Additional configuration variables as needed.*

4. **Run the Project:**

   To start both the Discord bot and the Express server, run:
   ```sh
   npm start
   ```

5. **Development Mode:**

   For live updates with nodemon:
   ```sh
   npm run dev
   ```

   For compiling Tailwind CSS:
   ```sh
   npm run compile-css
   ```

---

## 📁 Project Structure

```
├── discord/               # Discord bot files
│   ├── commands/          # Bot commands
│   └── index.js           # Main bot entry point
├── server/                # Express server files
│   ├── router/            # Authentication routes
│   └── utils.js           # Utility functions
├── database/              # Database connection and models
│   └── index.js
├── public/                # Static web assets
├── views/                 # Web interface templates
├── .env.example           # Example environment file
└── README.md              # Project documentation
```

---

## 🤝 Contributing

Contributions are welcome! Please review our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to propose improvements or fixes.

---

## 📜 License

This project is licensed under the GNU General Public License v3. For more details, see the [LICENSE](LICENSE) file.

---

## 📞 Contact

For any questions or support, please open an issue on GitHub or join our [Discord community](https://vlconekey.com/discord).
