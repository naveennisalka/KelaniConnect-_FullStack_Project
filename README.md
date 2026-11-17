# KelaniConnect

## Project layout

- `kelani-media/frontend` — React and Vite application
- `kelani-media/backend` — Spring Boot API and MongoDB persistence

## Local configuration

Copy each template into its own application folder and fill in the values:

```powershell
Copy-Item -NoClobber .\kelani-media\frontend\.env.example .\kelani-media\frontend\.env
Copy-Item -NoClobber .\kelani-media\backend\.env.example .\kelani-media\backend\.env
```

Set `MONGODB_URI` in the backend `.env` to the Atlas URI, including the database
path (`/kelaniMedia`) and connection options. URL-encode special characters in
the database password. Set a private `JWT_SECRET` of at least 32 bytes. Never
commit either `.env` file.

The frontend uses the Vite `/api` proxy to reach `http://localhost:8080` by
default. `VITE_API_BASE_URL` can be set to a deployed API URL when needed.

## Run

Start the backend from PowerShell:

```powershell
Set-Location .\kelani-media\backend
.\mvnw.cmd spring-boot:run
```

In another terminal, start the frontend from the repository root:

```powershell
npm run dev
```

## MongoDB collections and access

The API persists users, friend requests, posts and comments, jobs and job
applications, and campus events. Signups receive the `STUDENT` role. To permit
trusted accounts to publish jobs or events, assign a `roles` array to the
corresponding user document in MongoDB Atlas:

- `ADMIN` — can publish jobs and events
- `TEACHER` — can publish jobs
- `EVENT_ORGANIZER` — can publish events

Store roles as an array on the user document, for example `roles: ["TEACHER"]`.
Sign out and back in after changing roles so the frontend updates its publishing controls.

Profile photos, post/event images, and work submissions currently use HTTPS
URLs; file uploads and cloud storage are not configured.
