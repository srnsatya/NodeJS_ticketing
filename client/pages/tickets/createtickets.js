import { useState } from "react";
import useRequest from "../../hooks/use-request"
import Router from 'next/router'
const createTickets =  ()=>{
	const [title,setTitle] = useState('')
	const [price,setPrice] = useState('')
	const onBlur = () =>{
		const value = parseFloat(price)
		if(isNaN(value)){
			return;
		}
		setPrice(value.toFixed(2))
	}
	const {doRequest,errors}=useRequest({
		url:'/api/tickets',
		method:'post',
		body:{
			title,price
		},
		onSuccess: (ticket) => Router.push("/")
	})
	const onSubmit = async (event)=>{
		
		console.log('submitted title , price - ',title,' - ',price)
		event.preventDefault()
		await doRequest()
	}
return (
					
					<form onSubmit={onSubmit}>
							<h1> Create a Ticket</h1>
							<div class = "form-group">
								<label>Title</label>
								<input 
								value={title} 
								onChange ={(e)=>setTitle(e.target.value)}	
								className="form-control"/>
							</div>
							<div class = "form-group">
								<label>price</label>
								<input  
								value={price} 
								onBlur={onBlur}
								onChange ={(e)=>setPrice(e.target.value)}	
								className="form-control"/>
							</div>
							<br />
							{errors}
							<button className="btn btn-primary">Create Ticket</button>

					</form>)
}

export default createTickets;