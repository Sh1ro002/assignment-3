var express = require('express');
var router = express.Router();
const Deck = require('../models/deck');

//EL HOME SWEET HOME PAGE
router.get('/', async (req, res, next) => {
  try 
  {
    //ALWAYS pass deck. otherwise breaks :(
    const deck = await Deck.findOne() || null;
    res.render('index', { title: 'Home', deck });
  } 
  catch (err) 
  {
    console.error(err);
    res.render('index', { title: 'Home', deck: null });
  }
});

//spawn in a new deck :3
router.get('/create', async (req, res, next) => {
  try 
  {
    const deck = null; //spawn an empty deck to pass to next page
    res.render('create', { title: 'Create', deck });
  } 
  catch (err) 
  {
    console.error(err); //incase something somehow happens, make it null
    res.render('create', { title: 'Create', deck: null });
  }
});

//peekaboo HELLO DECK :D
router.get('/view', async (req, res, next) => {
  try 
  {
    const deck = null; //same thing. pass an empty deck
    res.render('view', { title: 'View', deck });
  } 
  catch (err) 
  {
    console.error(err);
    res.render('view', { title: 'View', deck: null });
  }
});

module.exports = router;
