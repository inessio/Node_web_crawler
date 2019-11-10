'use strict'

import URL from 'url-parse';
import cheerio from 'cheerio';
import request from 'request';


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
      visitPage(nextPage,regexes,crawl);
  }
}

const visitPage = (url,regexes,callback) => {
    pagesVisited.add(url);
    numPagesVisited++
    console.log("Visiting page " + url);
    request(url, function(error, response, body) {
      // Check status code (200 is HTTP OK)
      console.log("Status code: " + response.statusCode);
      if(error){
        console.log(`Error: ${error}`);
        return;
      }
      if(response.statusCode !== 200) {
        callback();
        return;
      }
      // Parse the document body
      const $ = cheerio.load(body);
      relativeLinks($,url,regexes)
      // var isWordFound = searchForWord($, "solution");
      // const links = $('a');
      // console.log(links)
      // if(isWordFound) {
      //   console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
      // } else {
      //   collectInternalLinks($);
      //   // In this short program, our callback is just calling crawl()
      //   callback();
      // }
   });

   const relativeLinks = ($,url,regexes) => {

    // var relativeLinks = $("a");
    // console.log("Found " + relativeLinks.length + " relative links on page");
    // relativeLinks.each(() => {
    //     pagesToVisit.push(url + $(this).attr('href'));
    // });
    // console.log(pagesToVisit)
     const links = $("a[href^='http']");
    //  console.log(links)
    console.log("Found " + links.length + " relative links on page");
     links.each(function(){
      pagesToVisit.push($(this).attr('href'));
     })
     console.log(pagesToVisit)
    //  console.log(Object.values(links));
    //  console.log(typeof(Object.values(links)))
    //  Object.entries(links).forEach((item) => {
    //    console.log(typeof(item))
    //    console.log('element of the aray',item)
    //  })
    //  Object.values(links).forEach((link) => {
    //    console.log(link);
    //    return;
    //  })
    //  console.log(regexes)
    //  regexes.map((index,regex) => {

    //  })

   }
}

export default crawl
