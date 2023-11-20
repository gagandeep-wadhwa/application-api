var express = require('express');
var app = express();

app.use(express.json());

app.post('/game', function (req, res) {
    res.header({'Content-Type': 'application/json'});
	res.send({ ...req.body });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.listen(3001, function () {
	  console.log('Started the container on '+3001);
});
app.listen(3002, function () {
    console.log('Started the container on '+3002);
});
app.listen(3003, function () {
    console.log('Started the container on '+3003);
});