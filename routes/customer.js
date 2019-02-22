const {docClient, pool, writeToLogs } = require('./../services')

// SECRET TODO:
var endpointSecret = process.env.STRIPE_ENDPOINT_SECRET
const SECRET_KEY = process.env.STRIPE_SK
const stripe = require('stripe')(SECRET_KEY)

const PLANS = [
	{id: 0, name: 'COMMUNITY'},
	{id: 1, name: 'BASIC'},
	{id: 1, name: 'PLUS_348_ANNUAL'},
	{id: 30, name: 'BUSINESS'},
	{id: 30, name: 'BUSINESS_1188_ANNUAL'}
]

const CODES = [
	{
		code: 'P3UO7RAB0MBL',
		plan: 31,
		real_plan: 30,
		price: 1188,
		period: 'yr',
		name: 'BUSINESS_1188_ANNUAL'
	},
	{
		code: 'C8RTXGMV7XQ2',
		plan: 2,
		real_plan: 1,
		price: 348,
		period: 'yr',
		name: 'PLUS_348_ANNUAL'
	}
]

exports.codes = (req, res) => {
	let find = CODES.find(c => c.code === req.params.code)
	if(find){
		res.send(find)
	}else{
		res.sendStatus(404)
	}
}

exports.checkStatus = async (req, res) => {
	try{
		// check for existing stripe customer id
		let {rows} = await pool.query('SELECT stripe_id, subscription FROM creators WHERE creator_id = $1 LIMIT 1', [req.user.id])

		let customer_id = rows[0].stripe_id

		let customer = await stripe.customers.retrieve(customer_id)
		// CUSTOMER NOT FOUND ON STRIPE
		if(!customer || customer.sources.data.length === 0){
			await pool.query('UPDATE creators SET stripe_id = NULL, subscription = NULL WHERE creator_id = $1', [req.user.id])
			return res.sendStatus(404)
		}else if(customer.subscriptions.data.length === 0){
			await pool.query('UPDATE creators SET subscription = NULL WHERE creator_id = $1', [req.user.id])
			return res.sendStatus(404)
		}

		let subscription = customer.subscriptions.data[0]
		let plan_name = subscription.plan.id
		let plan = PLANS.find(p => p.name === plan_name)
		if(plan){
			if(plan.id !== req.user.admin){
				pool.query('UPDATE creators SET admin = $2 WHERE creator_id = $1', [req.user.id, plan.id])
			}
			return res.status(200).send(plan.id.toString())
		}
		res.sendStatus(404)

	}catch(err){
		console.log(err && err.message)
		res.status(500).send(err)
	}
}

exports.create = async (req, res) => {
	if(!req.body.plan){
		return res.sendStatus(400)
	}

	try{
		// check for existing stripe customer id
		let {rows} = await pool.query('SELECT stripe_id, subscription FROM creators WHERE creator_id = $1 LIMIT 1', [req.user.id])

		let customer_id = rows[0].stripe_id
		let subscription_id = rows[0].subscription

		if(req.body.source && req.body.source.id){
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
		}else{
			try{
				if(!customer_id) throw null
				let customer = await stripe.customers.retrieve(customer_id)
				if(!customer || customer.sources.data.length === 0) throw null
			}catch(err){
				return res.status(400).send({message: 'No Previous Customer Data'})
			}
		}

		// Add the customer to the subscription
		let plan
		if(req.body.promo){
			let find = CODES.find(c => c.code === req.body.promo)
			if(find){
				plan = find.name
			}else{
				return res.status(400).send({message: 'Invalid Promotional Code'})
			}
		}else{
			plan = PLANS.find(p => p.id === req.body.plan)
			plan = plan && plan.name
		}
		if(plan && req.user.admin !== req.body.plan && req.user.admin < req.body.plan){
			// check if he is on an existing plan
			if(subscription_id){
				// UPDATE SAID PLAN
				const subscription = await stripe.subscriptions.retrieve(subscription_id);
				stripe.subscriptions.update(subscription_id, {
					cancel_at_period_end: false,
					items: [{
						id: subscription.items.data[0].id,
						plan: plan
					}]
				})
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
  		writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
		return res.status(400).end()
	}

	// check correct object type
	if(req.body && req.body.data && req.body.data.object){
		try{
			if(req.body.type === 'invoice.payment_failed'){
				// payment failed, reset
				// TODO send customer a email
				await stripe.subscriptions.del(req.body.data.object.lines.data[0].subscription)
				await pool.query('UPDATE creators SET admin=0, expiry=NULL, subscription=NULL WHERE stripe_id = $1', [req.body.data.object.customer])
			}else if(req.body.type === 'invoice.payment_succeeded' || req.body.type === 'customer.subscription.updated'){
				let expiry, name
				if(req.body.type === 'invoice.payment_succeeded'){
					// payment succeeded, extend current period by a month
					// and add one extra day of padding
					expiry = req.body.data.object.lines.data[0].period.end + 24*3600

					// get the plan type from the invoice
					name = req.body.data.object.lines.data[0].plan.id
				}else{
					expiry = req.body.data.object.current_period_end + 24*3600
					name = req.body.data.object.plan.id
				}

				let plan = PLANS.find(p => p.name === name)

				if(plan){
					await pool.query('UPDATE creators SET expiry=$1, admin=$2 WHERE stripe_id = $3', [expiry, plan.id, req.body.data.object.customer])
				}else{
					await pool.query('UPDATE creators SET expiry=$1 WHERE stripe_id = $2', [expiry, req.body.data.object.customer])
				}
			}
			return res.sendStatus(200)
		}catch(err){
			writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
			return res.status(500).send(err)
		}
	}

	return res.sendStatus(404)
}

