'use strict'

import URL from 'url-parse';
import cheerio from 'cheerio';


var pagesToVisit = [];
var numPagesVisited = 0;
var pagesVisited = new Set(); 

async function crawl(domain, numLevels = 3,regexes = []){
  await pagesToVisit.push(domain);
  if(numPagesVisited >= numLevels) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }
  var nextPage = pagesToVisit.pop();
  if (pagesVisited.has(nextPage)) {
      // We've already visited this page, so repeat the crawl
      crawl();
  } else {
      // New page we haven't visited
      console.log('we are here')
      // visitPage(nextPage, crawl);
  }
}

const visitPage = (url,callback) => {
    pagesVisited.add(url);
    numPagesVisited++
    console.log("Visiting page " + url);
}

export default crawl