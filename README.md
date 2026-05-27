# fun_project
I encountered many issues trying to dockerize this project's stack. Here's the summary of issues i faced and how i resolved them:

Issue 1 — role "admin" does not exist
What happened: Postgres refused the connection saying the admin user didn't exist even though you passed -e POSTGRES_USER=admin.
Why it happened: You had a stale container from a previous run. Postgres only reads the POSTGRES_USER environment variable on first boot when the data directory is empty. If a container with that name already existed with old state, it ignored the new env vars entirely.
Fix: docker stop + docker rm the old container before recreating it. Or docker-compose down -v to also wipe the volume.
Lesson: Environment variables like POSTGRES_USER are init-time config, not runtime config. They only work on a fresh database. If you ever change credentials, you must wipe the volume too.

Issue 2 — Homebrew Postgres stealing port 5432
What happened: Your Python script kept hitting the wrong Postgres — the one installed natively via Homebrew, not the Docker container.
Why it happened: Both were listening on port 5432. When your script connected to localhost:5432, your Mac's networking stack sent it to whichever process got there first — which was Homebrew's native Postgres, not Docker's.
Fix: brew services stop postgresql@14 to kill the native one so only Docker's was running.
Lesson: Port conflicts are silent and confusing. Always check docker ps and brew services list if a connection behaves unexpectedly. In production this never happens because you're on a clean server with nothing else running.

Issue 3 — could not translate host name "db"
What happened: FastAPI inside Docker couldn't find the Postgres container even though both were running.
Why it happened: Two separate sub-problems:

The DATABASE_URL env var was being set in docker-compose.yml but main.py wasn't reading it — it was still hardcoded to localhost
Inside Docker, containers don't talk to each other via localhost. They use the service name as the hostname — so db not localhost

Fix: os.getenv("DATABASE_URL", "fallback") in both main.py and fun_project.py so Docker passes db as the host and local dev falls back to localhost.
Lesson: localhost inside a container means that container itself, not your Mac, not other containers. Container-to-container communication always uses service names defined in docker-compose.yml.

Issue 4 — Postgres volume format error (v18 incompatibility)
What happened: The happiness-db container kept crashing with a message about data directory format being incompatible.
Why it happened: Docker pulled postgres:latest which resolved to Postgres 18. Version 18 changed where it stores data inside the volume — it now uses /var/lib/postgresql/18/ instead of /var/lib/postgresql/data/. The old volume mount path /var/lib/postgresql/data pointed to the wrong place.
Fix: Changed the volume mount in docker-compose.yml to /var/lib/postgresql (without /data) so Postgres 18 could manage its own subdirectory structure.
Lesson: Never use postgres:latest in real projects — pin a specific version like postgres:15. latest can pull a breaking major version upgrade silently and corrupt your data directory.

Issue 5 — happiness table doesn't exist in Docker Postgres
What happened: FastAPI was running fine but every query failed saying the happiness table didn't exist.
Why it happened: We loaded the data locally by running fun_project.py on your Mac against your local Postgres. Docker Compose spun up a brand new empty Postgres container with no data in it. The two databases are completely separate.
Fix: Added fun_project.py and the CSVs to the backend Docker image and ran the data loading script as part of the container startup command before uvicorn launches.
Lesson: Docker containers start fresh every time unless you explicitly seed them. Any data loading step that you ran manually locally needs to be part of the container startup or an init script. Never assume local state exists inside Docker.

Issue 6 — Race condition: backend starts before Postgres is ready
What happened: fun_project.py ran immediately when the backend container started, tried to connect to Postgres, and got Connection refused because Postgres hadn't finished booting yet.
Why it happened: depends_on in Docker Compose only waits for the container to start, not for the service inside it to be ready. Postgres takes a few seconds to initialize after the container starts, but the backend didn't know to wait.
Fix: Added a retry loop in fun_project.py that tries to connect every 3 seconds up to 10 times before giving up.
Lesson: depends_on is not a health check. For any service that depends on a database being ready, you need explicit retry logic or a proper health check in docker-compose using healthcheck and condition: service_healthy.

The meta-lesson
Most of your Docker pain came down to three recurring themes:
State — Docker containers look stateless but volumes carry state across restarts. When things go wrong, docker-compose down -v is your friend.
Networking — localhost means different things in different contexts. On your Mac it's your Mac. Inside a container it's that container. Between containers it's the service name.
Environment parity — anything you do manually on your Mac (loading data, installing packages, setting credentials) needs to be explicitly reproduced inside the container. Docker doesn't know about your local state.
