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

class Despesas {
    constructor(descricao, valor, data, categoriaDespesaId) {
        this.descricao = descricao;
        this.valor = valor;
        this.data = data;
        this.categoriaDespesaId = categoriaDespesaId;
    }
}

// Operação para salvar uma despesa
app.post('/despesas', async (req, res) => {
    const { descricao, valor, data, categoriaDespesaId } = req.body;
    try {
        const [result] = await connection.execute(
            'INSERT INTO despesas (descricao, valor, data, categoria_despesa_id) VALUES (?, ?, ?, ?)',
            [descricao, valor, data, categoriaDespesaId]
        );
        res.status(201).json({ mensagem: 'Despesa criada com sucesso', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao criar despesa' });
    }
});


app.get('/despesas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM despesas WHERE id = ?', [id]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Despesa não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar despesa' });
    }
});

app.get('/despesas/', async (req, res) => {
    try {
        const [query] = await connection.execute('SELECT * FROM despesas');
        if (query.length === 0) return res.status(404).json({ mensagem: 'Despesa não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar despesa' });
    }
});


app.get('/despesas/buscar/:descricao', async (req, res) => {
    const { descricao } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM despesas WHERE descricao LIKE ?', [`%${descricao}%`]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma despesa encontrada' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar despesas por descrição' });
    }
});

app.get('/despesas/buscarPorCategoria/:categoriaId', async (req, res) => {
    const { categoriaId } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM despesas WHERE categoria_despesa_id = ?', [categoriaId]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma despesa encontrada para esta categoria' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar despesas por categoria' });
    }
});

app.get('/despesas/buscarPorData/:dataInicio/:dataFim', async (req, res) => {
    const { dataInicio, dataFim } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM despesas WHERE data >= ? AND data <= ?', [dataInicio, dataFim]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma despesa encontrada para este período' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar despesas por data' });
    }
});
app.put('/despesas/:id', async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoriaDespesaId } = req.body;
    try {
        const [query] = await connection.execute(
            'UPDATE despesas SET descricao = ?, valor = ?, data = ?, categoria_despesa_id = ? WHERE id = ?',
            [descricao, valor, data, categoriaDespesaId, id]
        );
        res.status(200).json({ mensagem: 'Despesa atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao atualizar despesa' });
    }
});

app.delete('/despesas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('DELETE FROM despesas WHERE id = ?', [id]);
        res.status(200).json({ mensagem: 'Despesa deletada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao deletar despesa' });
    }
});

app.listen(porta, () => console.log(`Servidor está rodando na porta ${porta}`));