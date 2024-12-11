# URL Shortener Microservice

This is a simple URL Shortener Microservice built using Node.js, Express, and MongoDB. The application allows users to shorten URLs and redirect using the shortened URLs.

## Features

- Accepts a valid URL and returns a shortened URL.

- Redirects the user to the original URL when accessing the shortened URL.

- Returns an error message for invalid URLs.

## Endpoints

### POST  /api/shorturl

Description: Shortens a valid URL.

Request Body:
```
{
  "url": "<original_url>"
}
```

Response:

For valid URLs:
```
{
  "original_url": "<original_url>",
  "short_url": <short_url_id>
}
```
For invalid URLs:
```
{
  "error": "invalid url"
}
```

### GET /api/shorturl/:id

Description: Redirects to the original URL corresponding to the id.

Response:

- Redirects to the original URL if id is valid.

- Returns 404 Not Found if the id does not exist.

## Prerequisites

- Node.js: Ensure Node.js is installed on your system.

- MongoDB: Set up a local or cloud MongoDB instance.

## Installation

### Clone the repository:

#### git clone 
```
https://github.com/SutharMahendra/boilerplate-project-urlshortener/
```

### Install dependencies:
```
npm install
```

### Set up environment variables:

Create a .env file in the root directory and add the following:
```
MONGO_URI=<your_mongodb_connection_string>
PORT=3000
```

## Start the server:
```
npm start
```
The application will be running at http://localhost:3000.
