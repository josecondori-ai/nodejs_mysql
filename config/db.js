const mysql= require ('mysql')

const connection=mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'',
        database:'logindb'
    }
)

connection.connect((error)=>{
    if(error) throw error;
    console.log('se conecto a la base de mysql')
})


module.exports=connection