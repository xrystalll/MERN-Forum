const mongoose = require("mongoose");

const DB = require("../src/modules/DB");

const app = require("../src/app");
const User = require("../src/modules/models/User");

const chai = require("chai");
const expect = chai.expect;

const mockUser = {
  name: "harrison",
  username: "harrison27",
  email: "harrison@gmail.com",
  password: "Harrison127",
  confirmPassword: "Harrison127",
  role: "talent",
};

// coonnect DB here
DB((errMsg) => {
  if (errMsg) {
    console.error(errMsg);
  }
});

describe("test for user model", () => {
  before(async () => {
    await User.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("expect the module to exist", () => {
    expect(User).to.not.be.undefined;
  });

  // find, save . update and delete user

  it("it should find a single user", async () => {
    const user = await User.create(mockUser);

    const foundResult = await User.findOne({ name: mockUser.name });
    expect(foundResult).to.be.an("object");
    expect(foundResult.name).to.equal(user.name);
  });

  it("it should find an array of users", async () => {
    const user = await User.create(mockUser);

    const result = await User.find({});
    expect(result).to.be.an("array");
  });

  it("it should save a user to the DB", async () => {
    const user = User(mockUser);
    const savedUser = await user.save();
    expect(savedUser.name).to.equal(user.name);
  });

  it("it should save a user with the create method", async () => {
    const savedUser = await User.create(mockUser);
    const res = await User.findOne({ name: mockUser.name });
    expect(savedUser.name).to.equal(res.name);
  });

  it("it should update a user", async () => {
    const user = await User.create(mockUser);
    const updatedUserObj = { ...mockUser, name: "updated" };
    const findAndUpdate = await User.updateOne(
      { name: user.name },
      updatedUserObj
    );
    const updatedUser = await User.findOne({ name: updatedUserObj.name });
    expect(updatedUser.name).to.equal(updatedUserObj.name);
  });

  it("it should delete User", async () => {
    const user = await User.create(mockUser);
    await User.findOneAndDelete({ name: user.name });
    const emptyUser = await User.findOne();
    expect(emptyUser).to.equal(null);
  });
});
