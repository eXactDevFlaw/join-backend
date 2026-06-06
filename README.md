# Join – Backend

REST API for the Join Kanban task manager, built with Node.js and Express.

## Tech Stack

- Node.js + Express.js
- PostgreSQL
- JWT Authentication
- bcrypt (password hashing)
- Docker / docker-compose

## Project Structure
```
├── db/           # Database connection and queries
├── middleware/   # Auth and validation middleware
├── routes/       # API route definitions
├── server.js     # Entry point
```


## Getting Started

### With Docker (recommended)

```
git clone https://github.com/eXactDevFlaw/join-backend.git
cd join-backend
cp .env.example .env   # fill in your values
docker-compose up
```

### Without Docker
```
npm install
npm run dev
```

Requires a running PostgreSQL instance. Configure the connection in .env.

### Environment Variables
```
PORT=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
```

### Related

Frontend: [Frontend](https://github.com/eXactDevFlaw/join-frontend)

Live: [join.lutz-boelling.de](https://join.lutz-boelling.de)


