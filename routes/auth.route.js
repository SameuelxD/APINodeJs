import express from 'express';
import { Router } from 'express';
import { infoUser, login, register, refreshToken, logout } from "../controllers/auth.controller.js";
import { body } from 'express-validator'
import { validationResultExpress } from '../middlewares/validationResult.js';
import { requireToken } from '../middlewares/requireToken.js';
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

router.get("/protected",requireToken,infoUser);
// router.get("/protected",requireTokenCookie,infoUser);

router.get("/refreshToken",refreshToken);
router.get("/logout",logout);

export default router;