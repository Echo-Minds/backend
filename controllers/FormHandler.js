const session = require("../Models/SessionModel");

const formHandler = async (req, res) => {
    console.log("HI");
    try {
        const {
            sessionId,
            monotone,
            hyperprosodic,
            dysprosodic,
            appropriateProsody,
            prosodyComment,
            hoarseVoice,
            breathyVoice,
            glottalFry,
            appropriateVoiceQuality,
            hypernasal,
            voiceQualityComment,
            highPitch,
            lowPitch,
            appropriatePitch,
            loudVoice,
            softVoice,
            pitchLoudnessComment,
            reviewToPatient
        } = req.body;
        console.log(sessionId);
        const reqSession = await session.findById(sessionId).exec();

        if (!reqSession) {
            return res.status(404).json({ error: "Session not found" });
        }

        // Ensure notes is initialized
        if (!Array.isArray(reqSession.notes)) {
            reqSession.notes = [];
        }

        const newNote = {
            monotone,
            hyperprosodic,
            dysprosodic,
            appropriateProsody,
            prosodyComment,
            hoarseVoice,
            breathyVoice,
            glottalFry,
            appropriateVoiceQuality,
            hypernasal,
            voiceQualityComment,
            highPitch,
            lowPitch,
            appropriatePitch,
            loudVoice,
            softVoice,
            pitchLoudnessComment,
            reviewToPatient
        };
        console.log(newNote);
        reqSession.notes.push(newNote);
        await reqSession.save();

        return res
            .status(200)
            .json({ message: "Session updated successfully", session: reqSession });
    } catch (error) {
        console.error("Error updating session:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    formHandler,
};
