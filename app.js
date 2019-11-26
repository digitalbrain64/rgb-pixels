// getting express
const express = require('express');

// setting the port from the environment or default port 3001
const port = process.env.port || 3001;

// app is now a server
var app = express();


app.use(express.static(__dirname+ '/public/styles'));
app.use(express.static(__dirname+ '/public/resources'));
app.use(express.static(__dirname+ '/public'));
app.use(express.static(__dirname+ '/views'));
app.use(express.static(__dirname+ '/scripts'));


// setting route to index page
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/views/index.html');    
});





// listening on available port (set by cloud or default 3000)
app.listen(port, () =>{
    console.log(`Server is listening on port ${port}`);
});
