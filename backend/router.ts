const { client } = require('./db/connect');
const gameController = require('./controllers/game.controller');

const express = require('express');
const router = express.Router();

const NODE_ENV = process.env.NODE_ENV || 'development';

router.get('/master-game-list', (_, res) =>
    client
        .db('e-games')
        .collection(`${NODE_ENV}.MasterGameList`)
        .find({ active: true })
        .sort({ nameInt: 1 })
        .map((doc) => ({
            id: doc.gameId,
            name: doc.nameInt,
            bundleId: doc.bundleId,
        }))
        .toArray((err, docs) => {
            if (err) return res.json(err);
            if (docs) return res.json(docs);
        })
);

router.get('/games/:gameId', gameController.getGameById);
router.route('/games').post(gameController.createGame).put(gameController.updateGame);

module.exports = router;
