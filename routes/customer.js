const {docClient, pool} = require('./../services')

// SECRET TODO:
var endpointSecret = process.env.STRIPE_ENDPOINT_SECRET
const SECRET_KEY = process.env.STRIPE_SK
const stripe = require('stripe')(SECRET_KEY)

const PLANS = [
	{id: 0, name: 'COMMUNITY'},
	{id: 1, name: 'BASIC'}
]

exports.create = async (req, res) => {
	if(!(req.body.source && req.body.source.id && req.body.plan)){
		return res.sendStatus(400)
	}

	try{
		// check for existing stripe customer id
		let {rows} = await pool.query('SELECT stripe_id, subscription FROM creators WHERE creator_id = $1 LIMIT 1', [req.user.id])

		let customer_id = rows[0].stripe_id
		let subscription_id = rows[0].subscription

		if(customer_id){
			customer_id = rows[0].stripe_id
			await stripe.customers.update(customer_id, {
				source: req.body.source.id
			})
		}else{
			const customer = await stripe.customers.create({
			  	email: req.user.email,
			  	metadata: {
			  		id: req.user.id,
			  		name: req.user.name
			  	},
			  	source: req.body.source.id
			})
			await pool.query('UPDATE creators SET stripe_id = $1 WHERE creator_id = $2', [customer.id, req.user.id])
			customer_id = customer.id
		}
		// Add the customer to the subscription
		let plan = PLANS.find(p => p.id === req.body.plan)
		if(plan && req.user.admin < req.body.plan && req.user.admin !== req.body.plan){
			// check if he is on an existing plan
			if(subscription_id){
				await stripe.subscriptions.update(
					subscription_id,
					{items: [{plan: plan.name}]}
				)
			}else{
				let subscription = await stripe.subscriptions.create({
				  customer: customer_id,
				  items: [{plan: plan.name}]
				})
				await pool.query('UPDATE creators SET subscription = $1 WHERE creator_id = $2', [subscription.id, req.user.id])
			}
			
			res.send(customer_id)
		}else{
			return res.status(400).send({message: 'Already Subscribed or Invalid Plan'})
		}
		
	}catch(err){
		console.log(err && err.message)
		res.status(500).send(err)
	}
}

exports.webhook = async (req, res) => {
	// Check Valid Stripe Signature
	try {
    	stripe.webhooks.constructEvent(req.rawBody, req.headers["stripe-signature"], endpointSecret);
  	}catch (err) {
  		console.log(err)
		return res.status(400).end()
	}
	// check correct object type
	if(req.body && req.body.data && req.body.data.object && req.body.data.object.object === 'invoice'){
		try{
			if(req.body.type === 'invoice.payment_failed'){
				// payment failed, reset
				// TODO send customer a email
				await stripe.subscriptions.del(req.body.data.object.lines.data[0].subscription)
				await pool.query('UPDATE creators SET admin=0, expiry=NULL, subscription=NULL WHERE stripe_id = $1', [req.body.data.object.customer])
			}else if(req.body.type === 'invoice.payment_succeeded'){
				// payment succeeded, extend current period by a month
				// and add one extra day of padding
				let expiry = req.body.data.object.lines.data[0].period.end + 24*3600

				// get the plan type from the invoice
				let name = req.body.data.object.lines.data[0].plan.id
				let plan = PLANS.find(p => p.name === name)

				if(plan){
					await pool.query('UPDATE creators SET expiry=$1, admin=$2 WHERE stripe_id = $3', [expiry, plan.id, req.body.data.object.customer])
				}else{
					await pool.query('UPDATE creators SET expiry=$1 WHERE stripe_id = $2', [expiry, req.body.data.object.customer])
				}
			}
			return res.sendStatus(200)
		}catch(err){
			console.log(err)
			return res.status(500).send(err)
		}
	}

	return res.sendStatus(404)
}

