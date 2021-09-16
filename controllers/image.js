const Clarifai = require ('clarifai');

const app = new Clarifai.App({
  apiKey: '036094c653f64485b1082194d324fd43'
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
  db('users').where('id', '=', id) 
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
  	res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports	= {
	handleImage,
	handleApiCall
}
