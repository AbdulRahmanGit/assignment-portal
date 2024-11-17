// websocket.js (Server)

const { Server } = require('socket.io');
const Assignment = require('../models/Assignment');

const setupWebSocket = (server) => {
    const io = new Server(server);  // WebSocket Server

    io.on('connection', (socket) => {
        console.log('New WebSocket connection');

        // Register user event
        socket.on('registerUser', (userId) => {
            console.log(`User registered: ${userId}`);
        });

        // Register admin event and fetch assignments
        socket.on('registerAdmin', async (adminId) => {
            try {
                const assignments = await Assignment.find({ adminId });
                socket.emit('adminAssignments', assignments); // Send assignments to admin
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        // Submit assignment event
        socket.on('submitAssignment', async (assignmentData) => {
            try {
                const assignment = new Assignment(assignmentData);
                await assignment.save();
                io.emit('newAssignment', { message: 'A new assignment has been submitted', assignment });
                socket.emit('assignmentSubmitted', { message: 'Assignment submitted successfully' });
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        // Disconnect event
        socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });
    });

    return io;
};

module.exports = setupWebSocket;
