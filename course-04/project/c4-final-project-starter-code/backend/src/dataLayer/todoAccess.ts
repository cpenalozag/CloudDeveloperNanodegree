import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly todoIdIndex = process.env.TODO_ID_INDEX,
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getTodoById(todoId): Promise<TodoItem> {
    console.log(typeof todoId, todoId)
    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todoIdIndex,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId
      }
    }).promise()
    return result.Items[0] as TodoItem
  }

  async getUserTodos(userId: String): Promise<TodoItem[]> {
    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    })
      .promise()

    return result.Items as TodoItem[]
  }

  async deleteTodo(todo: TodoItem): Promise<TodoItem> {
    const key = {
      "userId": todo.userId,
      "createdAt": todo.createdAt
    };
    console.log(key)
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: key
    }).promise()

    return todo
  }

  async updateTodo(todo: TodoItem): Promise<TodoItem> {
    const key = {
      "userId": todo.userId,
      "createdAt": todo.createdAt
    };
    await this.docClient.update({
      TableName: this.todosTable,
      Key: key,
      UpdateExpression: "set #n = :n, dueDate = :dd, done = :d",
      ExpressionAttributeValues: {
        ":n": todo.name,
        ":dd": todo.dueDate,
        ":d": todo.done
      },
      ExpressionAttributeNames: {
        "#n": "name"
      }
    }).promise()

    return todo
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async generateUploadUrl(todoId: String) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration
    })
  }

}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
