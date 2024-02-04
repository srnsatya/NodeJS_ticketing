import express,{Request , Response} from 'express';
import jwt from 'jsonwebtoken';

import { body} from 'express-validator';
import { User } from '../models/users';
import { validationHandler ,BadRequestError } from '@myticketingdev/common'

const router=express.Router()

router.post('/api/users/signup' ,
[
	body('email').isEmail().withMessage('email must be provided'),
	body('password').trim().isLength({min:4,max:20}).withMessage('password must ber 4 to 20 characters')
],validationHandler,
 async (req: Request,res: Response) =>{
	console.log('signup api')
	
	const {email, password} =req.body
	const existingUser = await User.findOne({email})
	console.log('existingUser:',existingUser)

	if(existingUser){
		throw new BadRequestError('User already exists with same email!!')
	}else{
		console.log('user creating')
		const ud=User.build({
			email: email,
			password: password
		
		})
		await ud.save()
		// generate JWT and assign 
		
			const userJwt = jwt.sign({
				id: ud.id,
				email: ud.email
			} ,process.env.JWT_KEY!)
			req.session ={
				jwt:  userJwt
			}
		
		
		res.status(201).send(ud)
	}

})

export  {router as signUpRouter}