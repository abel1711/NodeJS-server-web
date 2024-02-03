import { TodoEntity } from "../../entities/todo.entity";
import { TodoRepository } from "../../repositories/todo.repositories";


export interface GetTodoUseCase {
    execute(id: number): Promise<TodoEntity>;
}

export class GetTodo implements GetTodoUseCase {

    constructor(
        private readonly repositoy: TodoRepository,
    ) { }

    execute(id: number): Promise<TodoEntity> {
        return this.repositoy.findById(id);
    }

}