import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { ArtworkItem } from '../models/ArtworkItem'

export class ArtworkAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly artworkIdIndex = process.env.ARTWORK_ID_INDEX,
    private readonly artworkSaleIndex = process.env.ARTWORK_SALE_INDEX,
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly artworkTable = process.env.ARTWORK_TABLE) {
  }

  async getArtworkById(artworkId): Promise<ArtworkItem> {
    const result = await this.docClient.query({
      TableName: this.artworkTable,
      IndexName: this.artworkIdIndex,
      KeyConditionExpression: 'artworkId = :artworkId',
      ExpressionAttributeValues: {
        ':artworkId': artworkId
      }
    }).promise()
    return result.Items[0] as ArtworkItem
  }

  async getUserArtworks(userId: String): Promise<ArtworkItem[]> {
    const result = await this.docClient.query({
      TableName: this.artworkTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    })
      .promise()

    return result.Items as ArtworkItem[]
  }

  async getRecentArtworks(): Promise<ArtworkItem[]> {
    console.log('Getting all of the artworks published this month that are for sale')

    let date = new Date()
    date.setMonth(date.getMonth()-1)
    const filterString = date.toISOString()

    const result = await this.docClient.query({
      TableName: this.artworkTable,
      IndexName: this.artworkSaleIndex,
      KeyConditionExpression: 'forSale = :sale and createdAt > :lastMonth',
      ExpressionAttributeValues: {
        ':sale': true,
        ':lastMonth': filterString
      },
      ScanIndexForward: false
    })
      .promise()

    return result.Items as ArtworkItem[]
  }

  async deleteArtwork(artwork: ArtworkItem): Promise<ArtworkItem> {
    const key = {
      "userId": artwork.userId,
      "createdAt": artwork.createdAt
    };
    await this.docClient.delete({
      TableName: this.artworkTable,
      Key: key
    }).promise()

    return artwork
  }

  async updateArtwork(artwork: ArtworkItem): Promise<ArtworkItem> {
    const key = {
      "userId": artwork.userId,
      "createdAt": artwork.createdAt
    };

    await this.docClient.update({
      TableName: this.artworkTable,
      Key: key,
      UpdateExpression: "set #n = :n, description = :d, forSale = :s, attachmentUrl = :a",
      ExpressionAttributeValues: {
        ":n": artwork.name,
        ":d": artwork.description,
        ":s": artwork.forSale,
        ":a": artwork.attachmentUrl,
      },
      ExpressionAttributeNames: {
        "#n": "name"
      }
    }).promise()

    return artwork
  }

  async createArtwork(artwork: ArtworkItem): Promise<ArtworkItem> {
    artwork.attachmentUrl=`https://${this.bucketName}.s3.amazonaws.com/${artwork.attachmentUrl}`
    await this.docClient.put({
      TableName: this.artworkTable,
      Item: artwork
    }).promise()

    return artwork
  }

  async generateUploadUrl(artworkId: String) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: artworkId,
      Expires: this.urlExpiration
    })
  }

}