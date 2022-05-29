import { TodosAccess, UserTodosAccess, updateUserTodo, deleteUserTodo } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'



// TODO: Implement businessLogic
export const createTodo = async (newTodo: CreateTodoRequest, userId: string) => {
    const todoId: string = uuid.v4()
    const oldDate = newTodo.dueDate
    const newDate = new Date(oldDate);
    newTodo.dueDate = newDate.toISOString();
    const createdAt: string = new Date().toISOString()
    const attachmentUrl = `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`
    const newTodoObj = {
        ...newTodo,
        userId,
        todoId,
        createdAt,
        attachmentUrl,
        done: false
    } as TodoItem

    // returns a promise
    return await TodosAccess(newTodoObj)
}


export const getTodosForUser = async (userId: string) => {
    return await UserTodosAccess(userId)
}


// update todos
export const updateTodo = async (updatedTodo: UpdateTodoRequest, todoId: string, userId: string) => {
    return await updateUserTodo(updatedTodo, todoId, userId)
}
// delete todo
export const deleteTodo = async (todoId: string, userId: string) => {
    return await deleteUserTodo(todoId, userId)
}

// gen upload url

export const createAttachmentPresignedUrl = async (imageId: string) => {

    const s3AttachmentClient = new AttachmentUtils()

    return await s3AttachmentClient.returnPresignedUrl(imageId)

}


