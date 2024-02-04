
//import buildClient from "../api/build-client";
import Link from 'next/link'
const LandingPage = ({ currentUser, tickets }) => {
	console.log('currentUser:', currentUser);
	console.log('tickets index.js:', tickets);
	// axios.get('/api/users/currentuser').catch((err) => {
	// 	console.log(err.message);
	// });
	const ticketList = tickets.map(ticket => {
		return (<tr key={ticket.id}>
			<td >{ticket.title}</td>
			<td >{ticket.price}</td>
			<td >
				<Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
					View
				</Link>
			</td>
		</tr>)
	})
	return currentUser ?
		<div>
			<h1> Tickets</h1>
			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Price</th>
						<th>View Ticket</th>
					</tr>

				</thead>
				<tbody>
					{ticketList}
				</tbody>
			</table>
		</div>
		:
		<h2> you are not signed in</h2>
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
	//ingress-nginx-controller.ingress-nginx.svc.cluster.local
	//<servicename>.<namespace>.svc.cluster.local
	//const response=axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser').catch((err) => {
	//  console.log(err.message);
	// });

	// const client = buildClient(context)
	// const {data} = await client.get('/api/users/currentUser')
	// console.log('LandingPage.getInitialProps',data);
	// return data

	const { data } = await client.get('/api/unreservedtickets')
	return { tickets: data }
}
export default LandingPage