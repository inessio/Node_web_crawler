Instructions

1. install docker
2. clone the repository using this link: https://github.com/inessio/Node_web_crawler.git
3. cd into the Node_web_crawler folder
4. in the terminal run this command: docker-compose up
5. the application will be running on port 8090. then you can have access to it on http://localhost:8090
6. the endpoint is: '/crawl'
7. sample request : 
{
	"domain":"https://www.meltwater.com",
	"numLevels":"3",
	"regexes":["about","people"]
} 
8. the file is generated in the document folder.
9. thank you 
