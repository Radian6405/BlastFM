
# BlastFM

All-in-one platform to organize, track, and enhance your music experience. Manage playlists, monitor listening trends, and gain insights—all in one seamless hub.

## Screenshots
![image](https://github.com/user-attachments/assets/840520ab-0b1e-4ae7-a349-77b4a4bbec8e)

![image](https://github.com/user-attachments/assets/32cb85a7-186c-4417-8ee8-dac79ad3cbc8)

![image](https://github.com/user-attachments/assets/70936422-e230-4965-9209-740dff29796a)

![image](https://github.com/user-attachments/assets/0d4358e7-58ec-4743-9fc8-c14072e1b627)


## Tech Stack

**Client:** 
* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
* ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
* ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
* ![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Server:**
* ![Node](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
* ![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
* ![Postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
* ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)
* ![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## Installation

### Frontend

1. Install dependencies 
    ```bash
    cd client
    npm install
    ```

2.  Run ```npm run dev``` to start the server.

3.  Your frontend server should be running run on [http://127.0.0.1:5173](http://127.0.0.1:5173/).

### Backend & Database

1. Install [`Docker`](https://www.docker.com/)

2. Create a `.env` file in the root directory and fill it with [environment variables](#environment-variables).  

3. Run `docker-compose --env-file .env up` in the same directory

4. Docker should start running your `server`, `database` & `cache` containers


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
POSTGRES_HOST=postgres-c
POSTGRES_PORT=5000
POSTGRES_USER=<postgres username>
POSTGRES_PASSWORD=<postgres username>
POSTGRES_DB=blastfm

SERVER_HOST=server-c
SERVER_PORT=8000

JWT_TOKEN_SECRET=<random string>
JWT_TOKEN_LIFETIME=1d

SPOTIFY_CLIENT_ID=<spotify client id>
SPOTIFY_CLIENT_SECRET=<spotify client secret>

REDIS_HOST=cache-c
REDIS_PORT=6379
REDIS_USERNAME=<redis username>
REDIS_PASSWORD=<redis password>
REDIS_DISABLE_DEFAULT_USER="true"
REDIS_DATABASES=1
```

