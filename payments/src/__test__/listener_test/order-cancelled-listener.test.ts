import { natsWrapper } from "../../nats-wrapper"
import { OrderCancelledListener } from "../../events/listeners/order-cancelled-listener"
import { OrderCancelledEvent, OrderStatus } from "@myticketingdev/common"
import mongoose from "mongoose"
import { Order } from "../../models/order"
const setup = async ()=>{

	const listener = new OrderCancelledListener(natsWrapper.client)
	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		price: 10,
		userId: 'ababa',
		version: 0
	})
	await order.save()
	const data: OrderCancelledEvent['data'] ={
		id: order.id,
		version: order.version+1,
		userId:'sas',
		ticket:{
			id: 'abcId',
		}
	}

	//@ts-ignore
	const msg: Message ={
		ack:jest.fn()
	}
	return {listener , data , msg , order}
}

it('updates  the order status', async()=>{
	const {listener , data , msg, order } = await setup()
	await listener.onMessage(data, msg)
	const updatedOrder = await Order.findById(order.id)


	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('ack the msg', async()=>{
	const {listener , data , msg, order } = await setup()
	await listener.onMessage(data, msg)

	expect(msg.ack).toHaveBeenCalled()
	
})