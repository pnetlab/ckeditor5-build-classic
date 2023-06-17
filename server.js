
const express = require('express');
const app = new express();

app.get('/', function(request, response){
    response.sendFile('./sample/index.html', { root: __dirname });
});

app.use(express.static('build'));
app.use(express.static('tests'));
app.use(express.static('node_modules'));

app.listen(3000);
