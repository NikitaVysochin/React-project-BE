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
			return res.status(400).json({ message: 'user is already exist' });
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

module.exports.getUser = (req, res) => {
	if (req.body.hasOwnProperty('login') &&
			req.body.hasOwnProperty('password')
	) {
		const { login, password } = req.body;
		
		User.findOne({ login }).then(async (result) => {
			if(!result){
				return res.status(401).json({ message: 'not user' });
			}
			const comp = await bcrypt.compare(password, result.password);
			if (comp) {
					const { login, _id } = result;
					const token = generateToken(_id, login);
					res.send({
						data: { login, _id, token },
					});
			 	return res.status(200).json({ message: 'good' });
			} else {
				res.status(400).send('error');
			}
		});
	}
}