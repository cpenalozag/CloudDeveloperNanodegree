import 'source-map-support/register'

import { APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getAllArtworks } from '../../businessLogic/artworks'

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {

  const artworks = await getAllArtworks()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: artworks
    })
  }
}
