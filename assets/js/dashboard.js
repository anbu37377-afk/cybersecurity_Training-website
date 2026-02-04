// ==================== DASHBOARD JAVASCRIPT FILE ====================

document.addEventListener('DOMContentLoaded', function () {
    // Only run dashboard functionality on dashboard pages
    if (!document.querySelector('.dashboard')) {
        return;
    }

    // Force correct scale on page load
    forceCorrectScale();

    // Sidebar Navigation
    const sectionLinks = document.querySelectorAll('[data-section]');
    const contentSections = document.querySelectorAll('.content-section');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');
    const mobileBreakpoint = 1024;
    const mobileMenuLinks = mobileSidebar
        ? mobileSidebar.querySelectorAll('.mobile-sidebar-link')
        : [];

    function setActiveSection(sectionName) {
        if (!sectionName) {
            return;
        }

        // Hide all content sections
        contentSections.forEach(section => {
            section.classList.add('d-none');
        });

        // Show corresponding section
        const section = document.getElementById(sectionName + '-section');
        if (section) {
            section.classList.remove('d-none');
        }

        // Sync active nav link state across desktop + mobile menus
        sectionLinks.forEach(link => {
            const isActive = link.getAttribute('data-section') === sectionName;
            link.classList.toggle('active', isActive);
        });
    }

    function isMobileViewport() {
        return window.innerWidth <= mobileBreakpoint;
    }

    function openMobileMenu() {
        if (!mobileSidebar || !mobileSidebarOverlay || !mobileMenuToggle) {
            return;
        }

        mobileSidebar.classList.add('open');
        mobileSidebarOverlay.classList.add('open');
        document.body.classList.add('mobile-menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
        if (!mobileSidebar || !mobileSidebarOverlay || !mobileMenuToggle) {
            return;
        }

        mobileSidebar.classList.remove('open');
        mobileSidebarOverlay.classList.remove('open');
        document.body.classList.remove('mobile-menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }

    // Handle navigation clicks
    sectionLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            setActiveSection(targetSection);

            if (isMobileViewport()) {
                closeMobileMenu();
            }
        });
    });

    // Sidebar toggle for mobile
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('show');

            // Create overlay for mobile
            let overlay = document.querySelector('.dashboard-sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'dashboard-sidebar-overlay';
                document.body.appendChild(overlay);
            }

            overlay.classList.toggle('show');

            // Close sidebar when clicking overlay
            overlay.addEventListener('click', function () {
                sidebar.classList.remove('show');
                overlay.classList.remove('show');
            });
        });
    }

    // Mobile/tablet header menu toggle (<= 1024px)
    if (mobileMenuToggle && mobileSidebar && mobileSidebarOverlay) {
        mobileMenuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (mobileSidebar.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        mobileSidebarOverlay.addEventListener('click', closeMobileMenu);

        // Close sidebar for any mobile/tablet menu tap (including Logout).
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function () {
                closeMobileMenu();
            });
        });

        document.addEventListener('click', function (e) {
            if (!isMobileViewport() || !mobileSidebar.classList.contains('open')) {
                return;
            }

            const clickInsideMenu = mobileSidebar.contains(e.target);
            const clickOnToggle = mobileMenuToggle.contains(e.target);
            if (!clickInsideMenu && !clickOnToggle) {
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileSidebar.classList.contains('open')) {
                closeMobileMenu();
            }
        });
    }

    // Close sidebar when clicking outside on tablet/mobile
    document.addEventListener('click', function (e) {
        if (isMobileViewport()) {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.querySelector('.dashboard-sidebar-overlay');

            if (sidebar && sidebarToggle && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('show');
                if (overlay) {
                    overlay.classList.remove('show');
                }
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        if (!isMobileViewport()) {
            closeMobileMenu();
        }

        if (window.innerWidth > mobileBreakpoint) {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.querySelector('.dashboard-sidebar-overlay');

            if (sidebar) {
                sidebar.classList.remove('show');
            }
            if (overlay) {
                overlay.classList.remove('show');
            }
        }
    });

    // Initialize Charts
    initializeCharts();

    // Handle user actions
    handleUserActions();

    // Handle course actions
    handleCourseActions();

    // Handle order actions
    handleOrderActions();

    // Handle message actions
    handleMessageActions();

    // Handle settings
    handleSettings();

    // Initialize data tables
    initializeDataTables();

    // Handle real-time updates
    initializeRealTimeUpdates();
});

// ==================== CHART INITIALIZATION ====================

