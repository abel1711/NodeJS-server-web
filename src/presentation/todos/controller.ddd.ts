import { Request, Response } from "express";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain";

const todos = [
    { id: 1, todo: 'buy milk', createdAt: new Date() },
    { id: 2, todo: 'buy bread', createdAt: new Date() },
    { id: 3, todo: 'buy sugar', createdAt: new Date() },
];

export class TodosController {

    constructor(
        private readonly todoRepository: TodoRepository
    ) { }

    public getTodos = async (req: Request, res: Response) => {
        const todos = await this.todoRepository.getAll();
        return res.json(todos);
    };

    public getTodosById = async (req: Request, res: Response) => {
        const id = +req.params.id;

        try {
            const todo = await this.todoRepository.findById(id);
            return res.json(todo);
        } catch (error) {
            return res.status(400).json({ error });
        }
    };

    public createTodo = async (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        try {
            const newTodo = await this.todoRepository.create(createTodoDto!);
            return res.json(newTodo);
        } catch (error) {
            return res.status(400).json({ error });
        }

    }

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        try {
            const updatedTodo = await this.todoRepository.updateById(updateTodoDto!);
            return res.json(updatedTodo);
        } catch (error) {
            return res.status(400).json({ error });
        }
    }

    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;

        try {
            const deletedTodo = await this.todoRepository.deleteById(id);
            return res.json(deletedTodo);
        } catch (error) {
            return res.status(400).json({ error });
        }
    }


}