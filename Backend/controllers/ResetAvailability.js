const schedule = require('node-schedule');
const Therapist = require('../Models/TherapistModel');
const mongoose = require('mongoose')

async function resetAvailability() {
    try {
        await Therapist.updateMany(
            {},
            {
                $set: {
                    "availableTimes.$[].slots.$[].isAvailable": true
                }
            }
        );
    } catch (error) {
        console.error(error);
    }
}

schedule.scheduleJob('0 0 * * 1', async () => {
    await resetAvailability();
});
mongoose.connect('mongodb://localhost:27017/SIH', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error(error));