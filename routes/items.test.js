process.env.NODE_ENV = 'test'
const request = require("supertest")

const app = require('../app')
const items = require('../fakeDb')

let item1 = { 
    name: "popsicle", price: 1.45,
    name: "cheerios", price: 3.40
}

beforeEach(function(){
    items.push(item1)
})

afterEach(function(){
    items.length = 0
})

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items")
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({items: [item1]})
    })
})

describe('GET /items/:name', () => {
    test("Get Item by name", async () => {
        const res = await request(app).get(`/items/${item1.name}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({item: item1})
    })
    test("Respond for 404 for invalid item", async () => {
        const res = await request(app).get('/items/kfie')
        expect(res.statusCode).toBe(404)
    })
})

describe("POST /items", () => {
    test("Add an Item", async () => {
        const res = await request(app).post("/items").send({ name:"pizza", price: 5.12 })
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({item: {name:"pizza", price: 5.12} })
    })
})

describe("PATCH /items/:name", () => {
    test("Updating a Item's name", async () => {
        const res = await request(app).patch(`/items/${item1.name}`).send({ name: "lulo" })
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ item: { name: "lulo"}})
    })
    test('Respond with 404 for invalid name', async () => {
        const res = await request(app).patch(`/items/Piggles`).send({ name: "lulo"})
        expect(res.statusCode).toBe(404)
    })
})

describe("/DELETE /items/:name", () => {
    test('Deleting an item', async () => {
        const res = await request(app).delete(`/items/${item1.name}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ message: 'Deleted'})
    })

})