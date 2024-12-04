const moment = require('moment');
const Supervisor = require('../Models/SupervisorModel');
const Patient = require('../Models/PatientModel');
const Session = require('../Models/SessionModel'); 
const Therapist = require('../Models/TherapistModel');

const sendReportToSupervisor = async (patientId) => {
    try {
        const patient = await Patient.findById(patientId).exec();
        
        if (patient.sessionLogs.length >= 10) {
            const sessionId = patient.sessionLogs[patient.sessionLogs.length - 1].sessionId;
            
            const lastSession = await Session.findById(sessionId);
            
            if (!lastSession) {
                console.error("Session not found for sessionId:", sessionId);
                return;
            }
            
            const { startTime, endTime, therapistId, notes, sessionType, meetLink } = lastSession;
            console.log(startTime);
            if (Array.isArray(notes)) {
                if (notes.length > 0) {
                    const prosody = notes.find(note => note.hasOwnProperty('prosodyComment'));
                    const voiceQuality = notes.find(note => note.hasOwnProperty('voiceQualityComment'));
                    const pitch = notes.find(note => note.hasOwnProperty('pitchLoudnessComment'));

                    const prosodyComment = prosody ? prosody.prosodyComment : "No prosody comment";
                    const voiceQualityComment = voiceQuality ? voiceQuality.voiceQualityComment : "No voice quality comment";
                    const pitchComment = pitch ? pitch.pitchLoudnessComment : "No pitch comment";

                    const reportContent = `
                        **Therapist**: ${Therapist.findById(therapistId).name}  
                        **Patient**: ${patient.name}  
                        **Session Date**: ${startTime.split("T")[0]}  
                        **Session Type**: ${sessionType}  
                        **Session Link**: ${meetLink}

                        ### **Session Notes**:

                        **Prosody**:
                        - **Monotone**: ${notes[0].monotone}  
                        - **Hyperprosodic**: ${notes[0].hyperprosodic}  
                        - **Dysprosodic**: ${notes[0].dysprosodic}  
                        - **Appropriate Prosody**: ${notes[0].appropriateProsody}  
                        - **Prosody Comment**: ${prosodyComment}

                        **Voice Quality**:
                        - **Hoarse Voice**: ${notes[0].hoarseVoice}  
                        - **Breathy Voice**: ${notes[0].breathyVoice}  
                        - **Glottal Fry**: ${notes[0].glottalFry}  
                        - **Appropriate Voice Quality**: ${notes[0].appropriateVoiceQuality}  
                        - **Hypernasal**: ${notes[0].hypernasal}  
                        - **Voice Quality Comment**: ${voiceQualityComment}

                        **Pitch**:
                        - **High Pitch**: ${notes[0].highPitch}  
                        - **Low Pitch**: ${notes[0].lowPitch}  
                        - **Appropriate Pitch**: ${notes[0].appropriatePitch}

                        **Loudness**:
                        - **Loud Voice**: ${notes[0].loudVoice}  
                        - **Soft Voice**: ${notes[0].softVoice}  
                        - **Pitch Loudness Comment**: ${pitchComment}

                        ### **Additional Notes/Comments**:  
                        [Optional therapist comments or other relevant details]
                    `;

                    const supervisor = await Supervisor.findOne({ therapistIds: therapistId });
                    if (supervisor) {
                        supervisor.reports.push({
                            therapistId,
                            patientId: patient._id,
                            sessionCount: patient.sessionLogs.length,
                            feedbackSummary: "Summary of the session based on notes",
                            supervisorComments: "Supervisor comments here",
                            combinedReport: reportContent,
                            timestamp: moment().add(15, 'minutes').toDate(),
                        });

                        await supervisor.save();
                    }

                    console.log('Report has been added to the supervisor\'s reports');
                } else {
                    console.error("Error: Notes array is empty.");
                }
            } else {
                console.error("Error: Notes is not an array or is missing.");
            }
        } else {
            console.log("Error: Patient has fewer than 10 sessions.");
        }
    } catch (error) {
        console.error("Error in generating the report:", error);
    }
};
module.exports = {
    sendReportToSupervisor,
};
