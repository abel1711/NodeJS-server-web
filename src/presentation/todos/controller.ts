import { Request, Response } from "express";

const todos = [
    { id: 1, todo: 'buy milk', createdAt: new Date() },
    { id: 2, todo: 'buy bread', createdAt: new Date() },
    { id: 3, todo: 'buy sugar', createdAt: new Date() },
];

export class TodosController {

    constructor() { }

    public getTodos = (req: Request, res: Response) => {
        res.json(todos);
    };
    public getTodosById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({error: 'ID is not a number, bad request'})
        const todo = todos.find(todo => todo.id == id);

        (todo)
            ? res.status(200).json(todo)
            : res.status(404).json({ error: `Todo with id ${id} not found` });
    };

    public createTodo = (req: Request, res: Response)=>{
        const todo = req.body;
        console.log(todo)
        res.json(todo)

    }


}