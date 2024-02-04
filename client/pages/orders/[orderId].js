import { useEffect, useState } from "react";
import useRequest from "../../hooks/use-request"
import Router from 'next/router'
import StripeCheckout from 'react-stripe-checkout'
const ViewOrder = ({ order, currentUser }) => {
	const [timeLeft, setTimeLeft] = useState(0)
	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt) - new Date()
			setTimeLeft(Math.round(msLeft / 1000))
		}
		findTimeLeft()
		const timerId = setInterval(findTimeLeft, 1000)

		return () => {
			clearInterval(timerId)
		}

	}, [order])

	const { doRequest, errors } = useRequest({
		url: '/api/payments',
		method: 'post',
		body: {
			orderId: order.id,
		},
		//	onSuccess: (payment) => console.log(payment)
		onSuccess: () => Router.push('/orders')
	})

	if (timeLeft < 0) {
		return (<h4>Sorry !! Order expired </h4>)
	}
	return (

		<div >
			<h2>Payment Page:{order.status}</h2>
			<h4>Ticket Title:{order.ticket.title}</h4>
			<h4>Ticket Price:{order.ticket.price}</h4>
			<h4>Time left to pay : {timeLeft} seconds </h4>
			<StripeCheckout
				token={(token) => {
					console.log('stripe token id', token.id);
					doRequest({ token: token.id })
				}

				}
				stripeKey="pk_test_51OdiO8EifgYH4tRV7sbM7rWyEHffs6qTqFvf45baj4GITwKVQEOCwlbo1Z3CzwKw9vvohrqyYLWjzdsddkC4TElO00l5D6Q1kd"
				amount={order.ticket.price * 100}
				email={currentUser.email}

			/>
			<br />
			{errors}

		</div>)
}
ViewOrder.getInitialProps = async (context, client) => {
	const { orderId } = context.query;
	console.log("orderId:", orderId);
	const { data } = await client.get(`/api/orders/${orderId}`)
	console.log("data:", data);
	return { order: data }

}

export default ViewOrder;