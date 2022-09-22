const user_model = require('../models/User')
const bcrypt = require('bcrypt')




const login = async (req, res)=>{
	const user = await user_model.findOne({email:req.body.email})
	if(!user) return redirect("/login")
	console.log(req.body.password)
	console.log(user.password)
	const matched = await bcrypt.compare(req.body.password, user.password)
	console.log(matched)
	if(!matched) return res.redirect('/login')
	req.session.is_auth = true
	req.session.username = user.username
	req.session.email = req.body.email
	res.redirect('/')
}






const register = async (req, res)=>{
	let user = await user_model.findOne({email:req.body.email})
	if(user) return redirect("/register")
	const hash_password = await bcrypt.hash(req.body.password, 10)
	user = new user_model({
		username: req.body.username,
		email: req.body.email,
		password: hash_password,
	})
	await user.save()
	res.redirect('/login')
}



const logout = async (req, res)=>{
    console.log('logout auth')
	req.session.destroy((err)=>{
		if(err) throw err
		res.redirect('/')
	})
}


module.exports = {
    login, register, logout
}