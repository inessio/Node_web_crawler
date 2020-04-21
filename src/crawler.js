'use strict'

import cheerio from 'cheerio';
import request from 'request';
import fs from 'fs';


var pagesToVisit = [];
var regexArr = [];
var totalLevel = 0;
var numLevelVisited = 1;
var pagesVisited = new Set();
var file = {}

// crawler function, takes 3 params:
// the domain name, the level and an array of regex you want to match the links found with
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

// check visited pages
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

//visit page, it takes a url and a callback function as params

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
      const links = await searchForLinks($);
      const matchedLinks = await getMatchLinks(links);
      if(matchedLinks === true){
        if(numLevelVisited > totalLevel) {
          fs.appendFileSync('files/result.ndjson',JSON.stringify(file) + '\n' )
            console.log("Reached max limit of number of pages to visit.");
            initializeVariables()
            return true;
          }else{
            numLevelVisited++
            callback(); 
          }
      }else{
        fs.appendFileSync('files/result.ndjson',JSON.stringify(file) + '\n' )
        console.log("no matched link found");
        initializeVariables()
        return true;
      }
      // console.log(pagesVisited)
     
    });
  }catch(error){
    console.log(`Error : ${error}`)
    initializeVariables()
    return false;
  }  
}

//search link while visiting a page
  const searchForLinks = $ => {
    try {
      let totalLinkFound = [];
      const links = $("a[href^='http']");
      links.each(function() {
        totalLinkFound.push($(this).attr('href'));    
      });
      return totalLinkFound;
    } catch (error) {
      console.log("Error: ",error)
      return false;
    }
  
  }

  //get matched link with the regex array 
  
  const getMatchLinks = links => {
    let i = 0;
    if(links.length > 0){
      links.map(link => {
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
    try {
      numLevelVisited = 1;
      file= {};
      totalLevel = 0;
      pagesVisited.clear()
      pagesToVisit =[];
      regexArr = [];
      return true;
    } catch (error) {
      return false;
    }
    
  }
export default crawler
