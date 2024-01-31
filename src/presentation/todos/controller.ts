import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

const todos = [
    { id: 1, todo: 'buy milk', createdAt: new Date() },
    { id: 2, todo: 'buy bread', createdAt: new Date() },
    { id: 3, todo: 'buy sugar', createdAt: new Date() },
];

export class TodosController {

    constructor() { }

    public getTodos = async (req: Request, res: Response) => {
        const todos = await prisma.todo.findMany();
        res.json(todos);
    };

    public getTodosById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID is not a number, bad request' });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        (todo)
            ? res.status(200).json(todo)
            : res.status(404).json({ error: `Todo with id ${id} not found` });
    };

    public createTodo = async (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        const newTodo = await prisma.todo.create({
            data: createTodoDto!
        });

        res.json(newTodo);

    }

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });

        if (error) return res.status(400).json({ error });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found ` });

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: updateTodoDto!.values
        });

        res.status(200).json(updatedTodo);
    }


}