// dotenv
require("dotenv").config();
process.env.NODE_ENV = "test";
// Setup
// DB(process.env.NODE_ENV);
// ---
const { app } = require("../src/app.js");
const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");

// configure chai for chai-http

chai.use(chaiHttp);

// Authentication block
describe("Authentication Test", () => {
  describe("Registration Test", () => {
    //Required data for a successful registration looks lke
    /* 
      user = {
        name: 'harrison',
        username: 'harrison27',
        password: 'Harrison127',
        confirmPassword: 'Harrison127',
        role: 'talent',
        All these are the required fields
      } 
    */
    it("it should successfully register a user", (done) => {
      const user = {
        name: "harrison",
        username: "harrison27",
        email: "harrison@gmail.com",
        password: "Harrison127",
        confirmPassword: "Harrison127",
        role: "talent",
      };
      chai
        .request(app)
        .post("/auth/register")
        .send(user)
        .then((res) => {
          expect(res.status).to.equal(201);
        })
        .catch((err) => done(err));
        done();
    });

    it("it should return error when required field is missing", (done) => {
      const userIncomplete = {
        username: "harrison27",
        email: "harrison@gmail.com",
        password: "Harrison127",
        confirmPassword: "Harrison127",
        role: "talent",
      }
      chai.request(app).post("/auth/register").send(userIncomplete).then((res) => {
        expect(res.status).to.equal(400);
        expect(res.error).to.be.a('object');
        expect(res.error.name).to.equal('User name is required');
      }).catch((err) => done(err))
      done();
    })
  });
});
