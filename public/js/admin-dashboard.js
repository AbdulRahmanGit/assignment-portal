document.addEventListener('DOMContentLoaded', () => {
    const assignmentsBody = document.getElementById('assignmentsBody');
    const logoutBtn = document.getElementById('logoutBtn');
    const toast = document.getElementById('toast');
    const adminId = localStorage.getItem('userId');
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'; 
/*
    // WebSocket connection
    const ws = new WebSocket('ws://localhost:5000');  // Ensure WebSocket connection

    ws.onopen = () => {
        // Register the admin
        ws.send(JSON.stringify({ event: 'registerAdmin', adminId }));
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // Handle new assignment broadcasted to all admins
        if (data.event === 'newAssignment') {
            fetchAssignments();
            showToast('New assignment received!', 'success');
        }

        // Handle assignments fetched for this admin
        if (data.event === 'adminAssignments') {
            displayAssignments(data.assignments);
        }
    };

    function showToast(message, type) {
        toast.className = `toast show ${type}`;
        toast.querySelector('.toast-message').textContent = message;
        setTimeout(() => {
            toast.className = 'toast';
        }, 5000);
    }
*/
    async function fetchAssignments() {
        try {
            const response = await fetch(`${backendUrl}/api/admin/assignments`, {
                
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.status);
            if (response.ok) {
                const assignments = await response.json();
                console.log(assignments);  

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
                <td>${assignment.userId.username}</td>
                <td>${assignment.task}</td>
                <td>
                    <span class="status-badge ${assignment.status}">
                        ${assignment.status}
                    </span>
                </td>
                <td>${new Date(assignment.createdAt).toLocaleDateString()}</td>
                <td>
                    ${assignment.status === 'pending' ? `
                        <div class="action-buttons">
                            <button onclick="handleAssignment('${assignment._id}', 'accept')" class="action-btn accept">
                                ✓
                            </button>
                            <button onclick="handleAssignment('${assignment._id}', 'reject')" class="action-btn reject">
                                ✕
                            </button>
                        </div>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    window.handleAssignment = async (id, action) => {
        try {
            const response = await fetch(`${backendUrl}/api/admin/assignments/${id}/${action}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                showToast(`Assignment ${action}ed successfully`, 'success');
                fetchAssignments();
            } else {
                showToast(`Failed to ${action} assignment`, 'error');
            }
        } catch (error) {
            showToast('Network error occurred', 'error');
        }
    };

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        window.location.href = 'login.html';
    });

    // Initial fetch
    fetchAssignments();
});
