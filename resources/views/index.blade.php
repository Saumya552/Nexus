<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexus Central Command</title>
    <meta name="description" content="AI-driven wind and solar energy forecasting system.">
    <!-- Laravel CSRF Protection Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <!-- Astra Theme Font: Jost -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- jsPDF for report generation (local) -->
    <script src="{{ asset('assets/js/vendor/jspdf.umd.min.js') }}"></script>
    <script src="{{ asset('assets/js/vendor/jspdf.plugin.autotable.min.js') }}"></script>
    <!-- Icons -->
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/modules.css') }}">
</head>
<body class="theme-cyan">

    <!-- Cyberpunk Grid Background -->
    <div class="cyber-grid"></div>

    <!-- Animated Particle Network -->
    <canvas id="particle-canvas"></canvas>

    <div id="app" class="app-container hidden">
        <div class="split-layout">
            
            <!-- Sidebar Backdrop (click to close) -->
            <div class="sidebar-backdrop" id="sidebar-backdrop"></div>

            <!-- Left Fixed Panel (Control & Context) -->
            <aside class="left-panel" id="left-panel">
                <div class="nav-brand">
                    <i class='bx bx-hive' style="font-size: 32px; color: var(--theme-accent); filter: drop-shadow(var(--theme-glow)); transition: all 0.5s ease;"></i>
                    <span>NEXUS</span>
                </div>
                
                <nav class="nav-links">
                    <a href="#dashboard" class="nav-link active" data-route="dashboard"><i class='bx bx-grid-alt'></i> Dashboard</a>
                    <a href="#solar" class="nav-link" data-route="solar"><i class='bx bx-sun'></i> Solar Array</a>
                    <a href="#wind" class="nav-link" data-route="wind"><i class='bx bx-wind'></i> Wind Sector</a>
                    <a href="#climate" class="nav-link" data-route="climate"><i class='bx bx-leaf'></i> Climate</a>
                    <a href="#weather" class="nav-link" data-route="weather"><i class='bx bx-cloud-light-rain'></i> Weather</a>
                    <a href="#reports" class="nav-link" data-route="reports"><i class='bx bx-file'></i> Reports</a>
                    <a href="#contact" class="nav-link" data-route="contact"><i class='bx bx-broadcast'></i> Uplink</a>
                    <a href="#admin" class="nav-link hidden" data-route="admin" id="nav-admin-link"><i class='bx bx-shield-quarter'></i> Command</a>
                    <a href="#users" class="nav-link hidden" data-route="users" id="nav-users-link"><i class='bx bx-group'></i> Users</a>
                </nav>

                <!-- Dynamic Contextual Information -->
                <div id="context-panel" class="context-panel">
                </div>

                <div class="nav-controls">
                    <div class="user-profile">
                        <span id="display-username" class="user-name">User</span>
                        <span id="display-role" class="user-role">Role</span>
                    </div>
                    <button id="logout-btn" class="btn-icon" title="Logout"><i class='bx bx-log-out-circle'></i></button>
                </div>
            </aside>

            <!-- Right Scrollable Panel (Data & Charts) -->
            <main class="right-panel">
                <header class="page-header slide-up">
                    <button class="hamburger" id="hamburger-btn" title="Toggle Menu"><i class='bx bx-menu'></i></button>
                    <h2 id="page-title" class="page-title">SYSTEM OVERVIEW</h2>
                </header>
                
                <div id="view-container" class="view-container">
                </div>
            </main>

        </div>
    </div>

    <!-- Login Container -->
    <div id="login-app" class="login-container">
    </div>

    <!-- Scripts -->
    <script src="{{ asset('assets/js/particles.js') }}"></script>
    <script src="{{ asset('assets/js/api.js') }}"></script>
    <script src="{{ asset('assets/js/charts.js') }}"></script>
    <script src="{{ asset('assets/js/app.js') }}"></script>
</body>
</html>
