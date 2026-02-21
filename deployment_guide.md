# QuickSkillr Deployment Guide 🚀

Follow these steps to get your project live and shareable.

## 1. Deploy the Backend (Render)
**Render** is great for hosting Node.js servers.

1.  Create a Free account on [Render.com](https://render.com).
2.  Click **New +** > **Web Service**.
3.  Connect your GitHub repository.
4.  **Configuration:**
    -   **Root Directory:** `backend`
    -   **Build Command:** `npm install`
    -   **Start Command:** `npm start`
5.  **Environment Variables (CRITICAL):**
    Click **Advanced** and add:
    -   `MONGO_URI`: (Your MongoDB link)
    -   `JWT_SECRET`: (Your secret key)
    -   `FRONTEND_URL`: `https://your-app-name.vercel.app` (Add this *after* deploying frontend)
6.  **Deploy!** You will get a link like `https://quickskillr-backend.onrender.com`.

---

## 2. Deploy the Frontend (Vercel)
**Vercel** is the best place for React/Vite apps.

1.  Create an account on [Vercel.com](https://vercel.com).
2.  Click **Add New** > **Project**.
3.  Import your GitHub repository.
4.  **Configuration:**
    -   **Root Directory:** `frontend`
    -   **Framework Preset:** Vite
5.  **Environment Variables:**
    Add:
    -   `VITE_API_URL`: `https://quickskillr-backend.onrender.com` (Use your Render link from Step 1)
6.  **Deploy!** You now have your live project link.

---

## 3. The Final Handshake
Once your frontend is live (e.g., `https://my-app.vercel.app`):
1.  Go back to your **Render Dashboard** (Backend).
2.  Add/Update the `FRONTEND_URL` variable with your live Vercel link.
3.  This allows the Chat and API to communicate securely across different domains.

> [!NOTE]
> I have already updated your code to support these Environment Variables (`VITE_API_URL` and `FRONTEND_URL`). Just enter them in the dashboards and it will work!
