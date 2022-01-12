const {secret} = require('config');
const User = require('../../db/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id, roles) => {
	const payload = {
		id,
		roles
	}
	return jwt.sign(payload, secret)
}

module.exports.createNewUsers = (req, res) => {
	const salt = bcrypt.genSaltSync(10);
	const myPlaintextPassword = req.body.password;
	const passwordToSave = bcrypt.hashSync(myPlaintextPassword, salt);
	const obj = {login: req.body.login, password: passwordToSave};
	const user = new User(obj);
	
	if (req.body.hasOwnProperty('login') &&
			req.body.hasOwnProperty('password')
	) {
		user.save().then(result => {
			const {login} = result;
			const token = generateToken(result._id, result.login);
			res.send({
				data: {login, token},
			});
		});
		
	}	else {
			res.status(402).send('error in post');
		}
}