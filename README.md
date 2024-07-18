# Swift Cart Backend

Swift Cart Backend is a Node.js application using Mongoose for handling database operations. It provides APIs for managing the shopping cart functionalities of the Swift Cart application.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/swift-cart-backend.git
    ```
2. Navigate to the project directory:
    ```sh
    cd swift-cart-backend
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/swiftcart
    JWT_SECRET=your_jwt_secret
    ```
5. Start the server:
    ```sh
    npm start
    ```