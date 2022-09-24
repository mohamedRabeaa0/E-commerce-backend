const express = require('express')

const {auth, admin} = require('../../helper/authorization')
const {upload} = require('../../helper/multerMiddleware')
const {
    create,
    getProduct,
    getAll,
    update,
    remove,
    } = require('../../controller/admin/product')

const router = express.Router()

router.get('/:id', auth, admin, getProduct)
router.get('/', auth,  admin, getAll)
router.post('/create', auth, admin, upload.any('file'), create)
router.put('/:id', auth, admin, update)
router.delete('/:id', auth, admin, remove)

module.exports = router;