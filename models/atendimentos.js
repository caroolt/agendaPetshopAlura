const moment = require('moment')
const axios = require('axios')
const conexao = require('../infrastructure/database/conexao')
const repositório = require('../repositories/atendimento')
class Atendimento {
    constructor(){
        this.dataValida = ({data, dataCriacao}) => moment(data).isSameOrAfter(dataCriacao);
        this.clienteValido = (tamanho) => tamanho >= 5
        this.valida = params => this.validações.filter(campo => {
            const { nome } = campo
            const parametro = params[nome]

            return !campo.valido(parametro)
        })
        this.validacoes = [
            {
                nome: "data",
                valido: this.dataValida,
                mensagem: "Data deve ser posterior ou igual a data atual"
            },
            {
                nome: "cliente",
                valido: this.clienteValido,
                mensagem: "O nome deve ter pelo menos 5 caracteres favor adicione seu sobrenome caso necessário"
            }
        ]
    }
    adiciona(atendimento) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')

        const params = {
            data: { data, dataCriacao},
            cliente: { tamanho: atendimento.cliente.length}
        }

        const erros = this.valida(params)

        const existemErros = erros.length

        if (existemErros) {
            return new Promise((resolve, reject) => reject(erros))
        } else {
            const atendimentoDatado = { ...atendimento, dataCriacao, data }


            return repositório.adiciona(atendimentoDatado)
                .then(resultados => {
                    const id = resultados.insertId
                    return {... atendimento, id}
                })
        }

    };

    list() {
        return repositório.list();
    };

    buscaPorId(id, res) {
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`;

        conexao.query(sql, async (erro, resultados) => {
            const atendimento = resultados[0];
            const cpf = atendimento.cliente;
            if (erro) {
                res.status(400).json(erro);
            } else {
                const { data } = await axios.get(`http://localhost:8082/${cpf}`)

                res.status(200).json({ ...data, atendimento });
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
                            res.status(200).json({ ...valores, id });
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

    deleta(id, res) {
        const sql = "DELETE FROM Atendimentos WHERE id =?"

        conexao.query(sql, id, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json(`O id deletado foi o ${id}`);
            }
        })
    }

};

module.exports = new Atendimento()