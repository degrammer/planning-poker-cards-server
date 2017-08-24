"use latest";
module.exports = (function () {

    let sessions = [];

    return {

        createSession: function () {

            let sessionId = (Math.random(1000) * Math.random(1000)).toString().replace('.', '');
            sessions.push({ id: sessionId, participants: [] });
            return sessionId;

        },

        join: function (sessionId, user) {

            let joinSession = this.getSession(sessionId);

            if (joinSession) {
                joinSession.participants.push({ participant: user, vote: {}, pic: Math.floor((Math.random() * 4) + 1) });
            }
        },

        getSession: function (sessionId) {

            return sessions.filter(item => item.id == sessionId)[0];
        },

        vote: function (sessionId, user, card) {

            let session = this.getSession(sessionId);
            console.log("vote");
            console.log(session);
            if (session) {

                let participant = session.participants.filter(item => item.participant == user)[0];
                console.log("search");
                console.log(participant);
                if(participant)
                {
                    participant.vote = card;
                }
            }
        }

    };
})();