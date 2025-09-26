# Bid-to-Feature Backend Notification System

This document provides an overview of the backend notification system, explaining its architecture, how to run it, and how to integrate it with the frontend.

## How It Works

The notification system is built around a few core services that work together to monitor the auction, generate notifications, and broadcast them to the frontend.

-   **`solanaListener.ts`**: This service listens for bidding events from the Solana blockchain. It can be configured to use a mock listener for local development.
-   **`biddingState.ts`**: This service maintains the current state of the auction, including the top bidder, auction start and end times, and whether the auction is active.
-   **`aiHeartbeat.ts`**: This service acts as a cron job, periodically checking the auction state and triggering notifications at key moments (e.g., auction start, midway point, and end).
-   **`aiNotifier.ts`**: This service is responsible for generating the notification messages. It can be configured to use a static notification generator or an LLM-based one (e.g., OpenAI's GPT-3.5).
-   **`index.ts`**: This is the main entry point of the backend, setting up the Express server and Socket.IO for real-time communication with the frontend.

## How to Run It

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Create a `.env` file**: Copy the `.env_example` file to a new file named `.env` and fill in the required environment variables.
3.  **Start the server**:
    ```bash
    npm start
    ```

## How to Use It

The backend exposes a Socket.IO server that the frontend can connect to. The server emits two main events:

-   **`new_notification`**: This event is emitted whenever a new notification is generated. The payload is an object with `type` and `message` properties.
-   **`bidding_ended`**: This event is emitted when the auction ends. The payload is the `winner` object.

To see the notifications on the frontend, you'll need to connect to the Socket.IO server and listen for these events.

## What You Need to Get It Working

-   **Node.js and npm**: The backend is a Node.js application.
-   **OpenAI API Key**: If you want to use the LLM-based notification generator, you'll need an OpenAI API key.
-   **Solana RPC URL**: If you're not using the mock listener, you'll need a Solana RPC URL to connect to the blockchain.
