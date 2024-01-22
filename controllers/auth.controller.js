import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateRefreshToken, generateToken } from '../utils/tokenManager.js';

export const register = async (req, res) => {
    const { email, password } = req.body
    try {
        //Alternativa buscando email por el Schema 
        let user = await User.findOne({ email });
        if (user) throw ({ code: 11000 });

        user = new User({ email, password });
        await user.save();

        return res.status(201).json({ state: true });
    } catch (error) {
        console.log(error);

        //Alternativa por defecto mongoose
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email de Usuario Existente" });
        }
        return res.status(500).json({ error: "Error de Servidor" });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email })
        if (!user)
            return res.status(403).json({ error: "No existe el Usuario Registrado" });

        const resPassword = await user.comparePassword(password);
        if (!resPassword)
            return res.status(403).json({ error: "Credenciales Incorrectas" });

        // Generar el token JWT
        const { token, expiresIn } = generateToken(user.id)

        //Token con cookie
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: !(proccess.env.MODO === "developer"),
        // });
        generateRefreshToken(user.id, res);
        return res.json({ token, expiresIn });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error de Servidor" });
    }

}

export const infoUser = async (req, res) => {

    try {
        const user = await User.findById(req.uid).lean()
        return res.json({ email: user.email, uid: user.id });
    } catch (error) {
        return res.status(500).json({ error: "Error del Servidor" });
    }
}

export const refreshToken = (req, res) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken
        if (!refreshTokenCookie) throw new Error("No Existe el token");
        const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
        const { token,expiresIn } =generateToken(uid);
        return res.json({ token,expiresIn });
    }
    catch (error) {
        console.log(error.message);
        const TokenVerificationErrors = {
            "invalid signature": "La firma del JWT no es valida",
            "jwt expired": "JWT expirado",
            "invalid token": "Token no valido",
            "No Bearer": "Utiliza el formato Bearer para el JWT",
            "jwt malformed": "JWT formato no valido",
        }
        return res.status(401).send({ error: TokenVerificationErrors[error.message] });
    }
}

export const logout=(req,res) => {
    res.clearCookie('refreshToken');
    res.json({ ok: true });
}