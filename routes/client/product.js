const express = require('express')

const {    
    getProduct, 
    getAll,
    byCategory
    } = require('../../controller/product')

const router = express.Router()

router.get('/:id', getProduct)
router.get('/', getAll)
router.get('/byCategory/:id', byCategory)

module.exports = router;