import express from 'express'
import { producto,categoria, logout, isAuthenticated } from '../controllers/authController.js'
const router = express.Router()
import con from '../database/connection.js'
var products 
var categorias

router.get('/', (req, res) => { 
    res.render('index')
})

router.get('/productos', (req, res) => { 
    res.render('productos')
})

router.get('/agregarProducto', (req, res) => { 
    res.render('agregarProducto')
})
router.get('/agregarCategoria', (req, res) => { 
    res.render('agregarCategoria')
})
router.get('/editarProducto', (req, res) => { 
    res.render('editarProducto')
})

router.get('/categorias', (req, res) => { 
    res.render('categorias')
})

router.get('/editarProducto/:id', async(req, res) => { 
    const id=req.params.id
    console.log(id);
    con.query('SELECT * FROM producto WHERE id = ?', id, (err, result) => {

    
        if (err) {
            console.log('Ocurrio un error al consultar el producto',err)
            return
        }
        console.log(result);
        res.render('editarProducto',{
            data: result[0]

        })
        

    })
})

router.get('/editarCategoria/:id', async(req, res) => { 
    const id=req.params.id
    console.log(id);
    con.query('SELECT * FROM categoriaproducto WHERE idCategoria = ?', id, (err, result) => {

    
        if (err) {
            console.log('Ocurrio un error al consultar la categora',err)
            return
        }
        console.log(result);
        res.render('editarCategoria',{
            data: result[0]

        })
        

    })
})

router.post('/editarProducto/:id', async(req, res) => { 
    const id=req.params.id
    console.log(id);
    const {nombre,precioCompra,precioVenta,categoria} = req.body
    const nuevoProducto = {
        nombre,
        precioCompra,
        precioVenta,
        categoria
    }
    console.log(id);
    con.query('UPDATE producto set ?  WHERE id = ?', [nuevoProducto,id], (err, result) => {

    
        if (err) {
            console.log('Ocurrio un error al actualizar el producto',err)
            return
        }
        console.log(result);
        res.redirect('/verProducto')
        

    })
})

router.post('/editarCategoria/:id', async(req, res) => { 
    const id=req.params.id
    const {idCategoria,nombreCategoria} = req.body
    const nuevaCategoria = {
        nombreCategoria,
    }
    console.log(id);
    con.query('UPDATE categoriaproducto set ?  WHERE idCategoria = ?', [nuevaCategoria,id], (err, result) => {

    
        if (err) {
            console.log('Ocurrio un error al actualizar la Categoria',err)
            return
        }
        console.log(result);
        res.redirect('/verCategoria')
        

    })
})

router.get('/verProducto', (req, res) => { 
    con.query('SELECT * FROM producto ', async(err, result) => {

    
        if (err) {
            products = []
            console.log('Ocurrio un error al consultar el producto',err)
            return
        }
        else{
            products = result    
        }
        console.log(products);
    
    res.render('verProducto', {
        data: result
    })

    })
})

router.get('/verCategoria', (req, res) => { 
    con.query('SELECT * FROM categoriaproducto ', async(err, result) => {

    
        if (err) {
            categorias = []
            console.log('Ocurrio un error al consultar la categoria',err)
            return
        }
        else{
            categorias = result    
        }
        console.log(categorias);
    
    res.render('verCategoria', {
        data: result
    })

    })
})


router.get('/eliminarProducto/:id', (req, res) => {
    const id = req.params.id 
    con.query('DELETE FROM producto WHERE id = ? ', id, async(err, result) => {
        if (err) {
            console.log('Ocurrio un error al eliminar el producto',err)
            return
        }    
    res.redirect('/verProducto')

    })
})

router.get('/eliminarCategoria/:id', (req, res) => {
    const id = req.params.id 
    con.query('DELETE FROM categoriaProducto WHERE idCategoria = ? ', id, async(err, result) => {
        if (err) {
            console.log('Ocurrio un error al eliminar la categoria',err)
            return
        }    
    res.redirect('/verCategoria')

    })
})

router.post('/productos', producto)
//router.post('/editarProducto', editarProducto)
router.post('/categorias', categoria)
//router.post('/verProducto', buscarProducto)

//router.post('/categorias', login)

export default router