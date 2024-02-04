
import express,{Request , Response} from 'express';
import { body} from 'express-validator';
import jwt from 'jsonwebtoken';
import { validationHandler ,BadRequestError } from '@myticketingdev/common'
import { Password } from '../utils/Password';
import { User } from '../models/users';
const router=express.Router()

router.post('/api/users/signin'  ,
[
	body('email').isEmail().withMessage('email must be valid'),
	body('password').trim().notEmpty().withMessage('password must be provided')
],validationHandler, async (req: Request,res: Response) =>{
	
	console.log('signin api')
	const {email, password} =req.body
	const existingUser = await User.findOne({email})
	console.log('existingUser:',existingUser)

	if(!existingUser){
		throw new BadRequestError('Incorrect credentials !!')
	}
	const passwordMatch =await Password.compare(existingUser.password,password)
	if(!passwordMatch){
		throw new BadRequestError('Incorrect credentials !!')
	}
	// generate JWT and assign 
	
		const userJwt = jwt.sign({
			id: existingUser.id,
			email: existingUser.email
		} ,process.env.JWT_KEY!)
		req.session ={
			jwt:  userJwt
		}
	
	res.status(200).send(existingUser)

})

export  {router as signInRouter}