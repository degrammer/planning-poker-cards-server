"use latest";
const cardManager = require("./cardManager");
const planningPokerManager = require("./planningPokerManager");
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const socketManager = require("./socketManager")(io);

(function (ctx, cb) {

    //Start web server
    var port = 3001;
    http.listen(port);

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    socketManager.create(function (createdSocket) {

        createdSocket.on("start", function(data){
           
            let eventName = "start-" + data.sessionId;
            io.emit(eventName, data);
        });

        createdSocket.on("new-vote", function(data){
           
            let eventName = "new-vote-" + data.sessionId;
            io.emit(eventName, data);
        });

    });


    //Create Cards
    let cards = ["0", "1", "2", "3", "5", "8", "13", "20", "40", "100","unknown","infinite","shave"];

    Array.from(cards, item => cardManager.createCard(item, item));

    app.get('/session/:sessionId/:user', function (req, res) {

        if (req && req.params.sessionId && req.params.user) {
            planningPokerManager.join(req.params.sessionId, req.params.user);
            let joinedEvent = `joined-${req.params.sessionId}`;
            console.log("emit");
            console.log(joinedEvent);
            io.emit(joinedEvent.trim(), { user: req.params.user });
            let connectedMembers = planningPokerManager.getSession(req.params.sessionId);
            res.send(connectedMembers);

        } else {
            console.log("no data");
        }

    });

    app.get('/session/:sessionId', function (req, res) {
        if (req && req.params.sessionId) {
            let planningPokerSession = planningPokerManager.getSession(req.params.sessionId);
            res.send(planningPokerSession);
        }

    });

    app.post('/session/:sessionId/vote/:user/:card', function (req, res) {

        if (req && req.params.sessionId && req.params.user && req.params.card) {
            planningPokerManager.vote(req.params.sessionId, req.params.user, req.params.card);
            let voteEvent = `new-vote-${req.params.sessionId}`;
            socketManager.emit(voteEvent, req.params.user);
            res.send("User voted!");

        }

    });

    app.get('/', function (req, res) {

        res.send({ cards: cards });

    });

    app.post('/', function (req, res) {

        let sessionId = planningPokerManager.createSession(req.sessionId);
        res.send({ sessionId: sessionId });

    });

})();

