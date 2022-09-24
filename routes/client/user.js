const express = require('express')

const {auth} = require('../../helper/authorization')

const {
	profile,
	update,	
	changePass,
	remove
} = require('../../controller/user')

const router = express.Router()

router.get('/:id', auth, profile)
router.put('/', auth, update)
router.post('/changePass', auth, changePass)
router.delete('/', auth, remove)

module.exports = router