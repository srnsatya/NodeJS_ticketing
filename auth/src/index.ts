
import mongoose from 'mongoose'
import { app } from './app';
import { BadRequestError } from '@myticketingdev/common'

const start =async () => {
	console.log('Starting up.....')
	// during start up it will check the secrete is created or not
	if(!process.env.JWT_KEY){
		throw new BadRequestError('JWT_KEY not found!!')
	}else{
		console.log('process.env.JWT_KEY:',process.env.JWT_KEY)
	}
	if(!process.env.MONGO_URI){
		throw new BadRequestError('MONGO_URI not found!!')
	}else{
		console.log('process.env.MONGO_URI:',process.env.MONGO_URI)
	}
	console.log('start connection')

	try{
		 await mongoose.connect(process.env.MONGO_URI)
		 .then(() => console.log('Connected to auth mongo db!'));
	//	await mongoose.connect('mongodb://0.0.0.0:27017/auth').then(() => console.log('Connected to local mongo db!'));
	}catch(err){
		console.error(err)
	}
	console.log('end connection')
	

	app.listen(5000, ()=>{
		console.log('listening port 5000!!!!!!!##!!!!!!!!!')
	})

}
start();
