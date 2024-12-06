const Notification = require("../Models/NotificationModel");

const markRead = async (req, res) => {
  try {
    const { patientId, therapistId } = req.body;

    if (!patientId && !therapistId) {
      return res
        .status(400)
        .send("Either Patient ID or Therapist ID is required.");
    }

    const query = patientId ? { patientId } : { therapistId };

    const toMake = await Notification.find(query);
    if (toMake.length === 0) {
      return res.status(404).send("No notifications found for the given ID.");
    }

    const response = await Notification.updateMany(query, {
      $set: { isRead: true },
    });

    res.status(200).send({
      message: "Notifications marked as read successfully.",
      modifiedCount: response.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while marking notifications as read.");
  }
};

module.exports = {
  markRead,
};
