/**
 * Main application logic, routing, and dynamic theming
 */

const app = {
    user: null,
    currentRoute: '',

    // Theme accent colors per route
    themeColors: { dashboard: '#00f3ff', solar: '#ff003c', wind: '#00ff66', contact: '#00f3ff', admin: '#00f3ff', climate: '#00f3ff', weather: '#00f3ff', users: '#00f3ff', reports: '#00f3ff' },

    templates: {
        login: `
            <div class="flip-scene">
                <div class="flip-card" id="flip-card">
                    <!-- FRONT: LOGIN -->
                    <div class="flip-face flip-front">
                        <div class="login-box">
                            <div class="login-logo"><i class='bx bx-hive'></i></div>
                            <h2>CENTRAL LOGIN</h2>
                            <div id="login-error" class="auth-error"></div>
                            <form id="login-form">
                                <div class="form-group" style="text-align:left"><label class="form-label">OPERATOR ID</label><input type="text" id="username" class="form-input" required></div>
                                <div class="form-group" style="text-align:left"><label class="form-label">PASSCODE</label><input type="password" id="password" class="form-input" required></div>
                                <button type="submit" class="btn btn-primary btn-block" style="margin-top:16px">INITIATE LINK</button>
                            </form>
                            <div class="auth-switch">No clearance? <a href="#" id="show-register">CREATE ACCOUNT</a></div>
                        </div>
                    </div>
                    <!-- BACK: REGISTER -->
                    <div class="flip-face flip-back">
                        <div class="login-box">
                            <div class="login-logo"><i class='bx bx-user-plus'></i></div>
                            <h2>NEW OPERATOR</h2>
                            <div id="register-error" class="auth-error"></div>
                            <div id="register-success" class="auth-success"></div>
                            <form id="register-form">
                                <div class="form-group" style="text-align:left"><label class="form-label">OPERATOR ID</label><input type="text" id="reg-username" class="form-input" required minlength="3"></div>
                                <div class="form-group" style="text-align:left"><label class="form-label">COMMS NODE (EMAIL)</label><input type="email" id="reg-email" class="form-input" required></div>
                                <div class="form-group" style="text-align:left"><label class="form-label">PASSCODE</label><input type="password" id="reg-password" class="form-input" required minlength="6"></div>
                                <div class="form-group" style="text-align:left"><label class="form-label">CONFIRM PASSCODE</label><input type="password" id="reg-confirm" class="form-input" required></div>
                                <button type="submit" class="btn btn-primary btn-block" style="margin-top:16px">REGISTER</button>
                            </form>
                            <div class="auth-switch">Have clearance? <a href="#" id="show-login">BACK TO LOGIN</a></div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        dashboard: `
            <div class="stat-grid slide-up delay-1">
                <div class="stat-widget"><h3>ACTIVE SOLAR ARRAYS</h3><div class="value" id="dash-solar-count">0</div></div>
                <div class="stat-widget"><h3>ACTIVE WIND SECTORS</h3><div class="value" id="dash-wind-count">0</div></div>
                <div class="stat-widget"><h3>SYNCED CYCLES</h3><div class="value" id="dash-weather-count">0</div></div>
            </div>
            <div class="surface-card slide-up delay-2">
                <div class="bento-header"><h3 class="bento-title">GLOBAL SOLAR TELEMETRY</h3></div>
                <div style="position: relative; height: 350px; width: 100%;"><canvas id="dash-solar-chart"></canvas></div>
            </div>
            <div class="surface-card slide-up delay-3">
                <div class="bento-header"><h3 class="bento-title">GLOBAL WIND TELEMETRY</h3></div>
                <div style="position: relative; height: 350px; width: 100%;"><canvas id="dash-wind-chart"></canvas></div>
            </div>
        `,
        solar: `
            <div class="surface-card slide-up delay-1">
                <div class="bento-header">
                    <h3 class="bento-title">SECTOR ANALYSIS <span style="background:#00f3ff22;color:#00f3ff;padding:2px 10px;border-radius:4px;font-size:0.65em;margin-left:10px;animation:pulse 2s infinite;">&#9679; LIVE</span></h3>
                    <select id="solar-location" class="form-input" style="width: 250px;">
                        <option value="">ALL SECTORS</option>
                        <option value="Mumbai">MUMBAI</option>
                        <option value="Delhi">DELHI</option>
                        <option value="Bangalore">BANGALORE</option>
                        <option value="Chennai">CHENNAI</option>
                        <option value="Jaipur">JAIPUR</option>
                    </select>
                </div>
                <div id="solar-update-time" style="color:#6b7280;font-size:0.75em;margin-bottom:8px;font-family:var(--font-heading);"></div>
                <div style="position: relative; height: 400px; width: 100%;"><canvas id="solar-main-chart"></canvas></div>
            </div>
            <div class="surface-card slide-up delay-2">
                <table class="data-table">
                    <thead><tr><th>SECTOR</th><th>DATE</th><th>RADIATION (W/m2)</th><th>PREDICTED (kWh)</th><th>ACTUAL (kWh)</th><th>EFFICIENCY</th><th>CONFIDENCE</th></tr></thead>
                    <tbody id="solar-table-body"></tbody>
                </table>
            </div>
        `,
        wind: `
            <div class="surface-card slide-up delay-1">
                <div class="bento-header">
                    <h3 class="bento-title">SECTOR ANALYSIS <span style="background:#00ff6622;color:#00ff66;padding:2px 10px;border-radius:4px;font-size:0.65em;margin-left:10px;animation:pulse 2s infinite;">&#9679; LIVE</span></h3>
                    <select id="wind-location" class="form-input" style="width: 250px;">
                        <option value="">ALL SECTORS</option>
                        <option value="Mumbai">MUMBAI</option>
                        <option value="Delhi">DELHI</option>
                        <option value="Bangalore">BANGALORE</option>
                        <option value="Chennai">CHENNAI</option>
                        <option value="Jaipur">JAIPUR</option>
                    </select>
                </div>
                <div id="wind-update-time" style="color:#6b7280;font-size:0.75em;margin-bottom:8px;font-family:var(--font-heading);"></div>
                <div style="position: relative; height: 400px; width: 100%;"><canvas id="wind-main-chart"></canvas></div>
            </div>
            <div class="surface-card slide-up delay-2">
                <table class="data-table">
                    <thead><tr><th>SECTOR</th><th>DATE</th><th>WIND (m/s)</th><th>PREDICTED (kWh)</th><th>ACTUAL (kWh)</th><th>TURBINE (kW)</th><th>CONFIDENCE</th></tr></thead>
                    <tbody id="wind-table-body"></tbody>
                </table>
            </div>
        `,
        contact: `
            <div class="surface-card slide-up delay-1" style="max-width: 800px;">
                <div class="bento-header"><h3 class="bento-title">SECURE TRANSMISSION PROTOCOL</h3></div>
                <div id="contact-alert" style="display:none; padding: 16px; border: 1px solid var(--theme-accent); color: var(--theme-accent); background: var(--theme-bg-glow); margin-bottom: 24px; font-family: var(--font-heading);"></div>
                <form id="contact-form">
                    <div class="form-group"><label class="form-label">OPERATOR DESIGNATION</label><input type="text" id="contact-name" class="form-input" required></div>
                    <div class="form-group"><label class="form-label">COMMS NODE</label><input type="email" id="contact-email" class="form-input" required></div>
                    <div class="form-group"><label class="form-label">DIRECTIVE / SUBJECT</label><input type="text" id="contact-subject" class="form-input" required></div>
                    <div class="form-group"><label class="form-label">DATA PAYLOAD</label><textarea id="contact-message" class="form-input" rows="6" required style="resize: vertical;"></textarea></div>
                    <button type="submit" class="btn btn-primary" id="contact-submit-btn">TRANSMIT DATA</button>
                </form>
            </div>
        `,
        admin: `
            <div class="surface-card slide-up delay-1">
                <div class="bento-header"><h3 class="bento-title">INTERCEPTED TRANSMISSIONS</h3></div>
                <div id="admin-messages-list"><div style="text-align: center; color: var(--text-muted); padding: 40px;">SCANNING LOGS...</div></div>
            </div>
            <div class="surface-card slide-up delay-2">
                <div class="bento-header"><h3 class="bento-title">ACTIVE PERSONNEL CLEARANCE</h3></div>
                <table class="data-table">
                    <thead><tr><th>OPERATOR ID</th><th>CLEARANCE LEVEL</th><th>INDUCTION DATE</th></tr></thead>
                    <tbody id="admin-users-list"><tr><td colspan="3" style="text-align: center;">SCANNING REGISTRY...</td></tr></tbody>
                </table>
            </div>
        `,
        climate: `
            <div class="climate-summary-row slide-up delay-1">
                <div class="climate-kpi"><i class='bx bx-cloud-download kpi-icon'></i><div class="kpi-label">CO₂ SAVED</div><div class="kpi-value"><span id="cl-co2">0</span><span class="kpi-unit">T</span></div></div>
                <div class="climate-kpi"><i class='bx bx-leaf kpi-icon'></i><div class="kpi-label">GREEN ENERGY</div><div class="kpi-value"><span id="cl-green">0</span><span class="kpi-unit">%</span></div></div>
                <div class="climate-kpi"><i class='bx bx-wind kpi-icon'></i><div class="kpi-label">AIR QUALITY</div><div class="kpi-value"><span id="cl-aqi">0</span><span class="kpi-unit">AQI</span></div></div>
                <div class="climate-kpi"><i class='bx bx-bar-chart-alt-2 kpi-icon'></i><div class="kpi-label">SUSTAINABILITY</div><div class="kpi-value"><span id="cl-score">0</span><span class="kpi-unit">/100</span></div></div>
            </div>
            <div class="ring-row slide-up delay-2">
                <div class="ring-card"><div class="ring-svg"><svg viewBox="0 0 140 140"><circle class="ring-track" cx="70" cy="70" r="55"/><circle class="ring-fill" id="ring-co2" cx="70" cy="70" r="55" stroke-dasharray="345.6" stroke-dashoffset="345.6"/></svg><div class="ring-pct" id="ring-co2-pct">0%</div></div><div class="ring-title">CARBON OFFSET</div></div>
                <div class="ring-card"><div class="ring-svg"><svg viewBox="0 0 140 140"><circle class="ring-track" cx="70" cy="70" r="55"/><circle class="ring-fill" id="ring-green" cx="70" cy="70" r="55" stroke-dasharray="345.6" stroke-dashoffset="345.6"/></svg><div class="ring-pct" id="ring-green-pct">0%</div></div><div class="ring-title">GREEN RATIO</div></div>
                <div class="ring-card"><div class="ring-svg"><svg viewBox="0 0 140 140"><circle class="ring-track" cx="70" cy="70" r="55"/><circle class="ring-fill" id="ring-sus" cx="70" cy="70" r="55" stroke-dasharray="345.6" stroke-dashoffset="345.6"/></svg><div class="ring-pct" id="ring-sus-pct">0%</div></div><div class="ring-title">SUSTAINABILITY</div></div>
            </div>
            <div class="surface-card slide-up delay-2">
                <div class="bento-header"><h3 class="bento-title">AQI INDEX</h3></div>
                <div class="aqi-bar-wrap"><div class="aqi-label-row"><span>Good</span><span id="aqi-val-label">0</span><span>Hazardous</span></div><div class="aqi-bar-track"><div class="aqi-bar-fill" id="aqi-bar" style="width:0%"></div></div><div class="aqi-zones"><span>0-50</span><span>51-100</span><span>101-150</span><span>151-200</span><span>201-300</span><span>300+</span></div></div>
            </div>
            <div class="surface-card slide-up delay-3">
                <div class="bento-header"><h3 class="bento-title">TEMP ANOMALY TREND</h3></div>
                <div style="position:relative;height:300px;"><canvas id="climate-chart"></canvas></div>
            </div>
            <div class="surface-card slide-up delay-3">
                <div class="bento-header"><h3 class="bento-title">REGIONAL IMPACT</h3></div>
                <div class="region-grid" id="region-grid"></div>
            </div>
        `,
        weather: `
            <div class="bento-header slide-up delay-1">
                <h3 class="bento-title">LIVE CONDITIONS</h3>
                <select id="weather-city" class="weather-city-select"><option value="Mumbai">MUMBAI</option><option value="Delhi">DELHI</option><option value="Bangalore">BANGALORE</option><option value="Chennai">CHENNAI</option><option value="Jaipur">JAIPUR</option></select>
            </div>
            <div class="weather-hero slide-up delay-1">
                <div><div class="weather-city-name" id="w-city">MUMBAI</div><div class="weather-main-temp"><span id="w-temp">--</span><span class="unit">°C</span></div><div class="weather-condition" id="w-cond">Loading...</div><div class="weather-updated" id="w-updated"></div></div>
                <div class="weather-stats-grid">
                    <div class="weather-stat-item"><i class='bx bx-wind'></i><div class="ws-label">WIND</div><div class="ws-value"><span id="w-wind">--</span> <span class="ws-unit">m/s</span></div></div>
                    <div class="weather-stat-item"><i class='bx bx-droplet'></i><div class="ws-label">HUMIDITY</div><div class="ws-value"><span id="w-hum">--</span><span class="ws-unit">%</span></div></div>
                    <div class="weather-stat-item"><i class='bx bx-tachometer'></i><div class="ws-label">PRESSURE</div><div class="ws-value"><span id="w-pres">--</span> <span class="ws-unit">hPa</span></div></div>
                    <div class="weather-stat-item"><i class='bx bx-sun'></i><div class="ws-label">UV INDEX</div><div class="ws-value"><span id="w-uv">--</span></div></div>
                </div>
            </div>
            <div class="solar-badge slide-up delay-2"><i class='bx bx-bulb'></i> Solar Efficiency Today: <strong id="w-solar">--</strong>%</div>
            <div class="surface-card slide-up delay-2">
                <div class="bento-header"><h3 class="bento-title">RAIN PROBABILITY</h3></div>
                <div class="rain-bar-wrap"><div class="rain-bar-track"><div class="rain-bar-fill" id="rain-bar" style="width:0%"></div></div></div>
                <div style="text-align:right;font-size:13px;color:var(--text-secondary);margin-top:4px;"><span id="rain-pct">0</span>% chance</div>
            </div>
            <div class="surface-card slide-up delay-2">
                <div class="bento-header"><h3 class="bento-title">7-DAY FORECAST</h3></div>
                <div class="forecast-strip" id="forecast-strip"></div>
            </div>
            <div class="surface-card slide-up delay-3">
                <div class="bento-header"><h3 class="bento-title">WEEKLY CHART</h3></div>
                <div style="position:relative;height:300px;"><canvas id="weather-chart"></canvas></div>
            </div>
        `,
        users: `
            <div class="um-stats-row slide-up delay-1">
                <div class="um-stat"><i class='bx bx-group'></i><div><div class="um-stat-val" id="um-total">0</div><div class="um-stat-lbl">TOTAL USERS</div></div></div>
                <div class="um-stat"><i class='bx bx-check-circle'></i><div><div class="um-stat-val" id="um-active">0</div><div class="um-stat-lbl">ACTIVE NOW</div></div></div>
                <div class="um-stat"><i class='bx bx-shield'></i><div><div class="um-stat-val" id="um-admins">0</div><div class="um-stat-lbl">ADMINS</div></div></div>
            </div>
            <div class="surface-card slide-up delay-2">
                <div class="um-toolbar"><input type="text" class="um-search" id="um-search" placeholder="Search users..."><button class="btn btn-primary" onclick="app.showUserModal()">+ ADD USER</button></div>
                <table class="data-table"><thead><tr><th>USER</th><th>ROLE</th><th>STATUS</th><th>LAST LOGIN</th><th>ACTIONS</th></tr></thead><tbody id="um-table-body"><tr><td colspan="5" style="text-align:center">LOADING...</td></tr></tbody></table>
            </div>
            <div class="surface-card slide-up delay-3">
                <div class="bento-header"><h3 class="bento-title">ACTIVITY LOG</h3></div>
                <table class="data-table log-table"><thead><tr><th>OPERATOR</th><th>ACTION</th><th>TIME</th><th>IP</th></tr></thead><tbody id="um-log-body"><tr><td colspan="4" style="text-align:center">SCANNING...</td></tr></tbody></table>
            </div>
        `,
        reports: `
            <div class="surface-card slide-up delay-1" style="text-align:center;padding:48px">
                <i class='bx bx-file' style="font-size:64px;color:var(--theme-accent);margin-bottom:16px;display:block"></i>
                <h3 style="font-family:var(--font-heading);font-size:24px;color:var(--text-primary);margin-bottom:12px">NEXUS COMBINED REPORT</h3>
                <p style="color:var(--text-secondary);margin-bottom:32px;max-width:500px;margin-left:auto;margin-right:auto">Generate a comprehensive PDF report containing data from all modules — Dashboard, Solar, Wind, Climate Analytics, and Live Weather.</p>
                <div id="report-status" style="margin-bottom:24px;font-family:var(--font-heading);font-size:13px;color:var(--text-muted)"></div>
                <button class="btn btn-primary" id="generate-report-btn" onclick="app.generateReport()"><i class='bx bx-download'></i> GENERATE & DOWNLOAD PDF</button>
            </div>
            <div class="surface-card slide-up delay-2">
                <div class="bento-header"><h3 class="bento-title">REPORT CONTENTS</h3></div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
                    <div class="climate-kpi"><i class='bx bx-grid-alt kpi-icon'></i><div class="kpi-label">DASHBOARD</div><div style="font-size:13px;color:var(--text-secondary);margin-top:6px">Solar & Wind prediction counts, synced cycles</div></div>
                    <div class="climate-kpi"><i class='bx bx-sun kpi-icon'></i><div class="kpi-label">SOLAR DATA</div><div style="font-size:13px;color:var(--text-secondary);margin-top:6px">Prediction table with timestamps and values</div></div>
                    <div class="climate-kpi"><i class='bx bx-wind kpi-icon'></i><div class="kpi-label">WIND DATA</div><div style="font-size:13px;color:var(--text-secondary);margin-top:6px">Wind velocity predictions and actuals</div></div>
                    <div class="climate-kpi"><i class='bx bx-leaf kpi-icon'></i><div class="kpi-label">CLIMATE</div><div style="font-size:13px;color:var(--text-secondary);margin-top:6px">CO₂ savings, AQI, sustainability scores</div></div>
                    <div class="climate-kpi"><i class='bx bx-cloud kpi-icon'></i><div class="kpi-label">WEATHER</div><div style="font-size:13px;color:var(--text-secondary);margin-top:6px">Current conditions and 7-day forecast</div></div>
                    <div class="climate-kpi"><i class='bx bx-time kpi-icon'></i><div class="kpi-label">GENERATED</div><div style="font-size:13px;color:var(--text-secondary);margin-top:6px">Timestamped with operator credentials</div></div>
                </div>
            </div>
        `
    },

    contexts: {
        dashboard: { title: "SYSTEM STATUS", body: "Welcome to the Nexus Central Command interface. This terminal provides real-time oversight of global renewable energy generation, utilizing advanced atmospheric predictive modeling algorithms." },
        solar: { title: "SOLAR PREDICTION MODELS", body: "Our AI systems analyze local solar irradiance, cloud cover density, and atmospheric opacity to predict energy yields. High radiation indices heavily correlate with optimal output. Red-shifted models indicate thermal capture tracking." },
        wind: { title: "WIND PREDICTION MODELS", body: "Atmospheric pressure differentials and barometric trends are fed into our neural network to predict wind velocity. The green-shifted interface indicates optimal aero-dynamic tracking and kinetic energy conversion metrics." },
        contact: { title: "SECURE COMMS", body: "Use this terminal to establish an encrypted uplink with Central Command. All payloads are secured via 256-bit quantum-resistant encryption before transmission." },
        admin: { title: "COMMAND OVERSIGHT", body: "Restricted Access Area. You are currently viewing secure logs and personnel clearance levels. Any unauthorized modifications will be logged." },
        climate: { title: "CLIMATE INTELLIGENCE", body: "Global carbon emission tracking and sustainability scoring. Our models aggregate CO₂ savings from all renewable sectors, compute air quality indices, and track temperature anomalies against baseline projections." },
        weather: { title: "ATMOSPHERIC TELEMETRY", body: "Live meteorological data feeds from sensor arrays across all operational regions. Weather patterns directly influence solar irradiance and wind velocity predictions." },
        users: { title: "PERSONNEL REGISTRY", body: "Manage operator access, assign clearance levels, and monitor all authentication events across the NEXUS system." },
        reports: { title: "REPORT GENERATOR", body: "Generate and download comprehensive PDF reports combining data from all NEXUS modules. Reports are timestamped and include operator credentials." }
    },

    async init() {
        this.bindEvents();
        try {
            const res = await api.auth.check();
            if (res.authenticated) {
                this.user = res.user;
                this.showApp();
                this.navigate(window.location.hash.replace('#', '') || 'dashboard');
            } else {
                this.showLogin();
            }
        } catch (e) { this.showLogin(); }
    },

    bindEvents() {
        const panel = document.getElementById('left-panel');
        const backdrop = document.getElementById('sidebar-backdrop');
        const hamburger = document.getElementById('hamburger-btn');

        // Hamburger toggle
        hamburger.addEventListener('click', () => {
            panel.classList.toggle('open');
            backdrop.classList.toggle('visible');
        });

        // Backdrop click closes sidebar
        backdrop.addEventListener('click', () => {
            panel.classList.remove('open');
            backdrop.classList.remove('visible');
        });

        // Nav links — navigate + close sidebar
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const route = e.currentTarget.getAttribute('data-route');
                panel.classList.remove('open');
                backdrop.classList.remove('visible');
                this.navigate(route);
            });
        });
        document.getElementById('logout-btn').addEventListener('click', async () => {
            await api.auth.logout();
            this.user = null;
            this.showLogin();
        });
    },

    showApp() {
        document.getElementById('login-app').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        document.getElementById('display-username').innerText = this.user.username;
        document.getElementById('display-role').innerText = this.user.role;
        if (this.user.role === 'admin') {
            document.getElementById('nav-admin-link').classList.remove('hidden');
            document.getElementById('nav-users-link').classList.remove('hidden');
        } else {
            document.getElementById('nav-admin-link').classList.add('hidden');
            document.getElementById('nav-users-link').classList.add('hidden');
        }
    },

    showLogin() {
        document.getElementById('app').classList.add('hidden');
        const loginContainer = document.getElementById('login-app');
        loginContainer.classList.remove('hidden');
        loginContainer.innerHTML = this.templates.login;
        document.body.className = 'theme-cyan';

        const flipCard = document.getElementById('flip-card');

        // Flip toggles
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            flipCard.classList.add('flipped');
        });
        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            flipCard.classList.remove('flipped');
        });

        // Login form
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const errorDiv = document.getElementById('login-error');
            btn.innerHTML = "PROCESSING..."; btn.disabled = true; errorDiv.style.display = 'none';
            try {
                const res = await api.auth.login(document.getElementById('username').value, document.getElementById('password').value);
                this.user = res.user;
                this.showApp();
                this.navigate('dashboard');
            } catch (err) {
                errorDiv.innerText = "ACCESS DENIED: " + err.message;
                errorDiv.style.display = 'block';
                btn.innerHTML = "INITIATE LINK"; btn.disabled = false;
            }
        });

        // Register form
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const errorDiv = document.getElementById('register-error');
            const successDiv = document.getElementById('register-success');
            const pass = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;

            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';

            if (pass !== confirm) {
                errorDiv.innerText = "PASSCODES DO NOT MATCH";
                errorDiv.style.display = 'block';
                return;
            }

            btn.innerHTML = "PROCESSING..."; btn.disabled = true;
            try {
                await api.auth.register(
                    document.getElementById('reg-username').value,
                    document.getElementById('reg-email').value,
                    pass
                );
                successDiv.innerText = "ACCOUNT CREATED — REDIRECTING TO LOGIN...";
                successDiv.style.display = 'block';
                e.target.reset();
                setTimeout(() => flipCard.classList.remove('flipped'), 2000);
            } catch (err) {
                errorDiv.innerText = err.message;
                errorDiv.style.display = 'block';
            }
            btn.innerHTML = "REGISTER"; btn.disabled = false;
        });
    },

    async navigate(route) {
        if (!this.user) return;
        if (!this.templates[route]) route = 'dashboard';
        this.currentRoute = route;
        window.location.hash = route;

        if (route === 'solar') document.body.className = 'theme-red';
        else if (route === 'wind') document.body.className = 'theme-green';
        else document.body.className = 'theme-cyan';

        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-route="${route}"]`);
        if (activeLink) activeLink.classList.add('active');

        const titles = { dashboard: 'GLOBAL OVERVIEW', solar: 'SOLAR ARRAY SEC.', wind: 'WIND SECTOR SEC.', contact: 'COMMS UPLINK', admin: 'COMMAND LOGS', climate: 'CLIMATE ANALYTICS', weather: 'LIVE WEATHER', users: 'USER MANAGEMENT', reports: 'REPORTS' };

        const titleEl = document.getElementById('page-title');
        titleEl.innerText = titles[route];

        const contextPanel = document.getElementById('context-panel');
        contextPanel.innerHTML = `<div class="context-title">${this.contexts[route].title}</div><div class="context-body">${this.contexts[route].body}</div>`;

        titleEl.parentElement.classList.remove('slide-up');
        void titleEl.parentElement.offsetWidth;
        titleEl.parentElement.classList.add('slide-up');

        const container = document.getElementById('view-container');
        container.innerHTML = this.templates[route];

        setTimeout(() => { this[`load${route.charAt(0).toUpperCase() + route.slice(1)}`](); }, 50);
    },

    async loadDashboard() {
        try {
            const data = await api.dashboard.getSummary();
            const color = this.themeColors['dashboard'];
            document.getElementById('dash-solar-count').innerText = data.stats.solar_count;
            document.getElementById('dash-wind-count').innerText = data.stats.wind_count;
            document.getElementById('dash-weather-count').innerText = data.stats.weather_count;
            if (data.solar && data.solar.length > 0) {
                const labels = data.solar.map(i => i.prediction_date);
                const actual = data.solar.map(i => i.actual_energy_kwh || i.predicted_energy_kwh);
                const predicted = data.solar.map(i => i.predicted_energy_kwh);
                chartManager.createSolarChart('dash-solar-chart', labels.reverse(), actual.reverse(), predicted.reverse(), color);
            }
            if (data.wind && data.wind.length > 0) {
                const labels = data.wind.map(i => i.prediction_date);
                const energy = data.wind.map(i => i.predicted_energy_kwh);
                const speed = data.wind.map(i => i.predicted_wind_speed);
                chartManager.createWindChart('dash-wind-chart', labels.reverse(), speed.reverse(), energy.reverse(), color);
            }
        } catch (e) { console.error(e); }
    },

    async loadSolar(location = null) {
        try {
            const data = await api.predictions.getSolar(location);
            const color = this.themeColors['solar'];
            const today = new Date().toISOString().slice(0, 10);

            // Use unique dates for chart
            const uniqueDates = [...new Set(data.map(i => i.prediction_date))];
            const chartData = uniqueDates.map(d => {
                const items = data.filter(i => i.prediction_date === d);
                return { date: d, predicted: items.reduce((s,i) => s + parseFloat(i.predicted_energy_kwh), 0) / items.length,
                         actual: items.reduce((s,i) => s + parseFloat(i.actual_energy_kwh || i.predicted_energy_kwh), 0) / items.length };
            });
            chartManager.createSolarChart('solar-main-chart', chartData.map(d => d.date), chartData.map(d => d.actual), chartData.map(d => d.predicted), color);

            // Update timestamp
            const timeEl = document.getElementById('solar-update-time');
            if (timeEl) timeEl.innerText = 'Last updated: ' + new Date().toLocaleTimeString() + ' | 7-Day Forecast (today + 6 days)';

            document.getElementById('solar-table-body').innerHTML = data.map(item => {
                const isToday = item.prediction_date === today;
                const isFuture = item.prediction_date > today;
                const rowStyle = isToday ? 'background:rgba(0,243,255,0.06);' : '';
                const badge = isToday ? '<span style="color:#00f3ff;font-size:0.7em;"> [TODAY]</span>' : (isFuture ? '<span style="color:#6b7280;font-size:0.7em;"> [FORECAST]</span>' : '');
                return `<tr style="${rowStyle}">
                    <td>${item.location}</td><td>${item.prediction_date}${badge}</td><td>${item.predicted_radiation}</td>
                    <td style="color:${color}; font-weight: 700;">${item.predicted_energy_kwh}</td>
                    <td>${item.actual_energy_kwh || '<span style="color:#6b7280">PENDING</span>'}</td>
                    <td>${item.panel_efficiency}%</td><td>${item.confidence}%</td>
                </tr>`;
            }).join('');
            const select = document.getElementById('solar-location');
            if (location) select.value = location;
            select.onchange = (e) => this.loadSolar(e.target.value);

            // Auto-refresh every 60s
            clearTimeout(this._solarTimer);
            this._solarTimer = setTimeout(() => { if (this.currentModule === 'solar') this.loadSolar(location); }, 60000);
        } catch (e) { console.error(e); }
    },

    async loadWind(location = null) {
        try {
            const data = await api.predictions.getWind(location);
            const color = this.themeColors['wind'];
            const today = new Date().toISOString().slice(0, 10);

            const uniqueDates = [...new Set(data.map(i => i.prediction_date))];
            const chartData = uniqueDates.map(d => {
                const items = data.filter(i => i.prediction_date === d);
                return { date: d, energy: items.reduce((s,i) => s + parseFloat(i.predicted_energy_kwh), 0) / items.length,
                         speed: items.reduce((s,i) => s + parseFloat(i.predicted_wind_speed), 0) / items.length };
            });
            chartManager.createWindChart('wind-main-chart', chartData.map(d => d.date), chartData.map(d => d.speed), chartData.map(d => d.energy), color);

            const timeEl = document.getElementById('wind-update-time');
            if (timeEl) timeEl.innerText = 'Last updated: ' + new Date().toLocaleTimeString() + ' | 7-Day Forecast (today + 6 days)';

            document.getElementById('wind-table-body').innerHTML = data.map(item => {
                const isToday = item.prediction_date === today;
                const isFuture = item.prediction_date > today;
                const rowStyle = isToday ? 'background:rgba(0,255,102,0.06);' : '';
                const badge = isToday ? '<span style="color:#00ff66;font-size:0.7em;"> [TODAY]</span>' : (isFuture ? '<span style="color:#6b7280;font-size:0.7em;"> [FORECAST]</span>' : '');
                return `<tr style="${rowStyle}">
                    <td>${item.location}</td><td>${item.prediction_date}${badge}</td><td>${item.predicted_wind_speed}</td>
                    <td style="color:${color}; font-weight: 700;">${item.predicted_energy_kwh}</td>
                    <td>${item.actual_energy_kwh || '<span style="color:#6b7280">PENDING</span>'}</td>
                    <td>${item.turbine_capacity}</td><td>${item.confidence}%</td>
                </tr>`;
            }).join('');
            const select = document.getElementById('wind-location');
            if (location) select.value = location;
            select.onchange = (e) => this.loadWind(e.target.value);

            clearTimeout(this._windTimer);
            this._windTimer = setTimeout(() => { if (this.currentModule === 'wind') this.loadWind(location); }, 60000);
        } catch (e) { console.error(e); }
    },

    async loadContact() {
        if (this.user) {
            document.getElementById('contact-name').value = this.user.username;
            document.getElementById('contact-email').value = this.user.email || '';
        }
        document.getElementById('contact-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('contact-submit-btn');
            const alert = document.getElementById('contact-alert');
            btn.innerHTML = "TRANSMITTING..."; btn.disabled = true;
            try {
                await api.contact.submit({
                    name: document.getElementById('contact-name').value,
                    email: document.getElementById('contact-email').value,
                    subject: document.getElementById('contact-subject').value,
                    message: document.getElementById('contact-message').value
                });
                alert.style.display = 'block';
                alert.innerText = "TRANSMISSION VERIFIED AND LOGGED.";
                document.getElementById('contact-form').reset();
            } catch (err) {
                alert.style.display = 'block';
                alert.style.borderColor = '#ff003c';
                alert.style.color = '#ff003c';
                alert.innerText = "TRANSMISSION ERROR: " + err.message;
            } finally {
                btn.innerHTML = "TRANSMIT DATA"; btn.disabled = false;
            }
        });
    },

    async loadAdmin() {
        if (this.user.role !== 'admin') { this.navigate('dashboard'); return; }
        try {
            const messages = await api.admin.getMessages();
            const msgsContainer = document.getElementById('admin-messages-list');
            if (messages.length === 0) msgsContainer.innerHTML = "<p style='color: var(--text-muted); text-align: center;'>NO ACTIVE INTERCEPTS.</p>";
            else {
                msgsContainer.innerHTML = messages.map(msg => `
                    <div style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05);" id="msg-${msg.id}">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                            <span style="font-family:var(--font-heading); color:var(--text-primary); font-weight:700;">${msg.name} [${msg.subject}]</span>
                            <span style="font-size:12px;color:var(--text-muted);">${new Date(msg.created_at).toLocaleDateString()}</span>
                        </div>
                        <div style="color: var(--text-secondary); margin-bottom: 12px;">${msg.message}</div>
                        <div style="text-align:right;">
                            ${!msg.is_read ? `<button class="btn btn-primary" style="padding: 8px 16px; font-size: 12px;" onclick="app.markMessageRead(${msg.id})">ACKNOWLEDGE</button>` : '<span style="font-size: 12px; color: var(--theme-accent);">ACKNOWLEDGED</span>'}
                        </div>
                    </div>`).join('');
            }
            const users = await api.admin.getUsers();
            document.getElementById('admin-users-list').innerHTML = users.map(u => `
                <tr>
                    <td>
                        <strong style="font-family:var(--font-heading); color:${u.role==='admin'?'var(--theme-accent)':'var(--text-primary)'}">${u.username}</strong><br>
                        <span style="font-size:12px; color:var(--text-muted)">${u.email}</span>
                    </td>
                    <td>${u.role.toUpperCase()}</td>
                    <td>${new Date(u.created_at).toLocaleDateString()}</td>
                </tr>`).join('');
        } catch (e) { console.error(e); }
    },

    async markMessageRead(id) {
        try {
            await api.admin.markMessageRead(id);
            const msg = document.getElementById(`msg-${id}`);
            if (msg) {
                const btn = msg.querySelector('button');
                if (btn) btn.outerHTML = '<span style="font-size: 12px; color: var(--theme-accent);">ACKNOWLEDGED</span>';
            }
        } catch (e) { console.error(e); }
    },

    // ===== CLIMATE ANALYTICS =====
    async loadClimate() {
        try {
            const [summary, regions, history] = await Promise.all([
                api.climate.getSummary(), api.climate.getRegions(), api.climate.getHistory()
            ]);
            const t = summary.totals;
            this.animateCount('cl-co2', t.total_co2_saved);
            this.animateCount('cl-green', t.avg_green_energy);
            this.animateCount('cl-aqi', t.avg_aqi);
            this.animateCount('cl-score', t.avg_sustainability);

            // Rings (circumference = 345.6)
            const circ = 345.6;
            this.animateRing('ring-co2', 'ring-co2-pct', Math.min(t.total_co2_saved / 60000 * 100, 100), circ);
            this.animateRing('ring-green', 'ring-green-pct', t.avg_green_energy, circ);
            this.animateRing('ring-sus', 'ring-sus-pct', t.avg_sustainability, circ);

            // AQI bar
            const aqiPct = Math.min((t.avg_aqi / 300) * 100, 100);
            const aqiColor = t.avg_aqi <= 50 ? '#00ff66' : t.avg_aqi <= 100 ? '#ffe66d' : t.avg_aqi <= 150 ? '#ff9f43' : '#ff003c';
            setTimeout(() => {
                const bar = document.getElementById('aqi-bar');
                if (bar) { bar.style.width = aqiPct + '%'; bar.style.background = aqiColor; }
                const lbl = document.getElementById('aqi-val-label');
                if (lbl) lbl.innerText = t.avg_aqi;
            }, 200);

            // Temp anomaly chart
            if (history.length > 0) {
                const ctx = document.getElementById('climate-chart');
                if (ctx && chartManager) {
                    if (chartManager.instances['climate-chart']) chartManager.instances['climate-chart'].destroy();
                    chartManager.instances['climate-chart'] = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: history.map(h => h.recorded_date),
                            datasets: [{
                                label: 'Temp Anomaly (°C)', data: history.map(h => h.temp_anomaly),
                                borderColor: '#00f3ff', backgroundColor: 'rgba(0,243,255,0.1)',
                                fill: true, tension: 0.4, borderWidth: 3, pointRadius: 4, pointBackgroundColor: '#00f3ff'
                            }, {
                                label: 'AQI', data: history.map(h => h.aqi),
                                borderColor: '#ffe66d', backgroundColor: 'transparent',
                                borderDash: [5,3], tension: 0.4, borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#ffe66d', yAxisID: 'y1'
                            }]
                        },
                        options: { responsive: true, maintainAspectRatio: false, scales: {
                            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8c9baf' } },
                            y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#8c9baf' } },
                            x: { grid: { display: false }, ticks: { color: '#8c9baf', maxTicksLimit: 7 } }
                        }, plugins: { legend: { labels: { color: '#c0cad8', font: { family: "'Jost'" } } } } }
                    });
                }
            }

            // Region cards
            const grid = document.getElementById('region-grid');
            if (grid) {
                grid.innerHTML = regions.map(r => {
                    const sc = r.sustainability_score;
                    const badgeColor = sc >= 80 ? '#00ff66' : sc >= 60 ? '#ffe66d' : '#ff003c';
                    return `<div class="region-card">
                        <div class="region-name">${r.region}</div>
                        <div class="region-stat"><span class="label">CO₂ Saved</span><span class="val">${Number(r.co2_saved_tonnes).toLocaleString()}T</span></div>
                        <div class="region-stat"><span class="label">Green Energy</span><span class="val">${r.green_energy_pct}%</span></div>
                        <div class="region-stat"><span class="label">AQI</span><span class="val">${r.aqi}</span></div>
                        <div class="region-stat"><span class="label">Score</span><span class="score-badge" style="color:${badgeColor};border-color:${badgeColor}">${sc}/100</span></div>
                    </div>`;
                }).join('');
            }
        } catch (e) { console.error(e); }
    },

    // ===== LIVE WEATHER =====
    async loadWeather(city = 'Mumbai') {
        try {
            const [current, forecast] = await Promise.all([
                api.weather.getCurrent(city), api.weather.getForecast(city)
            ]);
            document.getElementById('w-city').innerText = city.toUpperCase();
            document.getElementById('w-temp').innerText = Math.round(current.temperature);
            document.getElementById('w-cond').innerText = current.condition_text;
            document.getElementById('w-wind').innerText = current.wind_speed;
            document.getElementById('w-hum').innerText = current.humidity;
            document.getElementById('w-pres').innerText = current.pressure;
            document.getElementById('w-uv').innerText = current.uv_index;
            document.getElementById('w-solar').innerText = current.solar_efficiency_pct;
            document.getElementById('w-updated').innerText = 'Updated: ' + current.cached_at;

            setTimeout(() => {
                document.getElementById('rain-bar').style.width = current.rain_probability + '%';
                document.getElementById('rain-pct').innerText = current.rain_probability;
            }, 200);

            // Forecast cards
            const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
            const strip = document.getElementById('forecast-strip');
            if (strip && forecast.length > 0) {
                strip.innerHTML = forecast.map((f, i) => {
                    const d = new Date(f.forecast_date);
                    const icon = f.rain_probability > 60 ? '🌧️' : f.rain_probability > 30 ? '⛅' : '☀️';
                    return `<div class="forecast-card ${i===0?'today':''}">
                        <div class="forecast-day">${days[d.getDay()]}</div>
                        <div class="forecast-icon">${icon}</div>
                        <div class="forecast-hi">${Math.round(f.temp_high)}°</div>
                        <div class="forecast-lo">${Math.round(f.temp_low)}°</div>
                        <div class="forecast-rain">💧${f.rain_probability}%</div>
                    </div>`;
                }).join('');
            }

            // Weekly chart
            if (forecast.length > 0) {
                const ctx = document.getElementById('weather-chart');
                if (ctx && chartManager) {
                    if (chartManager.instances['weather-chart']) chartManager.instances['weather-chart'].destroy();
                    chartManager.instances['weather-chart'] = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: forecast.map(f => f.forecast_date.slice(5)),
                            datasets: [{
                                label: 'High °C', data: forecast.map(f => f.temp_high),
                                backgroundColor: 'rgba(0,243,255,0.6)', borderColor: '#00f3ff', borderWidth: 1, borderRadius: 4
                            }, {
                                label: 'Solar %', data: forecast.map(f => f.solar_efficiency_pct),
                                type: 'line', borderColor: '#ffe66d', backgroundColor: 'transparent',
                                borderWidth: 2, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#ffe66d', yAxisID: 'y1'
                            }]
                        },
                        options: { responsive: true, maintainAspectRatio: false, scales: {
                            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8c9baf' } },
                            y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#8c9baf' } },
                            x: { grid: { display: false }, ticks: { color: '#8c9baf' } }
                        }, plugins: { legend: { labels: { color: '#c0cad8', font: { family: "'Jost'" } } } } }
                    });
                }
            }

            // City selector
            const sel = document.getElementById('weather-city');
            if (sel) { sel.value = city; sel.onchange = (e) => this.loadWeather(e.target.value); }
        } catch (e) { console.error(e); }
    },

    // ===== USER MANAGEMENT =====
    _usersData: [],
    async loadUsers() {
        if (this.user.role !== 'admin') { this.navigate('dashboard'); return; }
        try {
            const res = await api.userManagement.list();
            this._usersData = res.users;
            document.getElementById('um-total').innerText = res.stats.total;
            document.getElementById('um-active').innerText = res.stats.active;
            document.getElementById('um-admins').innerText = res.stats.admins;
            this.renderUserTable(res.users);

            // Search
            document.getElementById('um-search').oninput = (e) => {
                const q = e.target.value.toLowerCase();
                this.renderUserTable(this._usersData.filter(u => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
            };

            // Activity logs
            const logs = await api.userManagement.getLogs();
            document.getElementById('um-log-body').innerHTML = logs.length === 0
                ? '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">NO EVENTS</td></tr>'
                : logs.map(l => `<tr><td><strong>${l.username}</strong></td><td class="log-action">${l.action}</td><td>${new Date(l.logged_at).toLocaleString()}</td><td>${l.ip_address}</td></tr>`).join('');
        } catch (e) { console.error(e); }
    },

    renderUserTable(users) {
        const roleClass = r => r === 'admin' ? 'role-admin' : r === 'operator' ? 'role-operator' : r === 'analyst' ? 'role-analyst' : 'role-user';
        const statusClass = s => s === 'active' ? 'status-active' : s === 'suspended' ? 'status-suspended' : 'status-offline';
        document.getElementById('um-table-body').innerHTML = users.length === 0
            ? '<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">NO USERS FOUND</td></tr>'
            : users.map(u => `<tr>
                <td><strong style="font-family:var(--font-heading)">${u.username}</strong><br><span style="font-size:12px;color:var(--text-muted)">${u.email}</span></td>
                <td><span class="role-badge ${roleClass(u.role)}">${(u.role||'user').toUpperCase()}</span></td>
                <td><span class="status-dot ${statusClass(u.status||'active')}"></span>${(u.status||'active').toUpperCase()}</td>
                <td>${u.last_login ? new Date(u.last_login).toLocaleString() : 'NEVER'}</td>
                <td><button class="um-btn um-btn-edit" onclick="app.showUserModal(${u.id})">EDIT</button> <button class="um-btn um-btn-del" onclick="app.deleteUser(${u.id})">DEL</button></td>
            </tr>`).join('');
    },

    showUserModal(editId = null) {
        const user = editId ? this._usersData.find(u => u.id === editId) : null;
        const title = user ? 'EDIT OPERATOR' : 'NEW OPERATOR';
        const overlay = document.createElement('div');
        overlay.className = 'nexus-modal-overlay';
        overlay.id = 'user-modal';
        overlay.innerHTML = `<div class="nexus-modal">
            <button class="modal-close" onclick="document.getElementById('user-modal').remove()">&times;</button>
            <div class="modal-title">${title}</div>
            <form id="user-modal-form">
                <div class="form-group"><label class="form-label">USERNAME</label><input type="text" id="um-f-user" class="form-input" value="${user?user.username:''}" ${user?'readonly':''} required></div>
                <div class="form-group"><label class="form-label">EMAIL</label><input type="email" id="um-f-email" class="form-input" value="${user?user.email:''}" required></div>
                <div class="form-group"><label class="form-label">ROLE</label><select id="um-f-role" class="form-input"><option value="user" ${user?.role==='user'?'selected':''}>USER</option><option value="operator" ${user?.role==='operator'?'selected':''}>OPERATOR</option><option value="analyst" ${user?.role==='analyst'?'selected':''}>ANALYST</option><option value="admin" ${user?.role==='admin'?'selected':''}>ADMIN</option></select></div>
                <div class="form-group"><label class="form-label">PASSWORD ${user?'(leave blank to keep)':''}</label><input type="password" id="um-f-pass" class="form-input" ${user?'':'required'}></div>
                <div class="modal-actions"><button type="submit" class="btn btn-primary btn-block">${user?'UPDATE':'CREATE'}</button></div>
            </form>
        </div>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        document.getElementById('user-modal-form').onsubmit = async (e) => {
            e.preventDefault();
            const data = { username: document.getElementById('um-f-user').value, email: document.getElementById('um-f-email').value, role: document.getElementById('um-f-role').value, password: document.getElementById('um-f-pass').value };
            try {
                if (user) { data.id = user.id; await api.userManagement.update(data); }
                else { await api.userManagement.create(data); }
                overlay.remove();
                this.loadUsers();
            } catch (err) { alert('Error: ' + err.message); }
        };
    },

    async deleteUser(id) {
        if (!confirm('Confirm deletion of this operator?')) return;
        try { await api.userManagement.remove(id); this.loadUsers(); }
        catch (err) { alert('Error: ' + err.message); }
    },

    // ===== REPORTS =====
    loadReports() { /* Static page, nothing to load */ },

    async generateReport() {
        const btn = document.getElementById('generate-report-btn');
        const status = document.getElementById('report-status');
        btn.disabled = true; btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> COLLECTING DATA...';

        // Sanitize text for jsPDF (remove non-ASCII)
        const safe = (str) => String(str ?? '').replace(/[^\x20-\x7E]/g, '');

        try {
            status.innerText = 'Fetching all module data...';

            // Fetch all data in parallel with fallbacks
            const [dashboard, solar, wind, climateSummary, climateRegions, weather, forecast] = await Promise.all([
                api.dashboard.getSummary().catch(() => ({})),
                api.predictions.getSolar().catch(() => []),
                api.predictions.getWind().catch(() => []),
                api.climate.getSummary().catch(() => ({ totals: {} })),
                api.climate.getRegions().catch(() => []),
                api.weather.getCurrent('Mumbai').catch(() => ({})),
                api.weather.getForecast('Mumbai').catch(() => [])
            ]);

            status.innerText = 'Building PDF...';
            if (!window.jspdf) throw new Error('PDF library not loaded. Hard-refresh (Cmd+Shift+R) and try again.');
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            const pw = doc.internal.pageSize.getWidth();
            const ph = doc.internal.pageSize.getHeight();
            let y = 20;

            const checkPage = (need) => { if (y + need > ph - 15) { doc.addPage(); y = 20; } };

            const addSection = (title) => {
                checkPage(20);
                doc.setFillColor(10, 15, 25);
                doc.rect(0, y - 4, pw, 12, 'F');
                doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
                doc.setTextColor(0, 243, 255);
                doc.text(safe(title), 14, y + 4);
                y += 16;
                doc.setTextColor(200, 210, 220);
                doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
            };

            const addLine = (text) => { checkPage(8); doc.text(safe(text), 14, y); y += 6; };

            // === HEADER ===
            doc.setFillColor(5, 8, 14);
            doc.rect(0, 0, pw, 38, 'F');
            doc.setFontSize(20); doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 243, 255);
            doc.text('NEXUS COMBINED REPORT', pw / 2, 16, { align: 'center' });
            doc.setFontSize(10); doc.setFont('helvetica', 'normal');
            doc.setTextColor(150, 160, 180);
            doc.text(safe('Generated: ' + new Date().toLocaleString() + '  |  Operator: ' + this.user.username + ' (' + this.user.role + ')'), pw / 2, 26, { align: 'center' });
            doc.setDrawColor(0, 243, 255); doc.setLineWidth(0.5);
            doc.line(14, 34, pw - 14, 34);
            y = 46;

            // === 1. DASHBOARD ===
            addSection('1. DASHBOARD SUMMARY');
            addLine('Solar Arrays Active: ' + (dashboard.solar_count || 'N/A'));
            addLine('Wind Sectors Active: ' + (dashboard.wind_count || 'N/A'));
            addLine('Weather Data Points: ' + (dashboard.weather_count || 'N/A'));
            y += 4;

            // === 2. SOLAR ===
            addSection('2. SOLAR PREDICTIONS');
            if (solar && solar.length > 0) {
                doc.autoTable({
                    startY: y, margin: { left: 14, right: 14 },
                    head: [['Location', 'Date', 'Radiation (W/m2)', 'Predicted (kWh)', 'Actual (kWh)', 'Efficiency', 'Confidence']],
                    body: solar.slice(0, 25).map(s => [
                        safe(s.location), safe(s.prediction_date),
                        safe(s.predicted_radiation), safe(s.predicted_energy_kwh),
                        safe(s.actual_energy_kwh), safe(s.panel_efficiency + '%'),
                        safe(s.confidence + '%')
                    ]),
                    styles: { fontSize: 7, textColor: [200, 210, 220], fillColor: [15, 20, 30], lineColor: [40, 50, 60], lineWidth: 0.3 },
                    headStyles: { fillColor: [0, 60, 80], textColor: [0, 243, 255], fontStyle: 'bold' },
                    alternateRowStyles: { fillColor: [10, 15, 25] }
                });
                y = doc.lastAutoTable.finalY + 8;
            } else { addLine('No solar data available.'); }

            // === 3. WIND ===
            addSection('3. WIND PREDICTIONS');
            if (wind && wind.length > 0) {
                doc.autoTable({
                    startY: y, margin: { left: 14, right: 14 },
                    head: [['Location', 'Date', 'Wind (m/s)', 'Predicted (kWh)', 'Actual (kWh)', 'Turbine (kW)', 'Confidence']],
                    body: wind.slice(0, 25).map(w => [
                        safe(w.location), safe(w.prediction_date),
                        safe(w.predicted_wind_speed), safe(w.predicted_energy_kwh),
                        safe(w.actual_energy_kwh), safe(w.turbine_capacity),
                        safe(w.confidence + '%')
                    ]),
                    styles: { fontSize: 7, textColor: [200, 210, 220], fillColor: [15, 20, 30], lineColor: [40, 50, 60], lineWidth: 0.3 },
                    headStyles: { fillColor: [0, 60, 30], textColor: [0, 255, 102], fontStyle: 'bold' },
                    alternateRowStyles: { fillColor: [10, 15, 25] }
                });
                y = doc.lastAutoTable.finalY + 8;
            } else { addLine('No wind data available.'); }

            // === 4. CLIMATE ===
            addSection('4. CLIMATE ANALYTICS');
            const ct = climateSummary.totals || {};
            addLine('Total CO2 Saved: ' + (ct.total_co2_saved || 0) + ' tonnes');
            addLine('Avg Green Energy: ' + (ct.avg_green_energy || 0) + '%');
            addLine('Avg AQI: ' + (ct.avg_aqi || 0));
            addLine('Sustainability Score: ' + (ct.avg_sustainability || 0) + '/100');
            y += 2;

            if (climateRegions && climateRegions.length > 0) {
                checkPage(40);
                doc.autoTable({
                    startY: y, margin: { left: 14, right: 14 },
                    head: [['Region', 'CO2 Saved (T)', 'Green %', 'AQI', 'Score']],
                    body: climateRegions.map(r => [
                        safe(r.region), safe(r.co2_saved_tonnes),
                        safe(r.green_energy_pct + '%'), safe(r.aqi),
                        safe(r.sustainability_score + '/100')
                    ]),
                    styles: { fontSize: 8, textColor: [200, 210, 220], fillColor: [15, 20, 30], lineColor: [40, 50, 60], lineWidth: 0.3 },
                    headStyles: { fillColor: [0, 50, 70], textColor: [0, 243, 255], fontStyle: 'bold' },
                    alternateRowStyles: { fillColor: [10, 15, 25] }
                });
                y = doc.lastAutoTable.finalY + 8;
            }

            // === 5. WEATHER ===
            addSection('5. LIVE WEATHER - MUMBAI');
            addLine('Temperature: ' + (weather.temperature || 'N/A') + ' C');
            addLine('Condition: ' + (weather.condition_text || 'N/A'));
            addLine('Humidity: ' + (weather.humidity || 'N/A') + '% | Pressure: ' + (weather.pressure || 'N/A') + ' hPa');
            addLine('Wind: ' + (weather.wind_speed || 'N/A') + ' m/s | UV: ' + (weather.uv_index || 'N/A'));
            addLine('Rain Probability: ' + (weather.rain_probability || 'N/A') + '% | Solar Efficiency: ' + (weather.solar_efficiency_pct || 'N/A') + '%');
            y += 2;

            if (forecast && forecast.length > 0) {
                checkPage(40);
                doc.autoTable({
                    startY: y, margin: { left: 14, right: 14 },
                    head: [['Date', 'High C', 'Low C', 'Condition', 'Rain %', 'Solar %']],
                    body: forecast.map(f => [
                        safe(f.forecast_date), safe(f.temp_high), safe(f.temp_low),
                        safe(f.condition_text), safe(f.rain_probability + '%'),
                        safe(f.solar_efficiency_pct + '%')
                    ]),
                    styles: { fontSize: 8, textColor: [200, 210, 220], fillColor: [15, 20, 30], lineColor: [40, 50, 60], lineWidth: 0.3 },
                    headStyles: { fillColor: [0, 50, 70], textColor: [0, 243, 255], fontStyle: 'bold' },
                    alternateRowStyles: { fillColor: [10, 15, 25] }
                });
            }

            // === FOOTER on every page ===
            const pages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pages; i++) {
                doc.setPage(i);
                doc.setFontSize(8); doc.setTextColor(80, 90, 110);
                doc.text('NEXUS Central Command  |  Page ' + i + ' of ' + pages, pw / 2, ph - 8, { align: 'center' });
            }

            var filename = 'NEXUS_Report_' + new Date().toISOString().slice(0, 10) + '.pdf';
            doc.save(filename);
            status.innerHTML = '<span style="color:#00ff66">REPORT DOWNLOADED SUCCESSFULLY</span>';
        } catch (err) {
            console.error(err);
            status.innerHTML = '<span style="color:#ff003c">ERROR: ' + err.message + '</span>';
        }
        btn.disabled = false; btn.innerHTML = '<i class="bx bx-download"></i> GENERATE & DOWNLOAD PDF';
    },

    // ===== HELPERS =====
    animateCount(elId, target) {
        const el = document.getElementById(elId);
        if (!el) return;
        let current = 0; const step = target / 40;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.innerText = Math.round(current).toLocaleString();
        }, 30);
    },

    animateRing(ringId, pctId, pct, circ) {
        setTimeout(() => {
            const ring = document.getElementById(ringId);
            const label = document.getElementById(pctId);
            if (ring) ring.style.strokeDashoffset = circ - (circ * Math.min(pct, 100) / 100);
            if (label) label.innerText = Math.round(pct) + '%';
        }, 400);
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
