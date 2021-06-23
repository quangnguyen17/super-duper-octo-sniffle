const NotifUtil = require('../NotifUtil');
const semver = require('semver');
const Game = require('../models/Game');

module.exports = {
    getGameById(req, res) {
        Game.findOne({ _id: req.params.gameId })
            .then((game) => res.json(game))
            .catch((err) => {
                console.error(err);
                res.json(err);
            });
    },
    async createGame(req, res) {
        try {
            let newGame = {
                ...req.body,
                uploadedAt: new Date().toUTCString(),
                developerEmail: '',
                developerName: '',
                developerId: '',
            };

            if (!req.cookies._forward_auth_name) {
                return res.json({
                    message: 'You must login in order to submit a build.',
                });
            }

            if (req.cookies) {
                if (req.cookies._forward_auth_name) {
                    const email = req.cookies._forward_auth_name;
                    newGame.developerEmail = email;
                    newGame.developerName = email.split('@')[0];
                }
            }

            const builds = await Game.find({ name: newGame.name }).sort({ createdAt: -1 });

            console.log(builds);

            // if (builds.length > 0) {
            //     const latest = builds[0];

            //     if (!semver.satisfies(`${newGame.ver}`, `>${latest.ver}`)) {
            //         return res.json({
            //             message: `You must upload a newer version than the latest submitted version of ${latest.ver}.`,
            //         });
            //     }
            // }

            const gameData = await Game.create(newGame);

            console.log(`${gameData.name} (Version ${gameData.ver}): new build submitted`);
            res.json(gameData);
        } catch (err) {
            console.error(err);
            return res.json(err);
        }
    },
    updateGame(req, res) {
        const { _id, fileURL, files } = req.body;

        Game.findOneAndUpdate({ _id }, { fileURL, files }, { new: true })
            .then((doc) => {
                // desctructure to get metadata from game
                const { developerEmail, name, fileURL, ver } = doc;

                const developerName = doc.developerName || 'developerName';
                const slackMsg = `Developer (@${developerName}) has submitted a new build for ${name} (Version: ${ver}). You can download build at the following link: ${fileURL}.`;
                const subMsg = `${name} (Version ${ver}): A new build has been submitted.`;

                NotifUtil.slackNotify(slackMsg, []);

                // send email to QA
                NotifUtil.sendEmailTo(
                    [process.env.TO_EMAIL],
                    subMsg,
                    `
                    ${slackMsg}
                    <br />
                    ${NotifUtil.getEmailTemplate(doc)}
                    `
                );

                // send confirmation email to developer
                NotifUtil.sendEmailTo(
                    [developerEmail],
                    subMsg,
                    NotifUtil.getEmailTemplate(doc, `This email confirms that you have successfully submitted a new build for ${name}`)
                );

                res.json(doc);
            })
            .catch((err) => {
                console.error(err);
                res.json(err);
            });
    },
};
