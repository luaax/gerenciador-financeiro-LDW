const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const porta = 3000;

const connection = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'mydb',
    user: 'root',
    password: ''
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const getAllPessoas = async () => {
    const [query] = await conection.execute('select * from usuario')
    return query
};

app.get('/usuario/', async (req, res) => {
    const resultado = await getAllPessoas()

    if (resultado.length === 0) {
        return res.status(200).json({ mensagem: 'Nenhum usuário encontrado no database!' });
    }
    return res.status(200).json(resultado);
});


app.get('/usuario/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM usuario WHERE id = ?', [id]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'usuario não encontrada' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar usuario' });
    }
});

app.get('/usuario/buscarnome/:nome', async (req, res) => {
    const { nome } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM usuario WHERE nome LIKE ?', [`%${nome}%`]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma usuario encontrada' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar usuarios por nome' });
    }
});

app.get('/usuario/buscaremail/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM usuario WHERE email LIKE ?', [`%${email}%`]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma usuario encontrada' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar usuarios por email' });
    }
});

app.post('/usuario', async (req, res) => {
    const { nome, email } = req.body;
    try {
        const [query] = await connection.execute('INSERT INTO usuario (nome, email) VALUES (?, ?)', [nome, email]);
        res.status(201).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao criar usuario' });
    }
});

app.put('/usuario/:id', async (req, res) => { 
    const { id } = req.params;
    const { nome, email } = req.body;
    try {
        const [query] = await connection.execute('UPDATE usuario SET nome = ?, email = ? WHERE id = ?', [nome, email, id]);
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao atualizar usuario' });
    }
});

app.delete('/usuario/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('DELETE FROM usuario WHERE id = ?', [id]);
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao deletar usuario' });
    }
});

app.listen(porta, () => console.log(`Servidor está rodando na porta ${porta}`));
