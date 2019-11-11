'use strict'

import cheerio from 'cheerio';
import request from 'request';
import fs from 'fs';


var pagesToVisit = [];
var regexArr = [];
var totalLevel = 0;
var numLevelVisited = 1;
var pagesVisited = new Set();
var totalLinkFound = [];
var file = {}

const crawler = (domain, numLevels = 3, regexes=[]) => {
  regexArr = regexes;
  pagesToVisit.push(domain);
  totalLevel = numLevels;
  regexArr.map(item => {
    let regex = new RegExp(item)
    file[regex] = []
  })
  crawl();
 
}

const crawl = () => {
  if(pagesToVisit.length > 0){
    var nextPage = pagesToVisit.pop();
    if (pagesVisited.has(nextPage)) {
       crawl();
    } else {
      visitPage(nextPage,crawl);
    }
  }
  console.log(pagesToVisit)
    
}

const visitPage = (url,callback) => {
  try{
    pagesVisited.add(url);
    console.log(`Visiting ... ${url}`);
    request(url, async function(error, response, body) {
      if(error){
        console.log('Error: ', error)
        return;
      }
      console.log("Status code: " + response.statusCode);
      if(response.statusCode !== 200) {
        callback();
        return;
      }
      var $ = cheerio.load(body);
      await searchForLinks($);
      const matchedLinks = await getMatchLinks();
      if(matchedLinks === true){
        if(numLevelVisited > totalLevel) {
          fs.appendFileSync('result.ndjson',JSON.stringify(file) + '\n' )
            console.log("Reached max limit of number of pages to visit.");
            initializeVariables()
            return;
          }else{
            numLevelVisited++
            callback(); 
          }
      }else{
        fs.appendFileSync('result.ndjson',JSON.stringify(file) + '\n' )
        console.log("no matched link found");
        initializeVariables()
        return;
      }
      // console.log(pagesVisited)
     
    });
  }catch(error){
    console.log(`Error : ${error}`)
    initializeVariables()
  }  
}

  const searchForLinks = $ => {
    try {
      const links = $("a[href^='http']");
      links.each(function() {
        totalLinkFound.push($(this).attr('href'));    
      });
    } catch (error) {
      console.log("Error: ",error)
    }
  
  }

  const getMatchLinks = () => {
    let i = 0;
    if(totalLinkFound.length > 0){
      totalLinkFound.map(link => {
        regexArr.map(regex => {
          regex = new RegExp(regex)
          if(regex.test(link) === true){
            i++
            file[regex].push(link)
            pagesToVisit.push(link)  
          }
        })
      })
    }
    if(i > 0){
      return true;
    }
    return false;
  }

  const initializeVariables = () => {
    numLevelVisited = 1;
    file= {};
    totalLevel = 0;
    totalLinkFound = [];
    pagesVisited.clear()
    pagesToVisit =[];
    regexArr = [];
  }
export default crawler
