const express=require('express')
const bcrypt=require('bcryptjs')
const session=require('express-session')

const db =require('./config/db')


const app=express()
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))
app.set('view engine','ejs')

app.use(session({
    secret:'buenos dias',
    resave:false,
    saveUninitialized:false

}))

//ruta pagina de inicio
app.get('/',  (req,res)=>{
    res.render('login')
})
// app.get('/*',(req,res)=>{
//     res.render('login')
// })

//registro de usuario

app.get('/register',(req,res)=>{
    res.render('register')
})

app.get('/dashboard',(req,res)=>{
if(req.session.loggedin){
    res.render('dashboard',{nombreUsuario:req.session.username})
}else{

    res.send('Por favor , inicie sesion para ver esta pagina')
}




})


app.post('/register',async(req,res)=>{
   let  {username,email,password}=req.body
   let hashedPassword=await bcrypt.hash(password,8)
   //12345=>a25s7d => ff54fsdf654fsf6 => sdfs6df4sd65f4sdf6s4df6sdf =>fgsdg/dfg*-h-*/dñfsfs5fd6s5dsdf46sdf5sf65s4g9fs90d8f7
    password=hashedPassword
console.log(username, email,password)

db.query('INSERT INTO users SET ?',{username,email,password},(error,result)=>{
    if(error) throw error;
    res.redirect('/')

})
})

//middleware

app.post("/login", (req,res)=>{
   const  {email,password}=req.body

   db.query('SELECT * FROM users WHERE email= ?',[email],async(error,result)=>{
    console.log(result)
    if(result.length === 0 ||  !(await bcrypt.compare(password,result[0].password))){
        console.log('email y contraseña incorrecta')
    }else{
        req.session.loggedin=true
        req.session.username=result[0].username
        console.log( req.session.loggedin,req.session.username)

        res.redirect('/dashboard')
    }
    // if(error) throw error;
    // res.redirect('/dashboard')

   })


})


app.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

app.listen(3800,()=>{
    console.log('el servidor esta corriendo')
})
