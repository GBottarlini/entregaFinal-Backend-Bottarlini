import express from 'express'
import path from 'path'
import { __dirname } from './path.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import {create} from 'express-handlebars'
import passport from 'passport'
import initalizatePassport from './config/passport.config.js'
import MongoStore from 'connect-mongo'
import sessionRouter from './routes/sessions.routes.js'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from "body-parser"; 
import { userInfo } from 'os'

const app = express()
const PORT = 5000
const hbs = create()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://bottarlini99:dKYARPesZY2KkBPW@coder.ucsnn.mongodb.net/?retryWrites=true&w=majority&appName=coder", // URL de MongoDB
            mongoOptions: {}, // Opciones adicionales de MongoDB
            ttl: 15 * 60, // Tiempo de vida de la sesión en segundos (15 minutos)
        }),
        secret: "SessionSecret", // Clave secreta para firmar la sesión
        resave: false, // Evita guardar la sesión si no ha cambiado
        saveUninitialized: false, // Evita guardar sesiones no inicializadas
        cookie: {
            maxAge: 15 * 60 * 1000, // Tiempo de vida de la cookie en milisegundos (15 minutos)
            httpOnly: true, // La cookie solo es accesible desde el servidor
            secure: false, // Cambiar a true en producción con HTTPS
        },
    })
);  

mongoose.connect("mongodb+srv://bottarlini99:dKYARPesZY2KkBPW@coder.ucsnn.mongodb.net/?retryWrites=true&w=majority&appName=coder")
.then(() => console.log("DB is connected"))
.catch((e) => console.log("Error al conectarme a DB:", e))

initalizatePassport()
app.use(passport.initialize())
app.use(passport.session())
app.engine("handlebars", create({ defaultLayout: "main" }).engine);
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views')) 

//Rutas
app.use('/public', express.static(__dirname + '/public')) 
app.use('/api/sessions', sessionRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.get('/', (req,res) => {
    res.status(200).send("Hola desde Inicio")
})
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})