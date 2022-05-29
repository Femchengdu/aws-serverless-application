import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('TodosHandler')

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // Write your code here
        const userId = getUserId(event)
        let results
        try {

            results = await getTodosForUser(userId)

            logger.info('Todo success!', { results })
            return {
                statusCode: 200,
                body: JSON.stringify({
                    items: results.Items
                })
            }
        } catch (error) {
            results = []
            const todos = results.items
            logger.info('Todo fail!', { todos })
            return {
                statusCode: 200,
                body: JSON.stringify({
                    items: results
                })
            }

        }
    })

handler.use(
    cors({
        credentials: true
    })
)
