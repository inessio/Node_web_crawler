'use strict'

import URL from 'url-parse';
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
    if (nextPage in pagesVisited) {
    crawl();
    } else {
    visitPage(nextPage,crawl);
   }
  }
  console.log('No matched links found')
  return;
  

}

const visitPage = (url,callback) => {
  try{
    pagesVisited.add(url);
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
      await getMatchLinks();
      if(numLevelVisited > totalLevel) {
        fs.appendFileSync('result.ndjson',JSON.stringify(file) + '\n' )
          console.log("Reached max limit of number of pages to visit.");
          return;
        }else{
          numLevelVisited++
          callback(); 
        }
    });
  }catch(error){
    console.log(`Error : ${error}`)
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
    if(totalLinkFound.length > 0){
      totalLinkFound.map(link => {
        regexArr.map(regex => {
          regex = new RegExp(regex)
          if(regex.test(link) === true){
            file[regex].push(link) + '\n'
            pagesToVisit.push(link)
          }
        })
      })
    }
  }
export default crawler
