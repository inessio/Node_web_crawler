'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import crawler  from './src/crawler'
import { check, validationResult } from 'express-validator'


const app = express()

app.use(bodyParser.json())

app.post('/crawl',[
    check('domain').isURL()
    
], async (req,res) => {
    const request = req.body
    // console.log('request', request)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    await crawler(request.domain,request.numLevels,request.regexes);  // crawler;
    return res.json({
        response:"success"
    })
})

app.listen(8090, ()=> {console.log('hello')})


