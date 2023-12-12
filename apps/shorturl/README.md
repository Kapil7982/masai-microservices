# URL Shortener App

Welcome to the URL Shortener App! This application allows users to generate shortened URLs, manage their creations, and view details for each URL. Additionally, the app provides the functionality to update expiration dates, titles, and descriptions for enhanced customization. QR codes are automatically generated for each URL to facilitate easy sharing.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB database

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/nolan-projects/modular-services.git
    ```

2. Install dependencies:

    ```bash
    cd apps
    cd shorturl
    ```

3. Set up the MongoDB database:

    - Create a MongoDB database and obtain the connection string.
    - Create .env file to provide the necessary environment variables

4. Start the application:

    ```bash
    pnpm install
    pnpm dev
    ```

5. Open your browser and navigate to [http://localhost:3001](http://localhost:3001) to use the URL Shortener App.

## Usage

1. **Shorten a URL:**
   - Input a long URL into the app.
   - Input Title, Description, Expiration Date as needed (Optional)
   - Click the "Generate" button.
   - Copy or visit the generated shortened URL.

2. **View Short URLs:**
   - Navigate to the "All URLs" section.
   - Browse the list of shortened URLs.
   - Update the expiration date, title, or description as needed.

3. **URL Details:**
   - Click on the "details" button of a specific short URL to view its details, including the expiration date, title, and description.

4. **QR Code Generation:**
   - Each shortened URL has a corresponding QR code.
   - Use the QR code for convenient sharing.

# Acknowledgements

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [QR Code Generator](https://www.npmjs.com/package/qrcode) npm package

Happy URL shortening!


