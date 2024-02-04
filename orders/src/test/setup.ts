import { MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request  from 'supertest'
import { app } from '../app'
import jwt from 'jsonwebtoken';
jest.mock('../nats-wrapper')
declare global {
	var globalSignupCookie: () => string[];
	var globalSignupCookieP: (id: string,email: string) => string[];
}

let mongo: any
beforeAll(async()=>{
	process.env.JWT_KEY = 'srn'
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	const mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri,{})
})

beforeEach(async() =>{
	jest.clearAllMocks()
	const collections = await mongoose.connection.db.collections();

	for(let collection of collections){
		await collection.deleteMany({})
	}
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
global.globalSignupCookie = () =>{
//Simulate it 

	// build a JWT payload {id,email}
		const payload = {
			id:'asasas',	email:'asasas@email.com'
		}
	// create JWT!
		const token = jwt.sign(payload,process.env.JWT_KEY!)
	// build session object using JWT token
	  const session ={jwt:token}
	// Turn that session into JSON
	  const sessionjson = JSON.stringify(session)
	// Take JSON and encode it to base64
		const base64 = Buffer.from(sessionjson).toString('base64')
	//return string
		return [`session=${base64}`];
}
global.globalSignupCookieP = (id: string,email: string) =>{
	//Simulate it 
	
		// build a JWT payload {id,email}
			const payload = {
				id	,email
			}
		// create JWT!
			const token = jwt.sign(payload,process.env.JWT_KEY!)
		// build session object using JWT token
			const session ={jwt:token}
		// Turn that session into JSON
			const sessionjson = JSON.stringify(session)
		// Take JSON and encode it to base64
			const base64 = Buffer.from(sessionjson).toString('base64')
		//return string
			return [`session=${base64}`];
	}