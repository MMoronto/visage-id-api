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

// Update users and login tables
app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
		.then(data => {
			console.log(data);
		})
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
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning("*")
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					})
					.then(user => {
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to register')) 
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id})
		.then(user=> {
			if(user.length) {
			res.json(user[0])
			} else {
				res.status(400).json('not found')
			}
	})
		.catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
	const { id } = req.body;
  db('users').where('id', '=', id) 
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
  	res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, ()=> {
	console.log('app is running on port 3000')
})
