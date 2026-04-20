# AI Powered Resume Builder

A full-stack MERN application that allows users to create professional resumes with AI assistance (OpenAI integration). Built with React (Vite), Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure JWT-based login and registration.
- **Resume CRUD**: Create, read, update, and delete multiple resumes per user.
- **AI Integration**:
  - Automatically generate a professional summary based on job title and experience.
  - Polish and improve bullet points to make them more impactful.
  - Suggest relevant skills based on the target job role.
- **Live Preview & PDF Export**: See your resume update in real-time and export it as a highly formatted PDF.
- **Responsive & Modern Design**: Clean UI built with Tailwind CSS.

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Axios, html2pdf.js, Lucide Icons
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), OpenAI API, express-rate-limit, Helmet, Cors

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- OpenAI API Key (Optional: App uses mock data if no key is provided)

### Local Development Setup

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repo-url>
   cd ai-resume-builder
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Copy .env.example to .env and fill in your details
   cp .env.example .env
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   # Copy .env.example to .env
   cp .env.example .env
   npm run dev
   ```

4. **Access the application:**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Docker Setup
You can run the entire application stack using Docker Compose.

```bash
docker-compose up --build
```
This will start MongoDB, the Node.js backend on port 5000, and the React frontend on port 80.
Access the app at [http://localhost](http://localhost).

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user and get JWT
- `GET /api/auth/me` - Get current logged in user (Protected)

### Resumes
**Headers Required:** `Authorization: Bearer <token>`
- `GET /api/resumes` - Get all resumes for user
- `GET /api/resumes/:id` - Get specific resume
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update existing resume
- `DELETE /api/resumes/:id` - Delete resume

### AI Assistance
**Headers Required:** `Authorization: Bearer <token>`
- `POST /api/ai/generate-summary` - Generates a resume summary. Body: `{ title, experience }`
- `POST /api/ai/improve-bullets` - Polishes experience bullet points. Body: `{ text, role }`
- `POST /api/ai/suggest-skills` - Suggests relevant skills. Body: `{ role }`

## Deployment

### Backend (Render / Heroku)
1. Push the repository to GitHub.
2. Create a new Web Service on Render and connect your repo.
3. Set the Root Directory to `backend`.
4. Set Build Command to `npm install` and Start Command to `node server.js`.
5. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `OPENAI_API_KEY`).

### Frontend (Vercel / Netlify)
1. Create a new project on Vercel and import your repo.
2. Set the Root Directory to `frontend`.
3. Vercel will automatically detect Vite and set the build command to `npm run build`.
4. Add the `VITE_API_URL` environment variable pointing to your deployed backend.

## License
MIT License
