[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/nRotxcOW)
# NodeJS - Lab Day 1

**Goal:** Create a mini user profile system using Node.js and Express (MVC pattern) for the backend and Astro for the frontend/view.

## Instructions

1. Run `npm install` for both the **backend** and **frontend** directories to install the necessary packages. Some of the starter files have also been added in already such as `.env` and `tsconfig.json` so that you no longer have to create them yourself.
2. Create your server, routes, controllers, and models inside your backend. You have full control over your backend so feel free to add or create your own functions/methods if necessary:
  
    **Model (`src/models/user.model.ts`)**

    *Fields:*
    - id (string uuid)
    - username (string)
    - password (string encrypted)
    - firstname (string)
    - lastname (string)

    *Methods*
    - findAll()
    - findById(id)
    - findByUsername(username)
    - create()
    - update(id)
    - delete(id)

    ---

    **Controller (`src/models/user.controller.ts`)**
    - getUsers()
    - getUserById()
    - getUserByUsername()
    - addUser()
    - updateUserById()
    - deleteUserById()
    - checkAuth()
    - logoutUser()

    ---

    **Routes (`src/routes/user.routes.ts`)**
    - `POST /signup` = add user
    - `POST /login` = check if username exist, return cookie/s with auth, id/username (sending id/username as a cookie with cookie-parser is not usually a good practice as it exposes the data! Using session-cookie, or JWT is safer.)
    - `GET /logout` = clear the cookies
    - `GET /check-auth` = check auth cookie/s
    - `GET /users` = get all users
    - `GET /user/:id` = get user by id
    - `PUT /user/:id` = update user by id
    - `DELETE /user/:id` = delete user by id

    ---

    *References:*
    - [https://github.com/elmerdotdev/ciccc-node-js-mvc-code-along]
    - [https://github.com/elmerdotdev/ciccc-node-js-cookie-fe-be-code-along]
    - [https://github.com/elmerdotdev/ciccc-node-js-jwt-cookie]

3. Make sure that you set up your CORS middleware on your `server.ts` so that your frontend can communicate with your backend.

    ```js
    app.use(cors({
      origin: 'http://localhost:4321', // Astro port
      credentials: true // allow cookies
    }))
    app.use(cookieParser('your-key')) // or use cookie-session/cookieSession instead
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    ```

4. Test your backend routes using [Postman](https://www.postman.com/) or similar software to verify that everything is working correctly.
5. On your Astro frontend, create 3 pages:
    - Login (`/login`): Login form with username and password.
    - Register (`/register`): Signup form with username, password, firstname, and lastname fields.
    - Profile (`/profile`): A protected page that should only display information if the user is authenticated or logged in.
6. When a user successfully logs in, they should be redirected to the profile page. The profile page should just display user data and a logout button. Due to time-constraints, no need to build edit and delete functionality:
    - Username
    - First name
    - Last name
    - Logout button
7. Clicking on the logout button will send a request to the backend `/logout` route and then on the frontend, redirect the user to the login page.
8. Commit and push your changes once you are done.

Good luck!
