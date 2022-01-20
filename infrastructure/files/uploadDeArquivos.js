const fs = require('fs');
const path = require('path');

// Não é recomendado realizar um buffer porque em casos onde o arquivo é muito grande o buffer demoraria muito a ser realizado, e como  é feito de forma síncrona pararia todo o código
//
// fs.readFile('./assets/salsicha.jpg', (erro, buffer) => {
//     console.log('A imagem foi bufferizada');

//     fs.writeFile('./assets/salsicha-Buffer.jpg', buffer, (erro) => {
//         console.log("Imagem foi escrita")
//     })
// })

module.exports = (caminho, nomeDoArquivo, callbackImagemCriada) => {
    const validTypes = ['jpg', 'png', 'jpeg']
    const type = path.extname(caminho)
    const authorizedType = validTypes.indexOf(type.substring(1))
        !== -1;

    if (authorizedType) {
        const newPath = `./assets/images/${nomeDoArquivo}${type}`
        fs.createReadStream(caminho)
            .pipe(fs.createWriteStream(newPath))
            .on('finish', () => callbackImagemCriada(false, newPath))
        //.on é um trigger (quando tal evento for chamado vc executa X coisa)
    } else {
        console.log(`Erro! Tipo inválido.`)
        const erro = `Erro!, Aceitamos apenas imagens com extensões iguais a: ${validTypes}`
        callbackImagemCriada(erro)
    }
}