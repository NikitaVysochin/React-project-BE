const User = require('../../db/index');
const { secret } = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id, roles) => {
	const payload = {
		id,
		roles
	};
	return jwt.sign(payload, secret);
}

module.exports.createNewUsers = async (req, res) => {
	if (req.body.hasOwnProperty('login') &&
			req.body.hasOwnProperty('password')
	) {
		const { login, password } = req.body;
		const candidate = await User.findOne({ login });
		if (candidate) {
			return res.status(400).json({message: 'user is already reserved'});
		} else {
			const salt = bcrypt.genSaltSync(10);
			
			const passwordToSave = bcrypt.hashSync(password, salt);
			const obj = { login: login, password: passwordToSave };
			const user = new User(obj);
	
			user.save().then(result => {
				const { login, _id } = result;
				const token = generateToken(_id, login);
				res.send({
					data: { login, token },
				});
			});
		}
	}	else {
			res.status(402).send('error in post');
		}
}