function initializeCharts() {
    // Check if dark mode is active
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue',
                    data: [65000, 72000, 68000, 81000, 89000, 92000, 98000, 105000, 112000, 118000, 124000, 132000],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 150000,
                        ticks: {
                            color: isDarkMode ? '#ffffff' : '#666',
                            callback: function (value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: isDarkMode ? '#ffffff' : '#666',
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Ethical Hacking', 'Network Security', 'Cloud Security', 'Incident Response', 'Digital Forensics'],
                datasets: [{
                    data: [35, 25, 20, 12, 8],
                    backgroundColor: [
                        '#007bff',
                        '#00ff88',
                        '#ffc107',
                        '#dc3545',
                        '#6f42c1'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: isDarkMode ? '#ffffff' : '#666',
                            boxWidth: 12,
                            padding: 8,
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }
}

// ==================== USER MANAGEMENT ====================

function handleUserActions() {
    // Add User Button
    const addUserBtn = document.querySelector('#users-section .btn-primary');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function () {
            showUserModal();
        });
    }

    // View User Buttons
    const viewUserBtns = document.querySelectorAll('#users-section .btn-outline-primary');
    viewUserBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const userId = row.cells[0].textContent;
            viewUserDetails(userId);
        });
    });

    // Edit User Buttons
    const editUserBtns = document.querySelectorAll('#users-section .btn-outline-secondary');
    editUserBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const userId = row.cells[0].textContent;
            editUser(userId);
        });
    });

    // Delete User Buttons
    const deleteUserBtns = document.querySelectorAll('#users-section .btn-outline-danger');
    deleteUserBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const userId = row.cells[0].textContent;
            const userName = row.cells[1].textContent;
            deleteUser(userId, userName);
        });
    });
}

function showUserModal() {
    // Create modal HTML
    const modalHtml = `
        <div class="modal fade" id="userModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addUserForm">
                            <div class="mb-3">
                                <label class="form-label">First Name</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Last Name</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Plan</label>
                                <select class="form-control">
                                    <option>Basic</option>
                                    <option>Professional</option>
                                    <option>Premium</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveUser()">Save User</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('userModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

function viewUserDetails(userId) {
    // Simulate loading user details
    const userDetails = {
        id: userId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        plan: 'Professional',
        status: 'Active',
        joined: '2024-01-15',
        courses: ['Ethical Hacking', 'Network Security'],
        progress: 75
    };

    // Create modal HTML
    const modalHtml = `
        <div class="modal fade" id="userDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">User Details - ${userDetails.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>ID:</strong> ${userDetails.id}</p>
                                <p><strong>Name:</strong> ${userDetails.name}</p>
                                <p><strong>Email:</strong> ${userDetails.email}</p>
                                <p><strong>Plan:</strong> <span class="badge bg-success">${userDetails.plan}</span></p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Status:</strong> <span class="badge bg-success">${userDetails.status}</span></p>
                                <p><strong>Joined:</strong> ${userDetails.joined}</p>
                                <p><strong>Progress:</strong> ${userDetails.progress}%</p>
                                <div class="progress">
                                    <div class="progress-bar" style="width: ${userDetails.progress}%"></div>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <h6>Enrolled Courses:</h6>
                        <ul class="list-group">
                            ${userDetails.courses.map(course => `<li class="list-group-item">${course}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('userDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
    modal.show();
}

function editUser(userId) {
    // Simulate loading user data for editing
    showNotification('Edit user functionality would open here', 'info');
}

function deleteUser(userId, userName) {
    if (confirm(`Are you sure you want to delete user ${userName} (${userId})?`)) {
        // Simulate deletion
        showNotification(`User ${userName} deleted successfully`, 'success');

        // Remove row from table
        const row = document.querySelector(`#users-section td:contains("${userId}")`).closest('tr');
        if (row) {
            row.remove();
        }
    }
}

function saveUser() {
    const form = document.getElementById('addUserForm');
    if (form.checkValidity()) {
        showNotification('User added successfully', 'success');
        bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
    }
}

// ==================== COURSE MANAGEMENT ====================

function handleCourseActions() {
    // Add Course Button
    const addCourseBtn = document.querySelector('#courses-section .btn-primary');
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', function () {
            showCourseModal();
        });
    }

    // Edit Course Buttons
    const editCourseBtns = document.querySelectorAll('#courses-section .btn-outline-primary');
    editCourseBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.service-card');
            const courseName = card.querySelector('h5').textContent;
            editCourse(courseName);
        });
    });
}

function showCourseModal() {
    showNotification('Add course functionality would open here', 'info');
}

function editCourse(courseName) {
    showNotification(`Edit course: ${courseName}`, 'info');
}

// ==================== ORDER MANAGEMENT ====================

function handleOrderActions() {
    // View Order Buttons
    const viewOrderBtns = document.querySelectorAll('#orders-section .btn-outline-primary');
    viewOrderBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const orderId = row.cells[0].textContent;
            viewOrderDetails(orderId);
        });
    });
}

