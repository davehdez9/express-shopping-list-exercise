const express = require('express')
const router = new express.Router()
const ExpressError = require('../expressError')
const items = require('../fakeDb')

// GET /items -> render a list of shopping list
router.get("/", function(req, res) {
    res.json({ items })
})

// POST /items -> Accept JSON data and add it to the shopping list
router.post("/", function(req, res, next) {
    try{
        if(!req.body.name) throw new ExpressError("Name and price is required", 400)
        const newItem = { name: req.body.name, price: req.body.price}
        items.push(newItem)
        return res.status(201).json({ name: newItem})
    } catch(e){
        return next(e)
    }
})

// GET /items/:name -> Display a single item's name and price
router.get('/:name', (req, res) => {
    const foundItem = items.find(item => item.name === req.params.name)
    if(foundItem === undefined){
        throw new ExpressError("Cannot found item", 404)
    }
    res.json({item: foundItem})
})

// PATCH /items/:name -> should modify a single item's name and/or price
router.patch("/:name", function(req, res){
    const foundItem = items.find(item => item.name === req.params.name)
    if(foundItem === undefined){
        throw new ExpressError("Item not found", 404)
    }
    foundItem.name = req.body.name
    foundItem.price = req.body.price
    res.json({ item: foundItem })
})

// DELETE /items/:name -> should allow you to delete a specific item from the array
router.delete("/:name", function(req, res) {
    const findItem = items.find(item => item.name === req.params.name)
    if(findItem === -1){
        throw new ExpressError("Item nor found", 400)
    }
    items.splice(findItem, 1)
    res.json({ message: "Deleted" })
    
})

module.exports = router