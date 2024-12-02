const Notification = require('../Models/NotificationModel');

const markRead = async (req, res) => {
    try {
        const { patientId } = req.body;

        if (!patientId) {
            return res.status(400).send("Patient ID is required.");
        }

        const toMake = await Notification.find({ patientId });
        if (toMake.length === 0) {
            return res.status(404).send("No notifications for the patient.");
        }

        const response = await Notification.updateMany(
            { patientId },
            { $set: { isRead: true } }
        );

        res.status(200).send({
            message: "Notifications marked as read successfully.",
            modifiedCount: response.modifiedCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error while fetching notifications.");
    }
};


module.exports = {
    markRead,
}