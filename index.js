'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import crawler from './src/crawler'
import { check, validationResult } from 'express-validator'





const app = express()

app.use(bodyParser.json())

app.post('/crawl',[
    check('head').isURL()
    
], (req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    return res.json({
        data:"welcome"
    })
})

app.listen(8080, ()=> {console.log('hello')})


