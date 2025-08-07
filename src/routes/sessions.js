import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import UserModel from '../dao/models/UserModel.js';
import { createHash, isValidPassword } from '../utils/hash.js';
import { JWT_SECRET } from '../config/passport.js';
import UserDTO from '../dto/UserDTO.js';
import { sendRecoveryEmail } from '../services/mailService.js';



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
  //res.json({ user: req.user });

  const safeUser = new UserDTO(req.user);
  res.json({ user: safeUser });

});


// Solicitud de recuperación
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
const user = await UserModel.findOne({ email: email.trim().toLowerCase() });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const token = jwt.sign({ email }, process.env.JWT_RECOVERY_SECRET, { expiresIn: '1h' });
  await sendRecoveryEmail(email, token);
  res.json({ message: 'Correo de recuperación enviado' });
});

// Restablecimiento de contraseña
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const { email } = jwt.verify(token, process.env.JWT_RECOVERY_SECRET);
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const samePassword = isValidPassword(user, newPassword);
    if (samePassword) return res.status(400).json({ error: 'No puedes reutilizar la contraseña anterior' });

    user.password = createHash(newPassword);
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
});

export default router;