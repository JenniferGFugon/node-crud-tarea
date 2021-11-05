import express from 'express'
import { producto, buscarProducto, logout, isAuthenticated } from '../controllers/authController.js'
const router = express.Router()

router.get('/', (req, res) => { 
    res.render('index')
})

router.get('/productos', (req, res) => { 
    res.render('productos')
})

router.get('/agregarProducto', (req, res) => { 
    res.render('agregarProducto')
})
router.get('/editarProducto', (req, res) => { 
    res.render('editarProducto')
})

router.get('/categorias', (req, res) => { 
    res.render('categorias')
})

router.post('/productos', producto)
router.post('/buscarProducto', buscarProducto)

//router.post('/categorias', login)
export default router