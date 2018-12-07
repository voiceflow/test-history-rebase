const {docClient, pool} = require('./../services')
// SECRET
const stripe = require('stripe')('sk_test_pDf3vhMzNkojtn4dqBs9zVsW')
// SECRET
const endpointSecret = 'whsec_1NmXHw7SU5xke899IKE9xgEzsBQfRpO9'

const PLANS = {
	0: {name: 'COMMUNITY'},
	1: {name: 'BASIC'}
}

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
		let plan = req.body.plan
		if(plan in PLANS && req.user.admin < req.body.plan && req.user.admin !== req.body.plan){
			// check if he is on an existing plan
			if(subscription_id){
				await stripe.subscriptions.update(
					subscription_id,
					{items: [{plan: plan}]}
				)
			}else{
				let subscription = await stripe.subscriptions.create({
				  customer: customer_id,
				  items: [{plan: plan}]
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
				await pool.query('UPDATE creators SET admin=0, expiry=NULL WHERE stripe_id = $1', [req.body.data.object.customer])
			}else if(req.body.type === 'invoice.payment_succeeded'){
				// payment succeeded, extend current period by a month
				// and add one extra day of padding
				let expiry = req.body.data.object.period_end + 24*3600

				// get the plan type from the invoice
				console.log(req.body.data.object.lines.data)
				let plan = req.body.data.object.lines.data[0].plan.id
				console.log('new plan', plan)

				if(plan && plan in PLANS){
					await pool.query('UPDATE creators SET expiry=$1, admin=$2 WHERE stripe_id = $3', [expiry, plan, req.body.data.object.customer])
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

