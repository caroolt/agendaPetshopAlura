const Atendimento = require('../models/atendimentos')

module.exports = app => {
    app.get('/atendimentos', res => {
        Atendimento.list(res);
    }); // não sei porque este não está funcionando

    app.get('/atendimentos/:id', (req, res) => { 
        const id = parseInt(req.params.id);
        Atendimento.buscaPorId(id, res);
    })

    app.post('/atendimentos', (req, res) => {
        const atendimento = req.body

        Atendimento.adiciona(atendimento, res);
    })

    app.patch('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const valores = req.body;

        Atendimento.alterar(id, valores, res);
    })

    app.delete('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id);

        Atendimento.deleta(id, res);
    })
}