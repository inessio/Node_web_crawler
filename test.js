var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs')
var URL = require('url-parse');

var START_URL = "http://www.google.com";
var SEARCH_WORD = ["/about/","/people/"];
var MAX_PAGES_TO_VISIT = 3;

var pagesVisited = {};
var numPagesVisited = 1;
var foundLink = [];
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;
var file = {}

pagesToVisit.push(START_URL);

SEARCH_WORD.map(item => {
  regex = new RegExp(item)
  file[regex] = []
})

// console.log(file)
// return;
processor();
async function processor(){
  await crawl();
  return true;
}

// if(processor()){
  
// }

// for (let index = 0; index < MAX_PAGES_TO_VISIT; index++) {
// if(numPagesVisited >= MAX_PAGES_TO_VISIT ){
//   console.log('Maximum attempt')
//   return;
// }
// numPagesVisited++
// crawl();
  
// }


function crawl() {
  // console.log(pagesToVisit.length)
  // if(pagesToVisit.length > 0){
    var nextPage = pagesToVisit.pop();
    console.log('page to visit',nextPage);
    if (nextPage in pagesVisited) {
        console.log("where")
      // We've already visited this page, so repeat the crawl
      crawl();
    } else {
      // New page we haven't visited
      // if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
      //   console.log("Reached max limit of number of pages to visit.");
      //   return;
      // }
        // numPagesVisited++
        // console.log("******* stage " +numPagesVisited);
        visitPage(nextPage,crawl);
      
    }
  // }
  // console.log('empty array')

}

function visitPage(url, callback) {
  // Add page to our set
  pagesVisited[url] = true;

  // Make the request
  console.log("Visiting page " + url);
  request(url, async function(error, response, body) {
   
     // Check status code (200 is HTTP OK)
     console.log("Status code: " + response.statusCode);
     if(response.statusCode !== 200) {
       callback();
       return;
     }
     // Parse the document body
     var $ = cheerio.load(body);
     await collectInternalLinks($);
     await searchForWord();
    //  SEARCH_WORD.map(world => {
    //    console.log('--------------------'+world+'-------------------')
      // var isWordFound = searchForWord($, world);
      // if(isWordFound) {
      //   foundLink.push(url);
      //   console.log('Word ' + world + ' found at page ' + url);
      // } 
      //  collectInternalLinks($);
       // In this short program, our callback is just calling crawl()
       if(numPagesVisited >MAX_PAGES_TO_VISIT) {
        fs.appendFileSync('result.ndjson',JSON.stringify(file) + '\n' )
          console.log("Reached max limit of number of pages to visit.");
          return;
        }else{
          console.log(`******************* round ${numPagesVisited} ******************`)
          numPagesVisited++
          callback();
          // console.log(pagesToVisit)
        }
        // console.log(file)

      //  
      // }
     
    //  })

    //  console.log(pagesToVisit)
    //  console.log(file)
     
  });
}

function searchForWord() {
  if(foundLink.length > 0){
    foundLink.map(link => {
      SEARCH_WORD.map(regex => {
        // console.log('trying...... ', regex)
        regex = new RegExp(regex)
        if(regex.test(link) === true){
          file[regex].push(link)
          // console.log(`check ${regex} : got ${link}`);
          pagesToVisit.push(link)
        }
      })
    })
  }
  // var bodyText = $('html > body').text().toLowerCase();
  // return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='http']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function() {
      foundLink.push($(this).attr('href'));
    });
}