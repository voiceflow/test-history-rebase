const { pool, hashids, writeToLogs } = require('../../services');
const puppeteer = require('puppeteer');
const path = require('path')

const layouts = require('./apl_authoring_tool/authoring_tool_files/alexa-layouts.json');
const styles = require('./apl_authoring_tool/authoring_tool_files/alexa-styles.json');
const viewport_profiles = require('./apl_authoring_tool/authoring_tool_files/alexa-viewport-profiles.json');

exports.getDisplay = (req, res) => {
	let id = hashids.decode(req.params.id)[0];
	if(!id){
		res.sendStatus(404);
	}else{
		pool.query('SELECT * FROM displays WHERE id = $1 AND creator_id = $2 LIMIT 1', 
			[id, req.user.id], (err, result) =>{
			if(err){
				res.sendStatus(500);
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
			}else if(result.rows.length === 0){
				res.sendStatus(404);
			}else{
				result.rows[0].id = hashids.encode(result.rows[0].id);
				res.send(result.rows[0]);
			}
		})
	}
}

exports.getDisplays = (req, res) => {
	let skill_id = hashids.decode(req.query.skill_id)[0]
	if(isNaN(skill_id)){
		res.sendStatus(400)
	}else{
		pool.query('SELECT * FROM displays WHERE creator_id = $1 AND (skill_id = $2 OR skill_id IS NULL)', [req.user.id, skill_id], (err, result)=>{
			if(err){
				res.sendStatus(500)
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
			}else{
				res.send(result.rows.map(row => {
					row.id = hashids.encode(row.id);
					return row;
				}));
			}
		})
	}
}

exports.setDisplay = (req, res) => {
	let id = hashids.decode(req.params.id)[0];

	let skill_id = hashids.decode(req.query.skill_id)[0]
	if(isNaN(skill_id)){
		return res.sendStatus(400)
	}

	if(id){
		pool.query(
		'UPDATE displays SET title = $3, description = $4, document = $5, datasource = $6, skill_id = $7, modified = NOW() WHERE creator_id = $1 AND id = $2',
		[req.user.id, id, req.body.title, req.body.description, req.body.document, req.body.datasource, skill_id], (err) => {
			if(err){
				res.sendStatus(500);
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
			}else{
				res.sendStatus(200);
			}
		});
	}else{
		pool.query(
		'INSERT INTO displays (creator_id, title, description, document, datasource, created_at, modified, skill_id) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6) RETURNING id',
		[req.user.id, req.body.title, req.body.description, req.body.document, req.body.datasource, skill_id], (err, result) => {
			if(err){
				res.sendStatus(500);
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
			}else{
				res.send(hashids.encode(result.rows[0].id));
			}
		});
	}	
}

exports.deleteDisplay = (req, res) => {
	let id = hashids.decode(req.params.id)[0];
	if(!id){
		res.sendStatus(404);
	}else{
		pool.query('DELETE FROM displays WHERE id=$1 AND creator_id=$2', [id, req.user.id], err =>{
			if(err){
				res.sendStatus(500);
				writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
			}else{
				res.sendStatus(200);
			}
		})
	}
}

exports.renderDisplay = async (req, res) => {
	const id = hashids.decode(req.params.id)[0];
	let datasource = req.body.datasource

	let document = await new Promise(resolve => {
		pool.query('SELECT document FROM displays WHERE id = $1 AND creator_id = $2 LIMIT 1', 
		[id, req.user.id], (err, result) =>{
			if(err || result.rows.length === 0){
				resolve(null)
			}else{
				resolve(result.rows[0].document);
			}
		})
	})

	try {
		document = JSON.parse(document)
		if (document.dataSources) {
			datasource = JSON.stringify(document.dataSources)
		}
		if (document.document) {
			document = document.document
		}
		document = JSON.stringify(document)
	} catch (e) {
		// document unchanged
	}

	// You haven't seen jank like this. brace urself
    const browser = await puppeteer.launch({
		args: ['--no-sandbox']
	});
	const page = await browser.newPage();
	await page.setRequestInterception(true);

	const fileUrl = `file://${path.join(__dirname, 'apl_authoring_tool/authoring_tool.html')}`

	page.on('request', (request) => {
		if (request.url() === 'https://d2na8397m465mh.cloudfront.net/packages/alexa-layouts/1.0.0/document.json') {
			request.respond({
				content: 'application/json',
				headers: {"Access-Control-Allow-Origin": "*"},
				body: JSON.stringify(layouts)
			});
		} else if (request.url() === 'https://d2na8397m465mh.cloudfront.net/packages/alexa-styles/1.0.0/document.json') {
			request.respond({
				content: 'application/json',
				headers: {"Access-Control-Allow-Origin": "*"},
				body: JSON.stringify(styles)
			});		
		} else if (request.url() === 'https://d2na8397m465mh.cloudfront.net/packages/alexa-viewport-profiles/1.0.0/document.json') {
			request.respond({
				content: 'application/json',
				headers: {"Access-Control-Allow-Origin": "*"},
				body: JSON.stringify(viewport_profiles)
			});
		} else if ((/file:\/\//i).test(request.url()) || (/\.(gif|jpg|jpeg|tiff|png)$/i).test(request.url())) {
			request.continue()
		} else {
			request.respond({
				content: 'application/json',
				headers: {"Access-Control-Allow-Origin": "*"},
				body: 'BLOCKED'
			})
		}
	});

	await page.setViewport({
		width: 1920,
		height: 1080,
		deviceScaleFactor: 2
	})

	await page.goto(fileUrl)
	await page.mouse.click(1512, 225)
	await page.mouse.click(844, 590)

	let elementHandle=await page.$('.ace_content');
	await elementHandle.click();
	await elementHandle.focus();
	// click three times to select all
	await elementHandle.click({clickCount: 3});
	await elementHandle.press('Backspace');

	const insertText = (text) => {
		const editor = ace.edit("brace-editor");
		editor.getSession().setValue(text);
	}

    await page.evaluate(insertText, document);
	await page.mouse.click(203, 590)

	elementHandle = await page.$('.ace_content');
	await elementHandle.click();
	await elementHandle.focus();
	// click three times to select all
	await elementHandle.click({clickCount: 3});
	await elementHandle.press('Backspace');

	await page.evaluate(insertText, datasource);
	
	await page.waitFor(2500);

	elementHandle = await page.$('#apml-renderer')

    const screenshot = await elementHandle.screenshot();

    await browser.close();
	res.send(screenshot.toString('base64'))
}