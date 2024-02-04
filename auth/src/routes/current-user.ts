import express from 'express';
import { currentUserHandler } from '@myticketingdev/common';
import { requireAuthHandler } from '@myticketingdev/common';

const router=express.Router()

router.get('/api/users/currentuser' ,currentUserHandler, (req,res) =>{
	//if(!req.session || !req.session.jwt)
	console.log('currentuser api')
	res.send({currentUser:req.currentUser || null })
	})

export  {router as currentUserRouter}