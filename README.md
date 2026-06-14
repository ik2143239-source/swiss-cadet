# Swiss International Cadet College — Management System

Principal: **Hafiz Muhammad**
Created by: **Hasnain** & **Bilal Azam**

A full-stack school management app with:
- Teacher records (add/remove)
- Student attendance (Present/Absent/Leave)
- Fees (Paid/Unpaid, click badge to toggle)
- Homework assignments
- Results with auto percentage & grade
- Dashboard stats

---

## Project Structure

```
swiss-cadet/
├── package.json          (root - for deployment, points to backend)
├── backend/
│   ├── server.js         (Express API)
│   ├── db.js              (SQLite database setup)
│   ├── package.json
│   ├── .env.example
│   └── swiss_cadet.db    (created automatically on first run)
└── frontend/
    ├── index.html
    └── config.js          (set your backend URL here)
```

---

## 1. Run Locally (Backend)

1. Open a terminal in the `backend` folder.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file (copy from `.env.example`):
   ```
   PORT=5000
   JWT_SECRET=swiss_cadet_super_secret_key_change_this
   ```
4. Start the server:
   ```
   npm start
   ```
5. You should see: `Swiss International Cadet College API running on port 5000`
6. Test it by visiting: `http://localhost:5000` in your browser.

---

## 2. Run Locally (Frontend)

1. Open `frontend/config.js` and confirm:
   ```js
   const API_BASE_URL = "http://localhost:5000";
   ```
2. Open `frontend/index.html` directly in your browser (double-click it), or serve it with any static server.
3. The "Server connected" badge in the top-right confirms the frontend can reach the backend.

---

## 3. Deploy the Backend (e.g., Bonto / Render)

Same approach as your EduTrack deployment:

1. Push the **whole `swiss-cadet` folder** (including the root `package.json`) to a GitHub repo, e.g. `swiss-cadet-college`.
2. On Bonto/Render, create a new Web Service from this repo.
3. Set:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Add environment variables on the hosting dashboard:
   - `PORT` (usually auto-set by the host)
   - `JWT_SECRET` = any long random string
5. Once deployed, note your backend URL, e.g. `https://swiss-cadet-backend.onrender.com`

> The root `package.json` points to `backend/server.js`, the same workaround used for EduTrack to handle the subfolder structure.

---

## 4. Deploy the Frontend (Netlify Drop)

1. Open `frontend/config.js` and update:
   ```js
   const API_BASE_URL = "https://your-backend-url-here";
   ```
2. Go to [Netlify Drop](https://app.netlify.com/drop).
3. Drag the **`frontend` folder** (containing `index.html` and `config.js`) onto the page.
4. Netlify gives you a live URL — your app is now online.

---

## API Endpoints Reference

| Method | Endpoint              | Description              |
|--------|-----------------------|---------------------------|
| GET    | `/api/teachers`        | List all teachers |
| POST   | `/api/teachers`        | Add a teacher |
| PUT    | `/api/teachers/:id`    | Update a teacher |
| DELETE | `/api/teachers/:id`    | Remove a teacher |
| GET    | `/api/attendance`      | List attendance records |
| POST   | `/api/attendance`      | Add attendance record |
| DELETE | `/api/attendance/:id`  | Remove attendance record |
| GET    | `/api/fees`            | List fee records |
| POST   | `/api/fees`            | Add fee record |
| PUT    | `/api/fees/:id`        | Update fee status |
| DELETE | `/api/fees/:id`        | Remove fee record |
| GET    | `/api/homework`        | List homework |
| POST   | `/api/homework`        | Add homework |
| DELETE | `/api/homework/:id`    | Remove homework |
| GET    | `/api/results`         | List results (with % and grade) |
| POST   | `/api/results`         | Add result |
| DELETE | `/api/results/:id`     | Remove result |
| GET    | `/api/stats`           | Dashboard stats summary |

---

## Notes

- The database file `swiss_cadet.db` is created automatically the first time the server runs — no manual setup needed.
- All deletions are permanent (no undo) — a confirmation prompt appears before removing records.
- If "Server offline" shows in the header, check that the backend is running and `API_BASE_URL` in `config.js` matches it.
