import { useState } from "react";
import useRequest from "../../hooks/use-request"
import Router from 'next/router'
const ViewTicket = ({ ticket }) => {

	const { doRequest, errors } = useRequest({
		url: '/api/orders',
		method: 'post',
		body: {
			ticketId: ticket.id
		},
		//	onSuccess: (order) => console.log(order)
		//onSuccess: (order) => Router.push(`/orders/${order.id}`) //console.log(order)
		onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`) //console.log(order)

	})


	return (
		<div >
			<h1>Title:{ticket.title}</h1>
			<h4>Price:{ticket.price} </h4>
			<br />
			{errors}
			<button onClick={() => doRequest()} className="btn btn-primary">Purchase</button>
		</div>)
}
ViewTicket.getInitialProps = async (context, client) => {
	const { ticketId } = context.query;
	console.log("ticketId:", ticketId);
	const { data } = await client.get(`/api/tickets/${ticketId}`)
	console.log("data:", data);
	return { ticket: data }

}

export default ViewTicket;