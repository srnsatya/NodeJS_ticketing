
//import buildClient from "../api/build-client";
import Link from 'next/link'
const OrderIndex = ({ orders }) => {


	return <ul>{
		orders.map(order => {
			return <li key={order.id}>{order.ticket.title} - {order.status}</li>
		})
	}</ul>

}

OrderIndex.getInitialProps = async (context, client) => {
	//ingress-nginx-controller.ingress-nginx.svc.cluster.local
	//<servicename>.<namespace>.svc.cluster.local
	//const response=axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser').catch((err) => {
	//  console.log(err.message);
	// });

	// const client = buildClient(context)
	// const {data} = await client.get('/api/users/currentUser')
	// console.log('OrderIndex.getInitialProps',data);
	// return data

	const { data } = await client.get('/api/orders')
	return { orders: data }
}
export default OrderIndex