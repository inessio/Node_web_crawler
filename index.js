'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import crawler  from './src/crawler'
import { check, validationResult } from 'express-validator'


const app = express();
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.post('/crawl',[
    check('domain')
    .not()
    .isEmail()
    .isURL(),
    check('numLevels').isNumeric(),
    check('regexes').isArray().not().isEmpty()
    
], async (req,res) => {
    const request = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    await crawler(request.domain,request.numLevels,request.regexes);  // crawler;
    return res.json({
        response:"success"
    })
})

app.listen(PORT,HOST);
console.log(`Server running  on: http://${HOST}:${PORT}`);
export default app;


