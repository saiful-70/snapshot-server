# Snapshot Server

This is the server of [snapshot](https://github.com/saiful-70/snapshot).

## How to run

- Clone the repository and go to this repository on your machine.
- You need to create an account to [cloudinary](https://cloudinary.com/) for image uploading.
- You also need another account to [mongodb atlas](http://mongodb.com/) for creating a cluster or you can install mongodb on your machine.
- In the project you will see **.env.example** file, rename it to **.env** and edit that file as instructed.
  Then open [http://localhost:3001](http://localhost:3001) with your browser to see the result.
- Then run

```bash
npm install or yarn
npm start or yarn start
```

- If you want to connect this server with a frontend, you can go through [this repository](https://github.com/saiful-70/snapshot).

## Tools

- **expressjs** - as backend minmal framework
- **mongodb** - as database
- **socket.io** - for real time data sharing
- **cloudinary** - for uploading image to cloud
