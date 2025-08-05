import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import UserModel from '../dao/models/UserModel.js';
import { createHash, isValidPassword } from '../utils/hash.js';
import { JWT_SECRET } from '../config/passport.js';

const router = Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Usuario ya existe' });

    const hashedPassword = createHash(password);
    const newUser = await UserModel.create({ first_name, last_name, email, age, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user || !isValidPassword(user, password)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
    //res.redirect('/products');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  

});



// Obtener usuario actual (protegido con JWT)
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: req.user });
});

export default router;