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

app.post('/categoriaReceita', async (req, res) => {
    const { nome } = req.body;
    try {
        const [result] = await connection.execute('INSERT INTO categoria_receita (nome) VALUES (?)', [nome]);
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao criar CategoriaReceita' });
    }
});

app.get('/categoriaReceita/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM categoria_receita WHERE id = ?', [id]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'CategoriaReceita não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar CategoriaReceita' });
    }
});

app.get('/categoriaReceita/', async (req, res) => {
    try {
        const [query] = await connection.execute('SELECT * FROM categoria_receita');
        if (query.length === 0) return res.status(404).json({ mensagem: 'CategoriaReceita não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar CategoriaReceita' });
    }
});

app.get('/categoriaReceita/buscar/:nome', async (req, res) => {
    const { nome } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM categoria_receita WHERE nome LIKE ?', [`%${nome}%`]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma CategoriaReceita encontrada' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar CategoriaReceita por nome' });
    }
});

app.delete('/categoriaReceita/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('DELETE FROM categoria_receita WHERE id = ?', [id]);
        if (query.affectedRows === 0) return res.status(404).json({ mensagem: 'CategoriaReceita não encontrada' });
        res.status(200).json({ mensagem: 'CategoriaReceita apagada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao apagar CategoriaReceita' });
    }
});

app.put('/categoriaReceita/:id', async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    try {
        const [query] = await connection.execute('UPDATE categoria_receita SET nome = ? WHERE id = ?', [nome, id]);
        if (query.affectedRows === 0) return res.status(404).json({ mensagem: 'CategoriaReceita não encontrada' });
        res.status(200).json({ mensagem: 'CategoriaReceita atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao atualizar CategoriaReceita' });
    }
});

app.listen(porta, () => console.log(`Servidor está rodando na porta ${porta}`));