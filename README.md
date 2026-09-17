# ChatMingle - Free Live Online Chat Rooms & IRC Client

A modern, responsive, real-time live chat room application built with **React**, **TypeScript**, **Tailwind CSS**, and **KiwiIRC / HybridIRC network integration**.

---

## 🌟 Key Features

- **🔒 100% Anonymous & Ephemeral**: Zero user registration, no accounts, and **zero chat history stored**. Messages live exclusively in memory during active sessions.
- **⚡ WebRTC Direct P2P Messaging**: Messages travel peer-to-peer directly between client browsers via WebRTC DataChannels with automatic WebSocket fallback for strict NAT/firewalls.
- **🎯 Interest Tag Matchmaking**: Optional interest topic selection (Gaming, Music, Tech, Movies, Philosophy, etc.) to pair you with like-minded strangers.
- **🕹️ Full Control Actions**: Instant **Start Chat**, **Next Stranger** (Keyboard shortcut: `Esc`), **Stop Chat**, **Report**, and **Block Stranger**.
- **🛡️ Safety & Moderation**: Integrated Report modal, local session stranger blocking, profanity blur filter, and prominent safety guidelines.
- **📱 Responsive Mobile & Desktop UI**: High-density mobile interface with sticky controls, typing indicators, and Web Audio API audio feedback.
- **🌙 Dark & Light Themes**: Smooth theme switcher with local state persistence.

---

## 🏗️ Architecture Overview

StrangerChat uses a hybrid WebRTC + WebSocket architecture designed for optimal performance and privacy:

```
                  ┌────────────────────────┐
                  │ WebRTC DataChannel     │
                  │ (Direct P2P Text Chat) │
       ┌──────────┴────────────────────────┴──────────┐
       │                                              │
  ┌────▼─────┐                                  ┌─────▼────┐
  │ Client A │                                  │ Client B │
  └────┬─────┘                                  └─────┬────┘
       │                                              │
       │     ┌──────────────────────────────────┐     │
       └────►│ Node/Express WebSocket Signaling │◄────┘
             │ (Matchmaking & SDP/ICE Relay)    │
             └──────────────────────────────────┘
```

1. **Signaling Service**: A lightweight Node.js/Express WebSocket server handles the matchmaking queue, relays WebRTC SDP offers/answers and ICE candidates, and tracks online user counts.
2. **Direct P2P Data Channel**: Once connected, messages flow directly between peers through WebRTC `RTCDataChannel`.
3. **WebSocket Fallback**: If WebRTC connection fails due to restrictive corporate firewalls or symmetric NATs, the system automatically degrades gracefully to WebSocket message relaying.

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 18+ and `npm`

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in two separate browser tabs to test stranger matchmaking locally!

---

## 📦 Production Build & Running

To build and run the fullstack application in a production environment (Cloud Run, Railway, Render, Docker):

```bash
# Build the Vite frontend static assets
npm run build

# Start the fullstack Express + WebSocket production server
npm start
```

The app will start on port `3000` (or `process.env.PORT`).

---

## 🌐 Deploying to Vercel

Vercel provides serverless runtime infrastructure. Because WebSockets and WebRTC matchmaking require persistent stateful socket connections in memory for matchmaking queues, Vercel Serverless Functions cannot serve as a permanent WebSocket server.

### Option 1: Standalone Deployment (Cloud Run / Render / Railway / Docker)
Deploy the fullstack app using `npm run build` and `npm start` on platforms supporting persistent containers (Cloud Run, Render, Railway, Fly.io, Heroku, or VPS).

### Option 2: Split Vercel Frontend + External Signaling Service

If you prefer hosting the React frontend on **Vercel**:

1. **Deploy the Signaling Backend**:
   - Deploy `server.ts` or a container to **Render**, **Railway**, **Fly.io**, or **Cloud Run**.
   - Note your live WebSocket signaling URL (e.g., `wss://stranger-chat-signaling.onrender.com/ws`).

2. **Configure Vercel Environment Variable**:
   - In your Vercel Project Settings > **Environment Variables**:
     ```env
     VITE_SIGNALING_SERVER_URL=wss://your-signaling-server.onrender.com/ws
     ```

3. **Deploy Frontend to Vercel**:
   - Import repository in Vercel.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Deploy!

---

## 🔒 Safety & Privacy Commitments

- **No Database**: No PostgreSQL, MongoDB, or Redis databases are connected.
- **No IP Logging**: Stranger identity relies on temporary session tokens.
- **Block Protection**: Blocked peer tokens are saved locally in `localStorage` on your device only.

---

## 📄 License

Apache-2.0 License.
