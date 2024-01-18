import express from 'express';
import { Router } from 'express';
import { login, register } from "../controllers/auth.controller.js";
import { body } from 'express-validator'
import { validationResultExpress } from '../middlewares/validationResult.js';
const router = express.Router();

router.post("/register", [
    body('email', "Formato de email incorrecto").trim().isEmail().normalizeEmail(),
    body('password', "Formato de password incorrecto").trim().isLength({ min: 6 }).custom((value, { req }) => {
        if (value !== req.body.repassword) {
            throw new Error('No coinciden las contraseñas');
        }
        return value;
    }),
],validationResultExpress, register);
router.post("/login", [
    body('email', "Formato de email incorrecto").trim().isEmail().normalizeEmail(),
    body('password', "Formato de password incorrecto").trim().isLength({ min: 6 })
], validationResultExpress, login);

export default router;