const express = require("express");

const router = express.Router();
const AuthController = require("../modules/controllers/authController");

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - name
 *              - username
 *              - email
 *              - password
 *              - confirmPassword
 *              - role
 *          properties:
 *              name:
 *                  type: string
 *                  description: Name represents the user's name
 *              username:
 *                  type: String
 *                  description: username for the username, which will acts as display name. Must be between 3 and 21
 *              email:
 *                  type: string
 *                  description: user's email required for email validation/authentication.
 *              password:
 *                  type: string
 *                  description: user's password for signup. Must be atleast 6 and 50 characters.
 *              confirmPassword:
 *                  type: string
 *                  description: must be the same as user password.
 *              role:
 *                  type: string
 *                  description: must be within these provided [""researcher", "talent", "founder", "mentor", "lead", "coop-member", "organization","institution","student"]
 *          example:
 *              name: harrison
 *              username: harrison27
 *              password: Harrison127
 *              confirmPassword: Harrison127
 *              role: talent
 *
 */

/**
 * @swagger
 * /auth/register:
 *  post:
 *      summary: create a new user with 201 resonse
 *       responses:
 *           200:
 *              content:
 *                  application/json
 *                      schema:
 *                          type: object
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *
 */

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

module.exports = router;
