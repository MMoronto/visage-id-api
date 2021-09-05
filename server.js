const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
const database = {
	users: [
		{
			id: '123';
			name: "Jeffrey",
			email: 'jeffrey@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124';
			name: "Sally",
			email: 'sally@gmail.com',
			password: 'funions',
			entries: 0,
			joined: new Date()
		}
	]
}

app.get('/', (req, res)=> {
	res.send('this is working');
})

app.post('/signin', (req, res) => {
	if (req.body.email === database.users[0].email &&
			req.body.password === database.users[0].password) {
		res.json('success');
	} else {
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) => {
	console.log('app is running on port 3000');
})

app.listen(3000, ()=> {
	console.log('app is running on port 3000')
})

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/