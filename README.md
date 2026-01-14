# Vibe Check API 

A simple, robust REST API for real-time polling. This project allows users to create polls, view results, and cast votes with strict data integrity checks.

## How to Run

1.  **Prerequisites**: Ensure you have Node.js installed.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start the Server**:
    ```bash
    node server.js
    ```
    The API will run on `http://localhost:3000`. The SQLite database (`polls.db`) will be created automatically upon the first run.

##  API Endpoints

* `POST /polls`: Create a new poll.
    * Body: `{ "question": "...", "options": ["...", "..."] }`
* `GET /polls/:id`: View a poll and current vote counts.
* `POST /polls/:id/vote`: Vote for an option.
    * Body: `{ "user_id": "...", "option_id": ... }`

##  Technical Implementation: The "One Vote" Logic

To fulfill the requirement of preventing duplicate votes from the same user, I utilized **Database-Level Constraints** rather than purely application-level checks.

* **Schema Design**: The `votes` table has a `UNIQUE` constraint on the pair `(user_id, poll_id)`.
* **Behavior**: If a user attempts to vote a second time on the same poll, the SQLite database rejects the insertion with a constraint violation.
* **Error Handling**: The API catches this specific error and returns a clean `403 Forbidden` response to the client.

This ensures data integrity even under high concurrency.