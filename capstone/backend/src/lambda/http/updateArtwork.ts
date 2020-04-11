import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateArtworkRequest } from '../../requests/UpdateArtworkRequest'
import { updateArtwork } from '../../businessLogic/artworks'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const artworkId = event.pathParameters.artworkId
  const updatedArtwork: UpdateArtworkRequest = JSON.parse(event.body)
  
  await updateArtwork(artworkId, updatedArtwork)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  }
}
