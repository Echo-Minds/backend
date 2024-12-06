const AssignmentRequest = require('../Models/RequestingModel')
const Therapist = require('../Models/TherapistModel');

const assingmentOfSupervisor = async(req,res) =>{
    try {
        const { therapistId, supervisorId, status, message } = req.body;

        const newAssignmentRequest = new AssignmentRequest({
            therapistId,
            supervisorId,
            status,
            message,
        });
        const savedRequest = await newAssignmentRequest.save();

        res.status(200).json({
            message: 'Assignment request created successfully',
            requestId: savedRequest._id, 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating assignment request' });
    }
}

const getTherapistsRequests = async (req, res) => {
  const supervisorId = req.query.supervisorId; 

  try {
    const requests = await AssignmentRequest.find({ supervisorId, status: 'pending' })
      .populate('therapistId') 
      .exec();

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: 'No pending requests found.' });
    }

    
    const modifiedRequests = await Promise.all(requests.map(async (request) => {
      const therapist = await Therapist.findById(request.therapistId);

      if (therapist) {
        request.message = `Request from ${therapist.name}`;
      } else {
        request.message = 'Request from Unknown Therapist';
      }

      return request;
    }));

    res.status(200).json(modifiedRequests); }
    catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const acceptRequest = async (req, res) => {
  const { requestId } = req.body; 

  try {
    const request = await AssignmentRequest.findByIdAndUpdate(requestId, { status: 'accepted' }, { new: true });

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    res.status(200).json({ message: 'Request accepted successfully', request });
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const rejectRequest = async (req, res) => {
  const { requestId } = req.body; 

  try {
    const request = await AssignmentRequest.findByIdAndUpdate(requestId, { status: 'rejected' }, { new: true });

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    res.status(200).json({ message: 'Request rejected successfully', request });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
    assingmentOfSupervisor,
    getTherapistsRequests,
    acceptRequest,
    rejectRequest,
}