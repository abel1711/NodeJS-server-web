import { UpdateTodoDto } from "../../dtos";
import { TodoEntity } from "../../entities/todo.entity";
import { TodoRepository } from "../../repositories/todo.repositories";


export interface UpdateTodoUseCase {
    execute(dto: UpdateTodoDto): Promise<TodoEntity>;
}

export class UpdateTodo implements UpdateTodoUseCase {

    constructor(
        private readonly repositoy: TodoRepository,
    ) { }

    execute(dto: UpdateTodoDto): Promise<TodoEntity> {
        return this.repositoy.updateById(dto);
    }

}