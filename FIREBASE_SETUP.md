# Setting up a Free Cloud Database (Firebase)

Since GitHub Pages is just a static host, we need an external backend to store your data permanently and accessible from any device. **Google Firebase** is the best free option for this.

## 1. Create a Firebase Project
1.  Go to [console.firebase.google.com](https://console.firebase.google.com/) and log in with your Google account.
2.  Click **"Add project"** or **"Create a project"**.
3.  Name it (e.g., `credit-tracker-db`) and click **Continue**.
4.  Disable Google Analytics (not needed) and click **Create project**.

## 2. Create the Database
1.  On the left sidebar, click **Build** -> **Firestore Database**.
2.  Click **Create database**.
3.  **Location**: Choose one close to you (e.g., `asia-south1` for India or `us-central1`).
4.  **Security Rules**: Choose **"Start in test mode"** (this allows read/write access for 30 days, which is easiest for now. We can secure it easily later).
5.  Click **Create**.

## 3. Gets Your Keys
1.  Click the **Project Overview** (gear icon ⚙️) at the very top left -> **Project settings**.
2.  Scroll down to **"Your apps"**.
3.  Click the **</> (Web)** icon.
4.  Nickname: `credit-tracker`.
5.  Click **Register app**.
6.  You will see a code block with `const firebaseConfig = { ... }`.

## 4. Send the Config
**Copy that entire `firebaseConfig` object** and paste it into our chat here. It will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Once you give me those details, I will connect your app to the cloud! ☁️
