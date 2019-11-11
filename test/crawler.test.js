import chai from 'chai';
import chaiHttp from 'chai-http';
import app  from '../index';

chai.use(chaiHttp);
chai.should()

describe("Web crawler", () => {
    describe("words", ()=> {
        //test to crawl a website 2 deep.
        it("should crawl a website and write matched links into a file ",(done) => {
            chai.request(app)
            .post('/crawl')
            .type('json')
            .send({
                // domain:"https//:meltwater.com",
                "domain":"https://www.meltwater.com",
                "regexes":['facebook','twiter'],
                "numLevels":2
            })
            .end((err,res)=>{
                res.should.have.status(200);
                done();
            })
            
        })
    })
})