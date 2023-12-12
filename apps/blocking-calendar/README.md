# Blocking Calendar - Web and Server

This project encompasses both the frontend (web) and backend (server) components of an Blocking Calendar service. The web part is implemented using Turbo + Chakra-Ui + React Js + TypeScript, and the server part is built with Node.js, Express and TypeScript.

## Table of Contents

-   [Web Installation](#web-installation)
-   [Server Installation](#server-installation)
-   [Usage](#usage)
-   [Web Directory Structure](#web-directory-structure)
-   [Server Directory Structure](#server-directory-structure)
-   [Components](#components)
-   [Contributing](#contributing)
-   [License](#license)

## Web Installation

1.  Navigate to the web directory:

    ```bash
    cd apps/blocking-calendar
    ```

2.  Install dependencies:

    ```bash
    pnpm install
    ```

3.  Create a `.env.development.local` file in the server directory and add the following environment variable:

        ```env
        NODE_ENV=development

        PORT=8080
        TWILIO_ACCOUNT_SID=ACb90a62a2cf5ba4eae89ac903feb61674
        TWILIO_AUTH_TOKEN=2cff438ffb515f2c40419c403d5edfb8
        TWILIO_MOBILE=+16122840913
        MONGODB_URI=mongodb+srv://officialsiddharthbisht:mongodbpassword@cluster0.jpsasfp.mongodb.net
        COOKIE_DOMAIN=localhost
        SESSION_SECRET=u1ai!@89A
        OPENAI_API_KEY=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
        CLIENT_ID ='238750836275-mgmlbffeuunblc2i3p4ps9b7ji495u5i.apps.googleusercontent.com'
        CLIENT_SECRET='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'
        REDIRECT_URI='http://localhost:8080/redirect' (whatever redirect uri is set in your google console)
        NODE_ENV=8080
        API_KEY='AIzaSyB2ZPGaT4vW2h6GqrV8pofcg7HLvntCMnk' (whatever api key is set in your google console)
        app_pass= 'yqyq vgav xzlf qvup'

````

    Replace the `http://localhost:8080` with the URL of your backend API.

4. Start the development server:

    ```bash
    pnpm start
    ```

    The React app should be running at [http://localhost:3000](http://localhost:3000).
    Google Auth will automatically redirect you to the frontend.

## Server Installation

1. Navigate to the server directory:

    ```bash
    cd server
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```


3. Start the server:

    ```bash
    pnpm run dev
    ```
    or
    ```bash
    pnpm start
    ```

    The server should be running at [http://localhost:3000](http://localhost:3000).
    Google oAuth2 will automatically redirect you to the frontend.

## Usage

### Web

#### Auth Page

The auth page allows users to user their google account.

1. Select your gmail/email id.
2. Click on the "Allow" button.
3. Wait for the server to redirect you to the frontend


### Server

-   ** Create a new Event:**

    ```http
    POST /event/schedule_event
    ```
     ```
     {
        summary: "",
		description: "",
		startDateTime: "",
		endDateTime: "",
		location: "",
		attendees: [],
     }
    ```
-   ** List all the events of a specific user:**

    ```http
    GET /event/list-events/:email
    ```

    ```http
    PUT /event/update-event/:eventId
    ```
    ```
    {
        summary: "",
		description: "",
		startDateTime: "",
		endDateTime: "",
		location: "",
		attendees: [],
    }
    ```
-   ** Update a specific event of the user:**

    ```http
    GET /event/delete-event/:eventId
    ```
    ** Delete a specific event of the user:**



## Web Directory Structure

The project is organized with the following structure:

-   **components:** Contains React components for login.
-   **helper:** Contains utility functions used across components.
-   **index.tsx:** Entry point for the React app.
-   **App.css:** Styling of all our components



## Server Directory Structure

-   **controllers:** Contains the main logic for oAuth2 using google developer console.
-   **middlewares:** Includes middleware for auth.
-   **routes:** Defines the Express routes.
-   **utils:** Contains utility functions and test cases.

## Components

### Auth Component

The Auth component is provided by the google oAuth2.


## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests.

## License

This project is licensed under the [Nolan Edutech Pvt. Ltd.](LICENSE).
````
