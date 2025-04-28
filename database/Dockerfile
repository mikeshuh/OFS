# MySQL Docker Image with Pre-seeded Data
FROM mysql:8.0

# Copy schema and seed SQL files
COPY schema.sql /docker-entrypoint-initdb.d/01-schema.sql
COPY seed.sql /docker-entrypoint-initdb.d/02-seed.sql
