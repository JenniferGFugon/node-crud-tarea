import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import con from '../database/connection.js'

var session

//guardar Productos
export const producto = async (req, res) => {
    const {nombre, precioCompra, precioVenta, categoria } = req.body

    
    
    // construir la data que será insertada
    const data = {
        nombre: nombre,
        precioCompra: precioCompra,
        precioVenta: precioVenta,
        categoria: categoria
    }
    
    // construir el query con la sintaxis INSERT
    // consultas preparadas
    con.query('INSERT INTO producto SET ?', data, (err, result) => {
        if (err) {
            console.log('Ocurrio un error al insertar el producto',err)
            return
        }

        res.redirect('/')
    })
    
}

//buscar id en la base de datos
export const buscarProducto = async (req, res) => {
    const {id } = req.body

    con.query('SELECT nombre,precioCompra,precioVenta,categoria FROM producto WHERE id = ?', id, (err, result) => {
    //var product
    
        if (err) {
            console.log('Ocurrio un error al consultar el producto',err)
            return
        }
        else{
            console.log('El id seleccionado fue: ',id);
            result.write(JSON.stringify({
                data:result
            }))
            console.log(data);

        }

    })
    
}







export const login = async (req, res) => {
    const { username, password } = req.body
    // const hash = await bcryptjs.hash(password, 8)

    if (!username || !password) {
        res.render('login')
        return;
    }

    // query a la base de datos para verificar que exista el usuario
    con.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        // validar el error

        // evaluaciones cortocircuiteadas
        //console.log(result[0].password)

        // validar si el usuario existe, de existir validar si la contrasena es correcta
        if (result.length === 0 || !(await bcryptjs.compare(password, result[0].password))) {
            res.render('login')
            return
        }

        // crear el token usando el id del usuario
        const id = result[0].id
        const token = jwt.sign({id: id}, process.env.JWT_SECRET)

        // guardar en la sesion el token generado
        session = req.session
        session.token = token

        // el user y password son correctos, podemos continuar
        res.redirect('/')
    })

    
}

export const logout = (req, res) => {
    req.session.destroy()
    res.redirect('/login')
}


// Creando un middleware para proteger las URL que necesitan inicio de sesion
export const isAuthenticated = async (req, res, next) => {
    if (req.session.token) {
        // validar que el token le pertenezca al usuario
        const verifyPromise = await promisify(jwt.verify)
        const decoded = await verifyPromise(req.session.token, process.env.JWT_SECRET)

        // decoded: {id: <id del user en base de datos>}
        const userID = decoded.id
        
        // consultar en la base de datos si el usuario que se decodificó del token, existe
        con.query('SELECT * FROM users WHERE id = ?', [userID], (err, result) => {
            if (err) {
                return res.redirect('/login')
            }

            if (result.length === 0) {
                return res.redirect('/login')
            }

            // el usuario existe
            session = req.session
            session.user = result[0]
            next()
        })

        
    }
    else {
        // el token no exite, por tanto, no se ha iniciado sesion
        return res.redirect('/login')
    }
}

// Creando un middleware que monitoree todas las peticiones
export const logger = (req, res, next) => {
    console.log(req.path, req.method)
    // console.log('La peticion ha sido interceptada y sigue su rumbo')
    next()
}