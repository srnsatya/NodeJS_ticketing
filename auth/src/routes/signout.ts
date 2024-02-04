import express from 'express';
const router=express.Router()

router.post('/api/users/signout' , (req,res) =>{
	console.log('signout api')
	req.session = null
	res.status(200).send('signout successfully')

})

export  {router as signOutRouter}