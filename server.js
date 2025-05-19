const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/html/index.html');
});

app.listen(3000, () => {
    console.log('Serveur en écoute sur http://localhost:3000');
});
