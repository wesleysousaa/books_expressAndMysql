const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql')
const app = express()

// Permite pegar o body
app.use(
    express.urlencoded({
        extended: true,
    })
)

//pegar body em json
app.use(express.json())

// Usar handlebars
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// Usar css
app.use(express.static('public'))

app.get('/', (req, res) => {
    const query = `SELECT * FROM books`
    conn.query('USE library')
    conn.query(query, function(err, data){
        if(err){
            console.log(`Erro ao carregar dados -> ${err}`)
            return
        }
        const livros = data

        console.log(`Livros carregados!`)
        res.render('home', { livros })
    })
    
})

app.post('/books/updatebook/:id', (req, res) => {
    const id = req.params.id
    const titulo = req.body.titulo
    const qtd = req.body.qtdpages

    const query = `UPDATE books SET titulo='${titulo}', qtd_pages=${qtd} WHERE idbooks = ${id}`

    conn.query('USE library')
    conn.query(query, function(err) {
        if(err){
            console.log(err)
            return
        }
        res.redirect('/')
    })
})

app.get('/books/updatebook/:id', (req, res) => {
    const id = req.params.id

    const query = `SELECT * FROM books WHERE idbooks = ${id}`
    conn.query("USE library")
    conn.query(query, function(err, data){
        if(err){
            console.log("erro ao resgatar dados", err)
            return
        }
        const book = data[0]
        res.render('updatebook', { book })
    })

    conn.query("USE library")
    app.render('updatebook', { id })
})

app.get('/books/delbook/:id', (req, res) => {
    const id = req.params.id
    const query = ` DELETE FROM books WHERE idbooks = ${id} `

    conn.query("USE library")
    conn.query(query, function(err){
        if(err){
            console.log(`Erro: ${err}`)
            return
        }
        console.log(`Livro com ID:${id} deletado`)
        res.redirect('/')
    })
})

app.post('/books/insertbook', (req, res) => {
    const titulo = req.body.titulo
    const qtd = req.body.qtdpages
    const query = `INSERT INTO books (titulo, qtd_pages) VALUES ('${titulo}', '${qtd}')`
    console.log("aqui: ",qtd, titulo)

    conn.query('USE library')
    conn.query(query, function(err){
        if(err){
            console.log(`Erro ao salvar os dados ${err}`)
            return
        }else{
            console.log(`Dados enviados! Titulo: ${titulo}, Páginas: ${qtd}`)
            res.redirect('/')
        }
    })
})

// resgatar um livro
app.get('/books/:id', (req, res) => {
    const id = req.params.id
    const query = `SELECT * FROM books WHERE idbooks = ${id}`
    conn.query('USE library')
    conn.query(query, function(err, data){
        if(err){
            console.log("Erro: ", err)
            return
        }
        const book = data[0]
        res.render('book', { book })
    })
})



// conecta com o banco com pool pra otimizar as buscas
conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    batabase: 'library',
})

conn.connect(function (err) {
    if(err){
        console.log("Erro ao conectar no banco")
        return
    }
    app.listen(3000, () => {console.log('Conexão com MySql feita!!')})
})

