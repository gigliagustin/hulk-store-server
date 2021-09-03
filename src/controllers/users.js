import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Role from '../models/role';
import { Roles } from '../res/globals';
export default class UserController {

    static async register(req, res, next) {
        try {
            // Get user input
            const { email, password, name, surname } = req.body;

            // Validate user input
            if (!(email && password && name && surname)) {
                throw "Todos los campos son obligatorios";
            }

            // Validate if user exist in our database
            const oldUser = await User.findOne({ email });

            if (oldUser) {
                throw `Usuario ya existe con el correo ${email}`;
            }

            // Encrypt user password
            const encryptedPassword = await bcrypt.hash(password, 10);

            // Create user 
            const user = new User({
                email: email.toLowerCase(), // sanitize: convert email to lowercase
                password: encryptedPassword,
                name,
                surname,
                status: true,
                role: mongoose.Types.ObjectId(Roles.employee)
            });

            await user.save();

             // Get role
             const role = await Role.findOne({ _id: mongoose.Types.ObjectId(Roles.employee) });

            // Create token
            const token = jwt.sign(
                { user_id: user._id, email, user_role: role.keyName },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // Save user token
            user.token = token;

            const response = {
                'status': {
                    'code': 0,
                    'message': 'ok'
                },
                'user': {
                    "email": user.email,
                    "name": user.name,
                    "surname": user.surname,
                    "token": user.token,
                    "role": role
                }
            };
            return res.status(200).send(response);

        } catch (e) {
            console.log(e);
            const response = {
                'status': {
                    'code': 1,
                    'message': `Error al registrar usuario. ${e}`
                }
            };
            return res.status(200).send(response);
        }
    }

    static async login(req, res, next) {
        try {
            // Get user input
            const { email, password } = req.body;

            // Validate user input
            if (!(email && password)) {
                throw "Todos los campos son obligatorios";
            }

            // Validate if user exist in our database
            const user = await User.findOne({ email }).populate('role');

            if (user && (await bcrypt.compare(password, user.password))) {
                // Create token
                const token = jwt.sign(
                    { user_id: user._id, user_email: user.email, user_role: user.role.keyName },
                    process.env.TOKEN_KEY,
                    {
                    expiresIn: "2h",
                    }
                );

                // Save user token
                user.token = token;

                const response = {
                    'status': {
                        'code': 0,
                        'message': 'ok'
                    },
                    'user': {
                        "email": user.email,
                        "name": user.name,
                        "surname": user.surname,
                        "token": user.token,
                        "role": user.role
                    }
                };
                return res.status(200).send(response);

            } else {
                throw "Credenciales inválidas";
            }

        } catch (e) {
            console.log(e);
            const response = {
                'status': {
                    'code': 1,
                    'message': `Error en login. ${e}`
                }
            };
            return res.status(200).send(response);
        }
    }
}