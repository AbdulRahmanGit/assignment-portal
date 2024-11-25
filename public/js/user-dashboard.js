
import config from './config.js';
document.addEventListener('DOMContentLoaded', () => {
    const assignmentForm = document.getElementById('assignmentForm');
    const adminSelect = document.getElementById('adminSelect');
    const assignmentsBody = document.getElementById('assignmentsBody');
    const logoutBtn = document.getElementById('logoutBtn');
    const toast = document.getElementById('toast');
    const userId = localStorage.getItem('userId');
    const backendUrl = config.BACKEND_URL || 'http://localhost:5000'; 
    // WebSocket connection
    /*const ws = new WebSocket('ws://localhost:5000/ws');
    ws.onopen = () => {
        console.log('WebSocket connected');
        // Send registration event to the server with userId
        ws.send(JSON.stringify({ type: 'registerUser', userId }));
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'assignmentStatus' && data.userId === userId) {
                fetchAssignments();  // Refetch assignments to reflect updated status
                showToast(`Assignment status updated to ${data.status}!`, 'success');
            }
            
            // If a new assignment is created, update the assignments list
            if (data.type === 'newAssignment') {
                fetchAssignments(); // Refetch assignments
            }
        };
        };*/

    function showToast(message, type) {
        toast.className = `toast show ${type}`;
        toast.querySelector('.toast-message').textContent = message;
        setTimeout(() => {
            toast.className = 'toast';
        }, 5000);
    }
    
    async function fetchAdmins() {
        try {
            const response = await fetch(`${backendUrl}/api/users/admins`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (response.ok) {
                const admins = await response.json();
                console.log('Admins:', admins); // Debug the response
                adminSelect.innerHTML = `
                    <option value="">Select an admin</option>
                    ${admins.map(admin => `
                        <option value="${admin._id}">${admin.username}</option>
                    `).join('')}
                `;
            } else {
                showToast('Failed to fetch admins', 'error');
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
            showToast('Network error occurred', 'error');
        }
    }
    
    async function fetchAssignments() {
        try {
            const response = await fetch(`${backendUrl}/api/users/assignments`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (response.ok) {
                const assignments = await response.json();
                console.log('Assignments:', assignments);  // Log assignments to verify structure
                
                const userId = localStorage.getItem('userId');  // Ensure this is being set correctly
                const myAssignments = assignments.filter(a => a.userId._id === userId);  // Adjust filter logic as needed
                
                displayAssignments(assignments);
            } else {
                showToast('Failed to fetch assignments', 'error');
            }
        } catch (error) {
            showToast('Network error occurred', 'error');
        }
    }
    
    
    function displayAssignments(assignments) {
        assignmentsBody.innerHTML = assignments.map(assignment => `
            <tr>
                <td>${assignment.adminId ? assignment.adminId.username : 'Unknown'}</td>
                <td>${assignment.task || 'No task provided'}</td>
                <td>
                    <span class="status-badge ${assignment.status || 'unknown'}">
                        ${assignment.status || 'Unknown'}
                    </span>
                </td>
                <td>${assignment.createdAt ? new Date(assignment.createdAt).toLocaleDateString() : 'N/A'}</td>
            </tr>
        `).join('');
    }
    

    assignmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const admin = adminSelect.value;
        const task = document.getElementById('taskDescription').value.trim();
        console.log(admin)
        if (!admin || !task) {
            showToast('Please select an admin and provide a task description', 'error');
            return;
        }
    
        try {
            const response = await fetch(`${backendUrl}/api/users/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ userId, task, adminId : admin })
            });
    
            if (response.ok) {
                showToast('Assignment submitted successfully', 'success');
                assignmentForm.reset();
                fetchAssignments();
            } else {
                const data = await response.json();
                showToast(data.message || 'Failed to submit assignment', 'error');
            }
        } catch (error) {
            showToast('Network error occurred', 'error');
        }
    });
    

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        window.location.href = 'login.html';
    });

    // Initial fetches
    fetchAdmins();
    fetchAssignments();
});
