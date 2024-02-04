import mongoose from "mongoose"
import { OrderStatus } from "@myticketingdev/common"
import { TicketDoc } from "./ticket"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"
interface orderAttrs{
	status: OrderStatus,
	ticket: TicketDoc,
	expiresAt: Date,
	userId: string

}
interface orderDoc extends mongoose.Document{
	status: OrderStatus,
	ticket: TicketDoc,
	expiresAt: Date,
	userId: string
	version: number
}

interface orderModel extends mongoose.Model<orderDoc>{
	build(attrs: orderAttrs): orderDoc
}
const orderSchema = new mongoose.Schema({
	status:{
		type: String,
		required: true,
		enum: Object.values(OrderStatus),
		default: OrderStatus.Created
	},
	ticket:{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Ticket'
	},
	expiresAt:{
		type: mongoose.Schema.Types.Date
	},
	userId:{
		type: String,
		required: true
	}
},
	{
		toJSON:{
			transform(doc,ret){
					ret.id=ret._id
					delete ret._id
			}
		}
	}	)
orderSchema.set('versionKey','version')
orderSchema.plugin(updateIfCurrentPlugin)
orderSchema.statics.build =(attrs: orderAttrs) =>{
	return new Order(attrs)
}
const Order = mongoose.model<orderDoc,orderModel>('order',orderSchema)
export {OrderStatus}
export {Order}