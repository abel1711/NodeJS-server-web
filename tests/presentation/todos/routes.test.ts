import request from 'supertest';
import { testServer } from '../../test-Server';
import { prisma } from '../../../src/data/postgres';

describe('todo routes.ts', () => {
    beforeAll(async () => {
        await testServer.start();
    });

    beforeEach(async () => {
        await prisma.todo.deleteMany();
        await prisma.$executeRaw`TRUNCATE TABLE todo RESTART IDENTITY CASCADE`;
    }, 10000);

    afterAll(() => {
        testServer.close();
    });


    const todo1 = { text: 'Hola mundo 1' };
    const todo2 = { text: 'Hola mundo 2' };

    test('should return todos api/todos', async () => {

        await prisma.todo.createMany({
            data: [todo1, todo2]
        });
        const { body } = await request(testServer.app)
            .get('/api/todos')
            .expect(200);

        expect(body).toBeInstanceOf(Array);
        expect(body[0].text).toBe(todo1.text);
        expect(body[0].completedAt).toBe(undefined);
        expect(body[1].text).toBe(todo2.text);

    }, 10000);

    test('should return a todo api/todos/:id', async () => {
        const newTodo = await prisma.todo.create({
            data: todo1
        });

        const { body } = await request(testServer.app)
            .get(`/api/todos/${newTodo.id}`)
            .expect(200);

        expect(body).toEqual({
            id: newTodo.id,
            text: newTodo.text,
        });
    });
    test('should return 404 not found api/todos/:id', async () => {
        const todoId = 999;
        const { body } = await request(testServer.app)
            .get(`/api/todos/${todoId}`)
            .expect(404);

        expect(body.error).toBe(`Todo with id ${todoId} not found`);
    });

    test('should return a new todo', async () => {
        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send(todo1)
            .expect(201);

        expect(body).toEqual({
            id: 1,
            text: todo1.text,
        })
    })

    test('should return an error if text is empty', async () => {
        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send({ text: '' })
            .expect(400);

        expect(body.error).toBe("Text property is required")
    })
    test('should return an error if text is not present', async () => {
        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send({})
            .expect(400);

        expect(body.error).toBe("Text property is required")
    });

    test('should return an updated todo api/todos/:id', async () => {
        const todo = await prisma.todo.create({
            data: todo1
        });

        const { body } = await request(testServer.app)
            .put(`/api/todos/${todo.id}`)
            .send({ text: 'Hola mundo UPDATED', completedAt: '2023.10.23' })
            .expect(200);

        expect(body).toEqual({
            id: 1,
            text: 'Hola mundo UPDATED',
            completedAt: '2023-10-23T03:00:00.000Z'
        })
    });

    test('should return 404 if todo not found', async () => {

        const todoId = 999;
        const { body } = await request(testServer.app)
            .put(`/api/todos/${todoId}`)
            .send({ text: 'Hola mundo UPDATED', completedAt: '2023.10.23' })
            .expect(404);

        expect(body).toEqual({ error: `Todo with id ${todoId} not found` })
    });

    test('should return an updated todo only the date', async () => {

        const todo = await prisma.todo.create({
            data: todo1
        });

        const { body } = await request(testServer.app)
            .put(`/api/todos/${todo.id}`)
            .send({ completedAt: '2023.10.23' })
            .expect(200);

        expect(body).toEqual({
            ...todo,
            completedAt: '2023-10-23T03:00:00.000Z',
        })
    });
    test('should return an updated todo only the text', async () => {

        const todo = await prisma.todo.create({
            data: todo1
        });

        const { body } = await request(testServer.app)
            .put(`/api/todos/${todo.id}`)
            .send({ text: 'Hola mundo Updated' })
            .expect(200);

        expect(body).toEqual({ id: 1, text: 'Hola mundo Updated' })
    });
    test('should return an same todo', async () => {

        const todo = await prisma.todo.create({
            data: todo1
        });

        const { body } = await request(testServer.app)
            .put(`/api/todos/${todo.id}`)
            .send({})
            .expect(200);

        expect(body).toEqual({
            id: 1,
            text: "Hola mundo 1",
        })
    });
    test('should delete a todo api/todos/:id', async() => { 
        const todo = await prisma.todo.create({
            data: todo1
        });

        const { body } = await request(testServer.app)
            .delete(`/api/todos/${todo.id}`)
            .expect(200);
        expect(body).toEqual({ id: 1, text: 'Hola mundo 1' });
     })
    test('should return 404 if todo do not exist api/todos/:id', async() => { 

        const { body } = await request(testServer.app)
            .delete(`/api/todos/${999}`)
            .expect(404);
        expect(body).toEqual({ error: "Todo with id 999 not found" });
     })

})