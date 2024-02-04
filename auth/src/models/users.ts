import mongoose from "mongoose"
import { Password } from "../utils/Password"
interface UserAttrs{
	email: string,
	password: string
}
// interface User Document
interface UserDoc extends mongoose.Document{
	email: string,
	password: string,
//	createdAt: string,
//	updatedAt: string
}

// User model interface
interface UserModel extends mongoose.Model<any>{
	build(attributes: UserAttrs): UserDoc
}
//Schema for mongoose
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}}
	,
	{
		toJSON: {
		transform(doc,ret){
			ret.id=ret._id
			delete ret._id
			delete ret.password
			delete ret.__v
		}
	}
}	
)
userSchema.pre('save', async function(done){
	if(this.isModified('password')){
		const hashedPassword = await Password.toHash(this.get('password'))
		this.set('password',hashedPassword)
	}
	done()
})
//binding build method with specific attributes only to mongoose model
userSchema.statics.build = (attributes: UserAttrs) =>{
	return  new User(attributes)
}

// load schema and get model
const User = mongoose.model<UserDoc,UserModel>('User',userSchema)

/*
const ud=User.build({
	email: 'string',
	password: 'string'

})*/

export {User}