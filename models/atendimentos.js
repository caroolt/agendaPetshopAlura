const moment = require('moment')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')

        const dataValida = moment(data).isSameOrAfter(dataCriacao);
        const clienteValido = atendimento.cliente.length >= 5

        const validacoes = [
            {
                nome: "data",
                valido: dataValida,
                mensagem: "Data deve ser posterior ou igual a data atual"
            },
            {
                nome: "cliente",
                valido: clienteValido,
                mensagem: "O nome deve ter pelo menos 5 caracteres favor adicione seu sobrenome caso necessário"
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido);

        const existemErros = erros.length

        if (existemErros) {
            res.status(300).json(erros)
        } else {
            const atendimentoDatado = { ...atendimento, dataCriacao, data }

            const sql = 'INSERT INTO Atendimentos SET ?'

            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro)
                } else {
                    res.status(201).json(atendimento)
                }
            })
        }

    };

    list(res) {
        const sql = 'SELECT * FROM Atendimentos';

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json(resultados);
            }

        });
    };

    buscaPorId(id, res) {
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`;

        conexao.query(sql, (erro, resultados) => {
            const atendimento = resultados[0];
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json(atendimento);
            }

        });
    };

    alterar(id, valores, res) {
        const getDataCriacao = `SELECT * FROM Atendimentos WHERE id=${id}`

        conexao.query(getDataCriacao, (erro, resultados) => {
            const atendimento = resultados[0];
            if (erro) {
                res.status(400).json(erro);
            } else {
                if (valores.data) {
                    valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
                }
                const validacao = moment(valores.data).isSameOrAfter(atendimento.dataCriacao);
                if (validacao) {
                    const sql = 'UPDATE Atendimentos SET ? WHERE id=?'

                    conexao.query(sql, [valores, id], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro)
                        } else {
                            res.status(200).json({...valores, id});
                        }
                    })
                } else {
                    const tratamentoErro = [
                        {
                            nome: "data",
                            valido: false,
                            mensagem: `Data deve ser posterior ou igual a data de criação que é ${moment(atendimento.dataCriacao, 'YYYY-MM-DD HH:MM:SS').format('DD/MM/YYYY')}`
                        }
                    ]
                    const erros = tratamentoErro.filter(campo => !campo.valido);
                    res.status(400).json(erros)
                }
            }

        });
    };

    deleta(id, res){
        const sql = "DELETE FROM Atendimentos WHERE id =?"

        conexao.query(sql, id, (erro, resultados)=>{
            if(erro){
                res.status(400).json(erro);
            }else {
                res.status(200).json(`O id deletado foi o ${id}`);
            }
        })
    }

};

module.exports = new Atendimento