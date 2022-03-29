// dotenv
require("dotenv").config();
process.env.NODE_ENV = "test";
// Setup
// DB(process.env.NODE_ENV);
// ---
const app = require("../src/app.js");
const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");

// functions
const { register } = require("../src/modules/controllers/authController");
// const AuthController = require("../src/modules/controllers/authController");

// configure chai for chai-http

chai.use(chaiHttp);

// Authentication block
describe("Authentication Test", () => {
  describe("Registration Test", () => {
    describe("registration error and success", () => {
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
      user = {
        name: "harrison",
        email: "harrison@gmail.com",
        username: "harrison27",
        password: "Harrison127",
        confirmPassword: "Harrison127",
        role: "talent",
      };

      it("it should register a user successfully", () => {
        chai
          .request(app)
          .post("/auth/register")
          .send(user)
          .then((res) => {
            expect(res.status).to.equal(201);
          });
      });

      it("it should return error when required field (name of user) is missing", (done) => {
        const userIncomplete = {
          username: "harrison27",
          email: "harrison@gmail.com",
          password: "Harrison127",
          confirmPassword: "Harrison127",
          role: "talent",
        };
        chai
          .request(app)
          .post("/auth/register")
          .send(userIncomplete)
          .then((res) => {
            expect(res.status).to.equal(406);
            expect(res.body.errors).to.be.an("object");
            expect(res.body.errors.name).to.equal("User name is required");
            done();
          })
          .catch((err) => done(err));
      });

      it("it should return error when username field is less than 3 and more than 21 characters", (done) => {
        const user = {
          name: "harrison",
          username: "ha",
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
            expect(res.status).to.equal(406);
            expect(res.body.errors).to.be.an("object");
            expect(res.body.errors.username).to.be.equal(
              "username must be atleast 3 characters long"
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("it should should test email field ", (done) => {
        const userData = {
          name: "harry",
          username: "Harrison127",
          email: "Harry",
          password: "Harrison127",
          confirmPassword: "Harrison127",
        };
        chai
          .request(app)
          .post("/auth/register")
          .send(userData)
          .then((res) => {
            expect(res.status).to.equal(406);
            expect(res.body.errors.email).to.be.equal(
              "Please provide a valid email"
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("it should test password and confirmPassword fields", (done) => {
        const userData = {
          name: "harry",
          username: "Harrison127",
          email: "Harry@gmail.com",
          password: "Harri",
          confirmPassword: "Harrison127",
        };

        chai
          .request(app)
          .post("/auth/register")
          .send(userData)
          .then((res) => {
            expect(res.status).to.equal(406);
            expect(res.body.errors.password).to.be.equal(
              "Your password must be atleast 6 characters long"
            );
            expect(res.body.errors.confirmPassword).to.be.equal(
              "passwords do not match"
            );
            done();
          })
          .catch((err) => done(err));
      });

      it("should test user roles", (done) => {
        const userData = {
          name: "harrison",
          username: "harrison27",
          email: "harrison@gmail.com",
          password: "Harrison127",
          confirmPassword: "Harrison127",
          role: "somethignRandom",
        };

        chai
          .request(app)
          .post("/auth/register")
          .send(userData)
          .then((res) => {
            expect(res.status).to.equal(406);
            expect(res.body.errors.role).to.be.equal(
              "role must be either researcher, talent, founder, mentor, lead, coop-member, organization, institution or student"
            );
            done();
          })
          .catch((err) => done(err));
      });
    });

    // describe("testing functions in registration function", () => {
    //   it("it should test register error when an error occurs", () => {
    //     const errors = { username: "username must be provided" };
    //     const req = {};
    //     const res = {};
    //     const next = () => {
    //       return;
    //     };
    //     const mockController = sinon.mock(register);
    //     const expectation = mockController.expects(registerError);
    //     expectation.exactly(1);
    //     expectation.withArgs(errors);
    //     register(req, res, next);
    //     mockController.verify();
    //   });
    // });
  });
});
