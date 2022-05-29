import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
const logger = createLogger('CreateTodos')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    if (!newTodo.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `The "name" property is required`
        })
      }
    }

    const userId = getUserId(event)
    const newItemId = await createTodo(newTodo, userId)
    logger.info('New item id?', { newItemId })

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: { ...newTodo, todoId: newItemId }
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
