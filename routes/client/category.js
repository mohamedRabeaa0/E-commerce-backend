const express = require('express')

const { getCate, getAll } = require('../../controller/category')

const router = express.Router()

router.get('/:id', getCate)
router.get('/', getAll)

module.exports = router;