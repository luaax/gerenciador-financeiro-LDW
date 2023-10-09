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

app.post('/categoria_despesa', async (req, res) => {
    const { nome, tipo, usuario_id } = req.body;
    try {
        const [result] = await connection.execute('INSERT INTO categoria_despesa (nome, tipo, usuario_id) VALUES (?, ?, ?)', [nome, tipo, usuario_id]);
        const newCategoryId = result.insertId;
        res.status(201).json({ id: newCategoryId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao criar categoria de despesa' });
    }
});
app.get('/categoria_despesa/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM categoria_despesa WHERE id = ?', [id]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Categoria de despesa não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar categoria de despesa' });
    }
});
app.get('/categoria_despesa/', async (req, res) => {
    try {
        const [query] = await connection.execute('SELECT * FROM categoria_despesa');
        if (query.length === 0) return res.status(404).json({ mensagem: 'Categoria_despesa não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar Categoria_despesa' });
    }
});
app.get('/categoria_despesa/buscar/:nome', async (req, res) => {
    const { nome } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM categoria_despesa WHERE nome LIKE ?', [`%${nome}%`]);
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar categorias de despesa por nome' });
    }
});
app.delete('/categoria_despesa/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await connection.execute('DELETE FROM categoria_despesa WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Categoria de despesa não encontrada' });
        res.status(200).json({ mensagem: 'Categoria de despesa apagada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao apagar categoria de despesa' });
    }
});
app.put('/categoria_despesa/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, tipo, usuario_id } = req.body;
    try {
        const [result] = await connection.execute('UPDATE categoria_despesa SET nome = ?, tipo = ?, usuario_id = ? WHERE id = ?', [nome, tipo, usuario_id, id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Categoria de despesa não encontrada' });
        res.status(200).json({ mensagem: 'Categoria de despesa atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao atualizar categoria de despesa' });
    }
});

app.listen(porta, () => console.log(`Servidor está rodando na porta ${porta}`));
