//ITS TIME TO D-D-D-DUEL (it is time to create the deck storage = W=;;)
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  count: { type: Number, required: true, min: 1, max: 3 }
});

const deckSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  monsters: [cardSchema],
  spells: [cardSchema],
  traps: [cardSchema],
  extra: [cardSchema]
});

module.exports = mongoose.model('Deck', deckSchema);