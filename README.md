
# Setup

```bash
# pull the project
git clone git@github.com:mikeshuh/OFS.git

# move to root directory
cd OFS

# run docker container
docker compose up
```

To verify if the service started successfully, run the following command

```bash
docker logs -f ofs-server-1
```

The following message shows that the container started successfully
```
Connected to Redis server
Redis client connected
Restored 0 unqueued orders from the database.
Server running in development mode on port 4000
http://localhost:4000
```

Upon successful setup, you should be able to view the website on `localhost:5173`
