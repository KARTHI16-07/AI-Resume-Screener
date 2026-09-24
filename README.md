# AI Resume Screener & Job Matcher

A full-stack web application that helps recruiters compare resumes with job descriptions and rank candidates by relevance using AI-powered scoring.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green) ![FastAPI](https://img.shields.io/badge/FastAPI-0.110-teal) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  React SPA  │────▶│  Spring Boot API  │────▶│  FastAPI Scoring  │
│  (Vite)     │     │  (Java 17)        │     │  (Python 3.12)   │
│  Port 5173  │     │  Port 8080        │     │  Port 8001       │
└─────────────┘     └────────┬─────────┘     └──────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   PostgreSQL     │
                    │   (or H2 dev)    │
                    └──────────────────┘
```

## Features

- **Recruiter Authentication** — Register/login with JWT-based security
- **Job Management** — Create, edit, delete job descriptions with requirements
- **Resume Upload** — Drag-and-drop multiple PDF/DOCX files with validation
- **AI Scoring** — TF-IDF + cosine similarity matching with skill extraction
- **Candidate Ranking** — Sort, filter, and search candidates by score
- **Score Explanation** — Matched skills, missing skills, and detailed explanations
- **Resume Download** — Secure access to original uploaded resumes
- **Responsive Dashboard** — Clean UI for desktop and mobile

## Quick Start (Local Development)

### Prerequisites

- Java 17+ and Maven 3.9+
- Python 3.10+ with pip
- Node.js 18+ and npm

### 1. Start the Scoring Service

```bash
cd scoring-service
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

Verify: http://localhost:8001/health

### 2. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend uses H2 in-memory database by default (dev profile).
- API: http://localhost:8080/api/health
- Swagger UI: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:testdb`, user: `sa`, password: `password`)

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

### 4. Test the Workflow

1. Register at http://localhost:5173/register
2. Login with your credentials
3. Create a new job with a title, description, and requirements
4. Upload PDF or DOCX resumes
5. View ranked candidates with scores and explanations
6. Click a candidate to see detailed skill matching
7. Download original resumes or delete candidates

## Docker Compose (Full Stack)

```bash
docker-compose up --build
```

This starts all four services:
- Frontend: http://localhost
- Backend API: http://localhost:8080
- Scoring Service: http://localhost:8001
- PostgreSQL: localhost:5432

## Project Structure

```
ai-resume-screener/
├── docker-compose.yml
├── README.md
│
├── scoring-service/           # Python FastAPI
│   ├── main.py               # FastAPI app (/score, /health)
│   ├── scorer.py             # TF-IDF scoring engine
│   ├── models.py             # Pydantic schemas
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── backend/                   # Java Spring Boot
│   ├── pom.xml
│   ├── Dockerfile
│   ├── .env.example
│   └── src/main/
│       ├── java/com/resumescreener/
│       │   ├── controller/    # REST controllers
│       │   ├── service/       # Business logic
│       │   ├── entity/        # JPA entities
│       │   ├── repository/    # Data access
│       │   ├── security/      # JWT auth
│       │   ├── dto/           # Request/response DTOs
│       │   ├── config/        # App configuration
│       │   └── exception/     # Error handling
│       └── resources/
│           ├── application.yml
│           ├── application-dev.yml
│           ├── application-prod.yml
│           └── schema.sql     # PostgreSQL DDL
│
└── frontend/                  # React (Vite)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── Dockerfile
    ├── nginx.conf
    ├── .env.example
    └── src/
        ├── api/client.js      # Axios + interceptors
        ├── context/           # Auth context
        ├── pages/             # Route pages
        ├── components/        # Reusable UI
        └── styles/            # CSS
```

## API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new recruiter |
| POST | `/api/auth/login` | Login and receive JWT |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List all jobs for current user |
| POST | `/api/jobs` | Create a new job |
| GET | `/api/jobs/{id}` | Get job details |
| PUT | `/api/jobs/{id}` | Update a job |
| DELETE | `/api/jobs/{id}` | Delete job + all candidates |
| GET | `/api/jobs/{id}/candidates` | List candidates for a job |

### Candidates
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs/{id}/candidates/upload` | Upload resume files (multipart) |
| GET | `/api/candidates/{id}` | Get candidate details + score |
| GET | `/api/candidates/{id}/resume` | Download original resume |
| DELETE | `/api/candidates/{id}` | Delete candidate + file |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Backend health check |
| GET | `/health` (scoring service) | Scoring service health check |

Interactive API docs available at `/swagger-ui.html` when the backend is running.

## Environment Variables

### Backend (`backend/.env.example`)
| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | 256-bit secret for JWT signing | Dev default provided |
| `DATABASE_URL` | PostgreSQL JDBC URL | H2 in dev |
| `DB_USERNAME` | Database username | `sa` (H2 dev) |
| `DB_PASSWORD` | Database password | `password` (H2 dev) |
| `SCORING_SERVICE_URL` | Python scoring service URL | `http://localhost:8001` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173` |
| `UPLOAD_DIR` | Directory for uploaded resumes | `./uploads` |
| `PORT` | Server port | `8080` |

### Scoring Service (`scoring-service/.env.example`)
| Variable | Description | Default |
|----------|-------------|---------|
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:8080` |
| `HOST` | Bind host | `0.0.0.0` |
| `PORT` | Service port | `8001` |

### Frontend (`frontend/.env.example`)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | (empty, uses Vite proxy) |

## Database

### Development
Uses H2 in-memory database with auto-schema creation via JPA `ddl-auto: update`.

### Production
Uses PostgreSQL. Run `schema.sql` to create tables:

```bash
psql -U postgres -d resume_screener -f backend/src/main/resources/schema.sql
```

## Deployment (Render)

### Step 1: Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create a new **PostgreSQL** database
3. Note the Internal Database URL

### Step 2: Deploy Scoring Service
1. Create a new **Web Service** → connect your repo
2. Root directory: `scoring-service`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set environment variable: `ALLOWED_ORIGINS` = your backend URL

### Step 3: Deploy Backend
1. Create a new **Web Service** → Docker
2. Root directory: `backend`
3. Set environment variables:
   - `SPRING_PROFILES_ACTIVE` = `prod`
   - `DATABASE_URL` = PostgreSQL JDBC URL from Step 1
   - `DB_USERNAME` = from Step 1
   - `DB_PASSWORD` = from Step 1
   - `JWT_SECRET` = generate a 256-bit secret
   - `SCORING_SERVICE_URL` = scoring service URL from Step 2
   - `CORS_ALLOWED_ORIGINS` = your frontend URL
   - `UPLOAD_DIR` = `/app/uploads`

### Step 4: Deploy Frontend
1. Create a new **Static Site** → connect your repo
2. Root directory: `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Set environment variable: `VITE_API_URL` = backend URL from Step 3

### Step 5: Verify
1. Open your frontend URL
2. Register a new account
3. Create a job, upload resumes, verify scores appear

## AI Scoring Details

The scoring service uses **TF-IDF (Term Frequency–Inverse Document Frequency)** with **cosine similarity** to compare resumes against job descriptions.

### How it works
1. Both texts are vectorized using TF-IDF, which weighs terms by importance
2. Cosine similarity measures the angle between the two vectors (0–1)
3. Key terms from the job description are checked against the resume
4. Score is normalized to 0–100

### Extending the scorer
The scorer uses a modular design with an abstract `BaseScorer` class. To add a stronger model:

```python
from scorer import BaseScorer

class BertScorer(BaseScorer):
    def score(self, job_description, resume_text):
        # Your implementation here
        pass
```

> ⚠️ **Disclaimer**: Scores are provided as decision-support only and do not represent objective hiring recommendations. Always review resumes manually.

## Security & Privacy

- Passwords are hashed with BCrypt
- JWT tokens expire after 24 hours
- Resume access requires authentication and job ownership verification
- Resume text content is never logged
- Files are stored on disk, not in the database
- Candidates and files can be fully deleted
- CORS is configured per environment

## License

This project is for portfolio/educational purposes.
