import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client'
import header from '../components/header'
import Header from '../components/header'
//this is main/master APP component
const AppComponent= ({Component , pageProps,currentUser}) =>{

	return <div className="container">
					<Header currentUser={currentUser}></Header>
					<Component currentUser={currentUser} {...pageProps} />
				</div>
	
}

AppComponent.getInitialProps= async appContext => {
	console.log('AppComponent appContext',appContext)

	const client =buildClient(appContext.ctx)
	const {data} = await client.get('/api/users/currentUser')
	//console.log('AppComponent data',data)

	let pageProps ={}
	if(appContext.Component.getInitialProps){
		pageProps = await appContext.Component.getInitialProps(appContext.ctx,client,data.currentUser)

	}
	console.log('AppComponent pageProps',pageProps)
	return {
		pageProps,
	//	currentUser:data.currentUser
		...data
	}
}

export default AppComponent