import chai from 'chai';
import chaiHttp from 'chai-http';
import app  from '../index';

chai.use(chaiHttp);
chai.should()

describe("Web crawler", () => {
    describe("crawler", ()=> {
        //test to crawl a website 2 deep.
        it("should not pass if not valid domain name.",(done) => {
            chai.request(app)
            .post('/crawl')
            .type('json')
            .send({
                // domain:"https//:meltwater.com",
                "domain":"https:www.meltwater.com",
                "regexes":['facebook','twiter'],
                "numLevels":2
            })
            .end((err,res)=>{
                res.should.have.status(422);
                done();
            })
            
        })
    });
    describe("crawler", ()=>{
        it("should not pass if not valid domain name.",(done) => {
            chai.request(app)
            .post('/crawl')
            .type('json')
            .send({
                "domain":"https:www.meltwater.com",
                "regexes":['facebook','twiter'],
                "numLevels":2
            })
            .end((err,res)=>{
                res.should.have.status(422);
                done();
            })
            
        })
    })
})