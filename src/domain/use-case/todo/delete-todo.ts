import { TodoEntity } from "../../entities/todo.entity";
import { TodoRepository } from "../../repositories/todo.repositories";


export interface DeleteTodoUseCase {
    execute(id: number): Promise<TodoEntity>;
}

export class DeleteTodo implements DeleteTodoUseCase {

    constructor(
        private readonly repositoy: TodoRepository,
    ) { }

    execute(id: number): Promise<TodoEntity> {
        return this.repositoy.deleteById(id);
    }

}