# Serverless Gallery

Simple Gallery application using AWS Lambda and Serverless framework. 

# Functionality of the application

This application will allow creating/removing/updating/fetching artwork items. Each artwork item has an attachment image. Each user has access all of the artworks but can only modify or delete artwork items that he/she has created.

# Artwork items

The application should store TODO items, and each TODO item contains the following fields:

* `artworkId` (string) - a unique id for an artwork
* `userId` (string) - unique id of the user that uploaded the artwork
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of the artwork
* `description` (string) - description of the artwork
* `forSale` (boolean) - true if an artwork is for sale, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a TODO item

# Backend
All functions are deployed in AWS lambda and can be accessed by their respective API Gateway endpoint. Some of the endpoints require authentication.


# Frontend

The `client` folder contains a web application that can use the project's API.

The only file that you need to edit is the `config.ts` file in the `client` folder. This file must contain the AWS API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

# How to run the application

## Backend

To deploy the serverless application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless gallery application.

# Postman collection

Alternatively, you can test the API using the Postman collection. You will find a Postman collection that contains sample requests in the capstone directory.