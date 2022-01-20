const conexao = require('../infrastructure/database/conexao')
const uploadDeArquivo = require('../infrastructure/files/uploadDeArquivos')

class Pets {
    adiciona(pet, res) {
        const query = 'INSERT INTO Pets SET ?'

        uploadDeArquivo(pet.imagem, pet.nome, (erro, newPath) => {
            if (erro) {
                res.status(400).json({ erro });
            } else {
                const novoPet = { nome: pet.nome, imagem: newPath }
                conexao.query(query, novoPet, (erro) => {
                    if (erro) {
                        res.status(400).json(erro);
                    } else {
                        res.status(201).json(novoPet)
                    }
                })
            }

        })

    }
}

module.exports = new Pets()