const Eos = require('eosjs');
const expect = require('chai').expect;

const eos = Eos({
    keyProvider: ['5HrjhATTaw7dsYT6j7Tp49zErBKSXX3ygcv8YCALAqLz3CFyCEt'],
    httpEndpoint: 'http://127.0.0.1:8888'
});

describe('Todo Smoke Tests', () => {
    let contract = null;
    let options = null;

    beforeEach(async () => {
        contract = await eos.contract('todo');
        options = {authorization: 'serg'};
    });

    it('should be able to CREATE a todo', async () => {
        const result = await createTodo();
        expect(result.response).to.exist;
    });

    it('should be able to CREATE and then DESTROY a todo', async() => {
        // CREATE
        const result = await createTodo();
        const todoId = result.todoId;

        // DESTROY
        const response = await destroyTodo(todoId);
        expect(response).to.exist;
    });

    it('should be able to CREATE and then COMPLETE a todo', async() => {
        const result = await createTodo();
        const todoId = result.todoId;

        // COMPLETE
        const response = await completeTodo(todoId);
        expect(response).to.exist;
    });

    // TODO: Look at GITHUB code to figure out how the dude did it. https://github.com/eosasia/eos-todo/
    it('should be able to READ a todo', async() => {
        const result = await eos.getTableRows(true, 'todo', 'todo', 'todos');
        expect(result.rows).to.be.an('array');
    });

    async function createTodo() {
        const randomId = getRandomInt(0, 4294967295);
        const response = await contract.create('serg', randomId, 'Win the blockchain hackathon', options);
        return { todoId: randomId, response: response };
    }

    async function destroyTodo(todoId) {
        return await contract.destroy('serg', todoId, options);
    }

    async function completeTodo(todoId) {
        return await contract.complete('serg', todoId, options);
    }


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});

