const express = require('express');
const router = express.Router();
const Deck = require('../models/deck');

//LET THERE BE A DECK :D
router.get('/create', (req, res) => {
  res.render('create');
});

//we need to yoink the data from the form and make it into a deck :3
function parseCards(namesArr, countsArr) {
  if (!namesArr || !countsArr) return [];

  const cards = [];

  //grab names n counts from le form
  namesArr.forEach((name, num) => {
    const trimmedName = name?.trim();
    const count = parseInt(countsArr[num], 10);

    //need this in case trolling happens (if its emmptty or sfi somenone givrs an invalid number)
    if (!trimmedName && !countsArr[num]) 
        return;
    if (trimmedName && (isNaN(count) || count < 1 || count > 3)) 
    {
      throw new Error("Each card must have a count between 1 and 3! Please fix your ratios >:(");
    }

    //if all is well, let bro into the club (turn em into obj)
    if (trimmedName) 
    {
      cards.push({ name: trimmedName, count });
    }
  });

  return cards;
}

//this is for cooking! LET BRO COOK
router.post('/create', async (req, res) => {
  try 
  {
    const monsters = parseCards(req.body.monsterName, req.body.monsterCount);
    const spells = parseCards(req.body.spellName, req.body.spellCount);
    const traps = parseCards(req.body.trapName, req.body.trapCount);
    const extra = parseCards(req.body.extraName, req.body.extraCount);

    const deck = new Deck({name: req.body.name, monsters, spells, traps, extra});

    await deck.save();

    res.render('createsuccess', {title: 'Deck Created', deckName: deck.name});

  } 
  catch (err) 
  {
    return res.send('Error has occurred: ' + err.message);
  }
});

//select which deck you wanna view yk
router.get('/pickview', async (req, res) => {
  try 
  {
    //grabs every single deck :3
    const decks = await Deck.find();
    res.render('pickview.ejs', { decks });
  } 
  catch (err) 
  {
    console.error(err);
    res.status(500).send("Error fetching decks... pls try again");
  }
});

//this is for the eyeballing
router.get('/view/:name', async (req, res) => {
  const deck = await Deck.findOne({ name: req.params.name });
  if (!deck) 
    return res.send('Could not find deck! Try again!');
  res.render('view', { deck });
});

//pic a deck. ANY DECK (grabs all decks for viewing purposes)
router.get('/pickedit', async (req, res) => {
  const decks = await Deck.find();
  res.render('pickedit.ejs', { decks });
});

//pass the deck
router.get('/edit/:id', async (req, res) => {
  try 
  {
    const deck = await Deck.findById(req.params.id);

    if (!deck) 
    {
      return res.status(404).send("Deck not found");
    }

    // send the deck to the viewing place
    res.render('edit', { deck });

  } 
  catch (err) 
  {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//actually editing the deck (lord help me im so tired)
router.post('/edit/:id', async (req, res) => {
  try 
  {
    const monsters = parseCards(req.body.monsterName, req.body.monsterCount);
    const spells = parseCards(req.body.spellName, req.body.spellCount);
    const traps = parseCards(req.body.trapName, req.body.trapCount);
    const extra = parseCards(req.body.extraName, req.body.extraCount);

    //this nukes the deck only if everything is empty (aka no cards)
    if (monsters.length === 0 && spells.length === 0 && traps.length === 0 && extra.length === 0) 
    {
      await Deck.findByIdAndDelete(req.params.id);
      return res.render("editsuccess", {message: "Deck deleted successfully."});
    }

    const updatedDeck = await Deck.findByIdAndUpdate(req.params.id,{ name: req.body.name, monsters, spells, traps, extra }, { new: true });

    res.render("editsuccess", {message: "Changes saved successfully."});

  } 
  catch (err) 
  {
    console.error(err);
    res.status(400).send("Error updating deck: " + err.message);
  }
});

module.exports = router;