const Assignment = require('../models/Assignment');

exports.viewAssignments = async (req, res) => {
    try {
        // Fetch assignments tagged to the admin and populate userId to get username
        const assignments = await Assignment.find({ adminId: req.user.id }) // Assuming admin ID is stored in req.admin.adminId
            .populate('userId', 'username') // Populate the username field from the User model
            .populate('adminId', 'username') // Populate the username field from the User model
            .exec();
// Format the response
const formattedAssignments = assignments.map(assignment => ({
    task: assignment.task,
    status: assignment.status,
    createdAt: assignment.createdAt,
    userId: assignment.userId.username, // Populated username for the user
    adminId: assignment.adminId.username, // Populated username for the admin
}));
        res.json(formattedAssignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const updateAssignmentStatus = async (req, res, status) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        assignment.status = status;
        await assignment.save();
        res.json({ message: `Assignment ${status}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.acceptAssignment = (req, res) => updateAssignmentStatus(req, res, 'accepted');
exports.rejectAssignment = (req, res) => updateAssignmentStatus(req, res, 'rejected');

