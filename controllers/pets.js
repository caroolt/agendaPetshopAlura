const Pets = require ('../models/pets')

module.exports = app => {

    app.post('/pets', (req, res) =>{
        const pet = req.body;

        Pets.adiciona(pet, res);

    })
}