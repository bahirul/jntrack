# 📦 JNT Package Tracker CLI

Track your JNT packages with ease using the **JNT Package Tracker CLI** - a simple Node.js command-line tool that keeps you in the loop about your packages' journey. It not only fetches real-time tracking details but also shoots off email notifications to keep you informed.

⚠️ **Note:** This tool is unofficial and may not be endorsed by JNT. Use it at your own risk. Depending on how you use it, there's a possibility that your access might get blocked by JNT.

## 🚀 Features

- 📬 **Real-time Tracking**: Stay updated on your JNT packages' whereabouts directly from your terminal.
- ✉️ **Email Alerts**: Get email notifications for package status changes - no more checking obsessively.
- ⌨️ **CLI Convenience**: Built for the command line using Node.js, because that's how real devs roll.
- 📦 **Yarn Powered**: We love efficient package management, so we chose Yarn as our sidekick.

## ⚙️ Installation

Make sure you have [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed, then:

1. Clone the repo:
   ```sh
   git clone https://github.com/bahirul/jntrack.git
   ```
2. Go to the project directory:
   ```sh
   cd jntrack
   ```
3. Install dependencies with Yarn:
   ```sh
   yarn install
   ```
4. Configure `./config/config.js`
   Configure config.js as your needs.

## How to get pId in the config.js ?

1. Open Chrome 
2. Go To [JNT Track](https://www.jet.co.id/track)
3. Open the Google Chrome Console by pressing F12 key.
4. Select "Application" in the console's top menu.
5. Select “Local Storage” in the console's left menu.
6. Select "https://www.jet.co.id", you will find Key:"murmur" and the value
7. Copy the value and place to "pId" in your awb configuration.

## 🛠️ Usage

```sh
node track.js
```