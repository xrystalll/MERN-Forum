const { Types } = require("mongoose");
const createError = require("http-errors");
// const { isJapanese, toRomaji } = require("wanakana");

const User = require("../models/User");
const AuthHistory = require("../models/AuthHistory");

const { registerSchema, loginSchema } = require("../utils/validationSchema");
const { signAccessToken } = require("../utils/jwt");

// Error Handler
const { registerError } = require("../utils/errorHandler");

// UserServices
const UserService = require("../lib/UserService");

// 3rd party libs
const { sendEmail } = require("../utils/emailHandler");

// const toLatin = require("../utils/transliterate");

// const register = async (req, res, next) => {
//   try {
//     const result = await registerSchema.validateAsync(req.body);

//     let name = result.username.toLowerCase().replace(/\s/g, "");
//     // if (/[а-яА-ЯЁё]/.test(name)) {
//     //   name = toLatin(name)
//     // }
//     // if (isJapanese(name)) {
//     //   name = toRomaji(name)
//     // }

//     const forbiddenNames = [
//       "admin",
//       "administrator",
//       "moder",
//       "moderator",
//       "deleted",
//       "user",
//       "test",
//       "qwerty",
//       "12345",
//       "123456789",
//       "1234567890",
//     ];
//     if (forbiddenNames.find((i) => i === name)) {
//       throw createError.Conflict("Username is prohibited");
//     }

//     const userNamedoesExist = await User.findOne({ name });
//     if (userNamedoesExist) {
//       throw createError.Conflict("Username is already been registered");
//     }

//     const emailDoesExist = await User.findOne({ email: result.email });
//     if (emailDoesExist) {
//       throw createError.Conflict("E-mail is already been registered");
//     }

//     let displayName = result.username.replace(/\s/g, "");

//     const now = new Date().toISOString();

//     const user = new User({
//       name,
//       displayName,
//       email: result.email,
//       password: result.password,
//       createdAt: now,
//       onlineAt: now,
//     });
//     const savedUser = await user.save();
//     const accessToken = await signAccessToken(savedUser);

//     const authHistory = new AuthHistory({
//       user: savedUser._id,
//       loginAt: now,
//       ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
//       ua: req.headers["user-agent"],
//     });
//     await authHistory.save();

//     res.json({
//       user: {
//         id: savedUser._id,
//         name: savedUser.name,
//         displayName: savedUser.displayName,
//         picture: savedUser.picture,
//         role: savedUser.role,
//       },
//       accessToken,
//     });
//   } catch (error) {
//     if (error.isJoi === true) error.status = 422;
//     next(error);
//   }
// };

const register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      const userRegisterError = registerError(error);
      return res.status(406).json({ errors: userRegisterError });
    }
    // check if username or email exists
    const errorResponse = await UserService.checkEmailUsername(
      value.email,
      value.username
    );
    if (Object.values(errorResponse).length > 0) {
      return res.status(409).json({ errors: errorResponse });
    }

    const createdAt = new Date().toISOString();

    modifiedValue = { ...value, createdAt };
    // save user to the DB
    const userObj = new User(modifiedValue);
    const user = await userObj.save();

    // get my token for email validation
    const token = await signAccessToken(user);

    // send Email address here awaiting to be verified for 24hrs.
    // sendEmail().then(....) or use try/catch

    // Auth History
    const authHistoryObj = {
      user: user._id,
      loginAt: createdAt,
      ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      ua: req.headers["user-agent"],
      profile: "register",
    };
    const userAuthHistory = await AuthHistory.create(authHistoryObj);

    // continue
    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
      token: token,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginSchema.validateAsync(req.body);

    let name = result.username.toLowerCase().replace(/\s/g, "");
    // if (/[а-яА-ЯЁё]/.test(name)) {
    //   name = toLatin(name);
    // }
    // if (isJapanese(name)) {
    //   name = toRomaji(name);
    // }

    const populate = {
      path: "ban",
      select: "_id expiresAt",
    };
    const user = await User.findOne({ name }).populate(populate);

    if (!user) throw createError.NotFound("User not registered");

    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch)
      throw createError.Unauthorized("Username or password not valid");

    const now = new Date().toISOString();

    if (user.ban) {
      if (user.ban.expiresAt < now) {
        await User.updateOne({ _id: Types.ObjectId(user._id) }, { ban: null });
      } else {
        return res.json({
          ban: {
            userId: user._id,
          },
        });
      }
    }

    const accessToken = await signAccessToken(user);

    const authHistory = new AuthHistory({
      user: user._id,
      loginAt: now,
      ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      ua: req.headers["user-agent"],
    });
    await authHistory.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        displayName: user.displayName,
        picture: user.picture,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    if (error.isJoi === true) {
      return next(createError.BadRequest("Invalid username or password"));
    }
    next(error);
  }
};

module.exports = { register: register, login: login };
