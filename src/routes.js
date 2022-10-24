import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';

import uploadConfig from './config/multer.js';
import Category from './models/Category.js';
import Note from './models/Note.js';
import User from './models/User.js';

import { isAuthenticated } from './middleware/auth.js';
import SendMail from './services/SendMail.js';

import path from 'path';
import {fileURLToPath} from 'url';


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


const router = Router();
const c = console;

router.get('/', (req, res) => res.redirect('/index.html'));

router.get('/index', isAuthenticated, async (req, res) => {
  try {
    const notes = await Note.readAll();

    res.json(notes);
  } catch (error) {
    throw new Error('Error in list notes');
  }
});


// router.get('/new-note', isAuthenticated, async (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/note-template.html'));
// });

router.post(
  '/notes',
  isAuthenticated,
  multer(uploadConfig).single('image'),
  async (req, res) => {
    try {
      const note = req.body;
      c.log(note)

      const image = req.file
        ? `/imgs/foods/${req.file.filename}`
        : '';

      const newNote = await Note.create({ ...note, image });

      res.json(newNote);
    } catch (error) {
      throw new Error('Error in create food');
    }
  }
);

router.put(
  '/notes/:id',
  isAuthenticated,
  multer(uploadConfig).single('image'),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      const note = req.body;
      const oldImage = req.body.oldImage;
      c.log(oldImage)

      const image = req.file
        ? `/imgs/foods/${req.file.filename}`
        : oldImage;

      const newFood = await Note.update({ ...note, image }, id);

      if (newFood) {
        res.json(newFood);
      } else {
        res.status(400).json({ error: 'Food not found.' });
      }
    } catch (error) {
      throw new Error('Error in update food');
    }
  }
);

router.delete('/notes/:id', isAuthenticated, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (await Note.destroy(id)) {
      res.status(204).send();
    } else {
      res.status(400).json({ error: 'Food not found.' });
    }
  } catch (error) {
    throw new Error('Error in delete food');
  }
});

// router.get('/notes', (req, res) => res.redirect('/new-note.html'));

router.get('/notes', async (req, res) => {
  res.sendFile(path.join(__dirname, '/../public/edit-note.html'));
});

router.get('/notes/:id', isAuthenticated, async (req, res) => {
  const id = parseInt((req.params.id));
  const response = await Note.readNote(id)

 res.json(response);
});

router.post('/notes/:id', isAuthenticated, async (req, res) => {
  const id = parseInt((req.params.id));
  const response = await Note.readNote(id)

 res.json(response);
});

router.get('/categories', isAuthenticated, async (req, res) => {
  try {
    const categories = await Category.readAll();

    res.json(categories);
  } catch (error) {
    throw new Error('Error in list categories');
  }
});

router.post('/users', async (req, res) => {
  try {
    const user = req.body;    

    const newUser = await User.create(user);
    console.log(newUser)
    await SendMail.createNewUser(user.email);

    res.json(newUser);
  } catch (error) {
    throw new Error('Error in create user');
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.readByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const { id: userId, password: hash } = user;

    const match = await bcrypt.compareSync(password, hash);

    if (match) {
      const token = jwt.sign(
        { userId },
        process.env.SECRET,
        { expiresIn: 3600 } // 1h
      );

      res.json({ auth: true, token });
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(401).json({ error: 'User not found' });
  }
});

router.use(function (req, res, next) {
  res.status(404).json({
    message: 'Content not found',
  });
});

router.use(function (error, req, res, next) {
  console.error(error.stack);

  res.status(500).json({
    message: 'Something broke!',
  });
});



export default router;
