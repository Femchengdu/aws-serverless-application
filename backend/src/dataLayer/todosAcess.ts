import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const logger = createLogger('TodosAccess')

const docClient = new DocumentClient()

const todosTable = process.env.TODOS_TABLE

const createdAtIndex = process.env.TODOS_CAT_INDEX

// TODO: Implement the dataLayer logic

export const TodosAccess = async (todo: TodoItem) => {
    const params = {
        TableName: todosTable,
        Item: todo
    }
    try {

        return await docClient.put(params).promise()
    } catch (error) {
        logger.error('Create todo error, check env for table name!', { error })

    }
}

export const UserTodosAccess = async (userId: string) => {
    logger.info('Check the userId received', { userId })
    try {
        const params = {
            KeyConditionExpression: "userId = :uid",
            ExpressionAttributeValues: {
                ":uid": userId,
            },
            TableName: todosTable,
        }
        return await docClient.query(params).promise()

    } catch (error) {
        logger.error('Get todos error!', { error })
    }
}

export const updateUserTodo = async (updatedTodo: TodoUpdate, todoId: string, userId: string) => {

    const params = {
        ExpressionAttributeValues: { ":dd": new Date(updatedTodo.dueDate).toISOString(), ":nm": updatedTodo.name, ":dn": updatedTodo.done },
        Key: { userId, todoId },
        ExpressionAttributeNames: {
            '#nm': "name"
        },
        UpdateExpression: 'SET dueDate = :dd, #nm = :nm, done = :dn',
        IndexName: createdAtIndex,
        TableName: todosTable
    }

    try {
        const result = await docClient.update(params).promise()
        logger.info("See the result of the update query", { result })
        return result
    } catch (error) {
        logger.error("See the error of the update query", { error, params })
    }
}


export const deleteUserTodo = async (todoId: string, userId: string) => {
    const params = {
        Key: { userId, todoId },
        TableName: todosTable
    }
    try {
        const result = await docClient.delete(params).promise()
        logger.info("See the result of the delete query", { result })
        return result
    } catch (error) {
        logger.error("See the error of the delete query", { error, params })
    }
}