function viewOrderDetails(orderId) {
    showNotification(`View order details: ${orderId}`, 'info');
}

// ==================== MESSAGE MANAGEMENT ====================

function handleMessageActions() {
    // Message list items
    const messageItems = document.querySelectorAll('#messages-section .list-group-item');
    messageItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all items
            messageItems.forEach(i => i.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Update message details
            const sender = this.querySelector('h6').textContent;
            const message = this.querySelector('p').textContent;
            updateMessageDetails(sender, message);
        });
    });

    // Reply button
    const replyBtn = document.querySelector('#messages-section .btn-primary');
    if (replyBtn) {
        replyBtn.addEventListener('click', function () {
            const textarea = document.querySelector('#messages-section textarea');
            if (textarea.value.trim()) {
                showNotification('Reply sent successfully', 'success');
                textarea.value = '';
            }
        });
    }
}

function updateMessageDetails(sender, message) {
    const detailsSection = document.querySelector('#messages-section .stats-card:last-child');
    if (detailsSection) {
        detailsSection.querySelector('h6').textContent = sender;
        detailsSection.querySelector('p').textContent = message;
    }
}

// ==================== SETTINGS MANAGEMENT ====================

function handleSettings() {
    // General settings form
    const generalForm = document.querySelector('#settings-section form:first-of-type');
    if (generalForm) {
        generalForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showNotification('General settings saved successfully', 'success');
        });
    }

    // Notification settings form
    const notificationForm = document.querySelector('#settings-section form:last-of-type');
    if (notificationForm) {
        notificationForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showNotification('Notification settings saved successfully', 'success');
        });
    }
}

// ==================== DATA TABLES ====================

function initializeDataTables() {
    // Search functionality
    const searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(input => {
        input.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.stats-card').querySelector('table');
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
        });
    });
}

// ==================== REAL-TIME UPDATES ====================

function initializeRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        updateStats();
    }, 30000); // Update every 30 seconds
}

function updateStats() {
    // Simulate updating stats
    const statsNumbers = document.querySelectorAll('.stats-number');
    statsNumbers.forEach(stat => {
        const currentValue = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
        const change = Math.floor(Math.random() * 10) - 5; // Random change between -5 and 5
        const newValue = Math.max(0, currentValue + change);

        if (stat.textContent.includes('$')) {
            stat.textContent = '$' + newValue.toLocaleString();
        } else if (stat.textContent.includes('%')) {
            stat.textContent = newValue + '%';
        } else {
            stat.textContent = newValue.toLocaleString();
        }
    });
}

// ==================== NOTIFICATION SYSTEM ====================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Add to body
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ==================== UTILITY FUNCTIONS ====================

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Force correct scale function (only run on dashboard pages)
function forceCorrectScale() {
    // Only run on dashboard pages
    if (!document.querySelector('.dashboard')) {
        return;
    }

    try {
        // Force viewport meta tag
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }

        // Force correct scale on dashboard elements
        const dashboard = document.querySelector('.dashboard');
        if (dashboard) {
            dashboard.style.transform = 'scale(1)';
            dashboard.style.zoom = '1';
            dashboard.style.width = '100vw';
            dashboard.style.maxWidth = '100vw';
            dashboard.style.minWidth = '100vw';
            dashboard.style.overflowX = 'hidden';
            dashboard.style.overflowY = 'auto'; // Ensure vertical scrolling is enabled
            dashboard.style.height = 'auto'; // Ensure height is not fixed
            dashboard.style.minHeight = '100vh';
        }

        // Force correct scale on all dashboard elements (limit to prevent performance issues)
        const dashboardElements = document.querySelectorAll('.dashboard > *');
        dashboardElements.forEach(element => {
            element.style.transform = 'scale(1)';
            element.style.zoom = '1';
            element.style.maxWidth = '100%';
        });

        // Prevent pinch zoom
        document.addEventListener('touchstart', function (e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        // Prevent double tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Force correct scale on window resize
        window.addEventListener('resize', function () {
            setTimeout(() => {
                forceCorrectScale();
            }, 100);
        });

        // Force correct scale on orientation change
        window.addEventListener('orientationchange', function () {
            setTimeout(() => {
                forceCorrectScale();
            }, 100);
        });
    } catch (error) {
        console.warn('Force correct scale failed:', error);
    }
}

// Console welcome message for dashboard
console.log('%c🛡️ CyberSecure Academy Dashboard', 'font-size: 20px; font-weight: bold; color: #007bff;');
console.log('%cAdmin panel loaded successfully! 🚀', 'font-size: 14px; color: #00ff88;');
