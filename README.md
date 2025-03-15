# OFS

### Important Note
1. When updating a new feature for the project, make sure to pull from the master branch. Do NOT work from a branch that has not been merged to master branch even if it is ahead of the master branch.

### Trouble Shooting
- The pinned message in discord will be updated on a regular basis. If you see an error about a variable you didn't setup, check discord and update your .env.
- The database structure is still subject to change. There might be some updates in the structure. If you see an error about the database, drop all the tables you have created and run the schema.sql file inside your local database.
- The 5000 port for Mac users has been taken. The server is likely to be run on port 5001. Adjust the VITE_API_URL in the .env file in client side if this issue occurs.

1. Git setup instructions:
- Generate your ssh-key
- Add your ssh public key to github page "https://github.com/settings/keys"
- Run command ```git clone git@github.com:mikeshuh/OFS.git```
- When finish editing, run the command ```git checkout -b <new_branch>``` before you push. 
- Keep all the relevant work for one feature in the same branch. Do NOT open multiple branches for the same feature. Do NOT work on someone else's branch

2. MySQL setup instructions:
- Download MySQL Server, MySQL Workbench and MySQL Client from ```https://www.mysql.com/downloads/```
- Create your username and password for local database
- Connect to the database in MySQL Workbench / in VSCode with the extension MySQL
- Copy and execute the schema.sql script in your database to setup

3. Client side setup instructions:
- In the client folder, run the command ```npm install vite react-router-dom react jwt-decode axios```
- - If npm is not found on your computer, refer to [Download npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) page for downloading 
- Run the command ```npm run dev``` to start the client

4. Server side setup instructions:
- In the server folder, run the command ```npm install express redis dotenv @mapbox/mapbox-sdk```
- For redis setup:
- - Windows: execute the following commands in powershell
```
# Install WSL
wsl --install

# Launch WSL and create defualt Unix user accnt w password
wsl.exe -d Ubuntu

# In WSL terminal
sudo apt update
sudo apt upgrade
sudo apt install redis-server

# Start Redis
sudo service redis-server start

# Verify install (should output 'PONG')
redis-cli ping

# Stop Redis
sudo service redis-server stop
```
- - For Mac, refer to [Documentation for redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-mac-os/) to setup
- Run the command ```node server.js``` to start the server
- __For specific instructions regarding usage of the requests in the server, refer to the README.md inside the server folder__

5. Connecting to VM
- The VM we are using is the Oracle Cloud Free Tier, 4-core, 24GB memory machine
- Copy the oracle_new.key and oracle_new.key.pub from discord pinned message to your local .ssh file 
- - The file path should look something like ```C:\Users\<Your Device>\.ssh```(For Windows). If you are unsure, open a new terminal window and run the command ```cd .ssh```. This will be the directory you want to have the keys
- Connect to the VM using the command ```ssh -i ~/.ssh/oracle_key.key ubuntu@137.131.47.205```. 

6. Connecting to MySQL on VM
- Inside the VM, run the command ```mysql -hmysql.subnet03010056.vcn03010056.oraclevcn.com -P3306 -uadmin -p``` to connect to MySQL Server. Password is posted in discord
- If you would like to connect to the database in VSCode, you would first need to connect to the VM by searching the command ```>Remote-SSH: Connect to Host``` in the top search bar and connect to the VM. In VM, use the Hostname ```mysql.subnet03010056.vcn03010056.oraclevcn.com```, Username ```admin```, and the Password provided in discord to connect

7. .env setup
- You are suppose to have a .env file in both the root folder of client and server
- Copy and paste the pinned message for .env inside discord to setup
