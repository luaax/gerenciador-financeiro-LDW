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

app.post('/receitas', async (req, res) => {
    const { descricao, valor, data, categoriaReceitaId } = req.body;
    try {
        const [result] = await connection.execute(
            'INSERT INTO receitas (descricao, valor, data, categoria_receita_id) VALUES (?, ?, ?, ?)',
            [descricao, valor, data, categoriaReceitaId]
        );
        res.status(201).json({ mensagem: 'Receita criada com sucesso', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao criar receita' });
    }
});

app.get('/receitas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM receitas WHERE id = ?', [id]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Receita não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar receita' });
    }
});
app.get('/receitas/', async (req, res) => {
    try {
        const [query] = await connection.execute('SELECT * FROM receitas');
        if (query.length === 0) return res.status(404).json({ mensagem: 'Receita não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar receita' });
    }
});

app.get('/receitas/buscar/:descricao', async (req, res) => {
    const { descricao } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM receitas WHERE descricao LIKE ?', [`%${descricao}%`]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma receita encontrada' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar receitas por descrição' });
    }
});
app.get('/receitas/buscarPorCategoria/:categoriaId', async (req, res) => {
    const { categoriaId } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM receitas WHERE categoria_receita_id = ?', [categoriaId]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma receita encontrada para esta categoria' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar receitas por categoria' });
    }
});

app.get('/receitas/buscarPorData/:dataInicio/:dataFim', async (req, res) => {
    const { dataInicio, dataFim } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM receitas WHERE data >= ? AND data <= ?', [dataInicio, dataFim]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma receita encontrada para este período' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar receitas por data' });
    }
});
app.put('/receitas/:id', async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoriaReceitaId } = req.body;
    try {
        const [query] = await connection.execute(
            'UPDATE receitas SET descricao = ?, valor = ?, data = ?, categoria_receita_id = ? WHERE id = ?',
            [descricao, valor, data, categoriaReceitaId, id]
        );
        res.status(200).json({ mensagem: 'Receita atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao atualizar receita' });
    }
});
app.delete('/receitas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('DELETE FROM receitas WHERE id = ?', [id]);
        res.status(200).json({ mensagem: 'Receita deletada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao deletar receita' });
    }
});

app.listen(porta, () => console.log(`Servidor está rodando na porta ${porta}`));
