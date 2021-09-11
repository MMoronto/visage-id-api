const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 't2wycemo',
    password : '',
    database : 'visage-id'
  }
});

const app = express();

const database = {
	users: [
		{
			id: '123',
			name: "Jeffrey",
			password: 'cookies',
			email: 'jeffrey@gmail.com',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: "Sally",
			password: 'bananas',
			email: 'sally@gmail.com',
			entries: 0,
			joined: new Date()
		}
	]
}

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res)=> {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	bcrypt.compare("apples", '$2a$10$pPr6SUQAQ2GZX48mSwUI7uPuzh.9nCIlXlHPDGN4pMnuDacv6lBoy', function(err, res) {
	console.log('first guess', res)
});

bcrypt.compare("veggies", '$2a$10$pPr6SUQAQ2GZX48mSwUI7uPuzh.9nCIlXlHPDGN4pMnuDacv6lBoy', function(err, res) {
	console.log('second guess', res)
});
	if (req.body.email === database.users[0].email &&
			req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	db('users')
		.returning("*")
		.insert({
			email: email,
			name: name,
			joined: new Date()
		})
		.then(user => {
			res.json(user[0]);
		})
		.catch(err => res.status(400).json('unable to register')) 
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	db.select('*').from('users').then(user=> {
		console.log(user)
	})
	if (!found) {
		res.status(400).json('not found');
	}
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++
			return res.json(user.entries);
		}
	})
	if (!found) {
		res.status(400).json('not found');
	}	
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
// 	// Store hash in your password DB.
// });

// // Load hash from your password DB
// bcrypt.compare("bacon", hash, function(err, res) {
// 	// res = true
// });

// bcrypt.compare("veggies", hash, function(err, res) {
// 	// res = false
// });

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