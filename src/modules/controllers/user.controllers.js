const User = require('../../db/index');
const Visit = require('../../db/indVisit');
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
					return res.send({data: { login, token }});
			} else {
				return res.status(400).send('error');
			}
		});
	}
}

module.exports.createNewVisit = (req, res) => {
	if (req.body.hasOwnProperty('name') &&
			req.body.hasOwnProperty('doctor') &&
			req.body.hasOwnProperty('date') &&
			req.body.hasOwnProperty('complaint')
	) {
		const { token } = req.headers;
		const IdUser = jwt.verify(token, secret).id;

		if (!token) {
			return res.status(402).send('error in post');
		}
		if (!IdUser) {
			return res.status(401).send('error in post');
		}
		req.body.id_user = IdUser;
		const visit = new Visit(req.body);
		visit.save().then(result => {
			Visit.find({ id_user: IdUser }, ['name', 'doctor', 'date', 'complaint']).then((result) => {
				res.send({
					data: result,
				});
			});
		});
	}	else {
			res.status(402).send('error in post');
		}
}

module.exports.getAllVisits = (req, res) => {
	const { token } = req.headers;

	if (!token) {
		return res.status(402).send('error in post');
	}
	const IdUser = jwt.verify(token, secret).id;
	if (!IdUser) {
		return res.status(401).send('error in post');
	}
  Visit.find({ id_user: IdUser }, ['name', 'doctor', 'date', 'complaint']).then((result) => {
    res.send({
      data: result,
    });
  });
}

module.exports.deleteVisit = (req, res) => {
	const { token } = req.headers;

	if (!token) {
		return res.status(402).send('error in post');
	}
	const IdUser = jwt.verify(token, secret).id;
	if (!IdUser) {
		return res.status(401).send('error in post');
	}
	if (req.query._id) {
		Visit.deleteOne({_id: req.query._id}).then(result => {
			Visit.find({ id_user: IdUser }, ['name', 'doctor', 'date', 'complaint']).then((result) => {
				res.send({
					data: result,
				});
			});
		});
	} else {
		res.status(402).send('error in delete');
	}
}

module.exports.changeVisit = (req, res) => {
	if (req.body.hasOwnProperty('name') &&
			req.body.hasOwnProperty('doctor') &&
			req.body.hasOwnProperty('date') &&
			req.body.hasOwnProperty('complaint') &&
			req.body.hasOwnProperty('_id')
	) {
		const { token } = req.headers;
	
		if (!token) {
			return res.status(402).send('error in post');
		}
		const IdUser = jwt.verify(token, secret).id;
		if (!IdUser) {
			return res.status(401).send('error in post');
		}
		Visit.updateOne(
			{_id: req.body._id}, req.body).then((result) => {
				Visit.find({ id_user: IdUser }, ['name', 'doctor', 'date', 'complaint']).then((result) => {
					res.send({
						data: result,
					});
				});
			}
		);
	}	else {
			res.status(402).send('error in patch');
		}
}
