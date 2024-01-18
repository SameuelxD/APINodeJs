import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

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

        const resPassword =await user.comparePassword(password);
        if (!resPassword) 
            return res.status(403).json({ error: "Credenciales Incorrectas" });

        // Generar el token JWT
        const token=jwt.sign({uid: user._id}, process.env.JWT_SECRET);

        return res.json({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error de Servidor" });
    }

}