/**
 * Chart.js - Theme-aware wrapper
 * Colors are passed explicitly from app.js for guaranteed visibility
 */

Chart.defaults.font.family = "'Rubik', sans-serif";

const chartManager = {
    instances: {},

    /**
     * Solar line chart
     * @param {string} canvasId
     * @param {string[]} labels
     * @param {number[]} dataActual
     * @param {number[]} dataPredicted
     * @param {string} accentColor  e.g. '#ff003c'
     */
    createSolarChart(canvasId, labels, dataActual, dataPredicted, accentColor = '#ff003c') {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (this.instances[canvasId]) this.instances[canvasId].destroy();

        const canvasCtx = ctx.getContext('2d');
        const grad = canvasCtx.createLinearGradient(0, 0, 0, 350);
        grad.addColorStop(0, accentColor + 'AA');   // 67% opacity
        grad.addColorStop(1, accentColor + '00');   // 0%

        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Predicted (kWh)',
                        data: dataPredicted,
                        borderColor: accentColor,
                        backgroundColor: grad,
                        borderWidth: 3,
                        pointBackgroundColor: accentColor,
                        pointBorderColor: '#0a0d14',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Actual (kWh)',
                        data: dataActual,
                        borderColor: '#ffffff',
                        backgroundColor: 'transparent',
                        borderDash: [6, 4],
                        borderWidth: 2,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#0a0d14',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#c0cad8',
                            usePointStyle: true,
                            padding: 24,
                            font: { family: "'Jost', sans-serif", size: 13, weight: '600' }
                        }
                    },
                    tooltip: {
                        mode: 'index', intersect: false,
                        backgroundColor: '#0d1220',
                        titleColor: accentColor,
                        bodyColor: '#e0e6f0',
                        borderColor: accentColor,
                        borderWidth: 1,
                        padding: 16,
                        titleFont: { family: "'Jost', sans-serif", size: 14, weight: '700' },
                        bodyFont: { family: "'Rubik', sans-serif", size: 13 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.06)' },
                        ticks: { color: '#8c9baf', font: { family: "'Rubik', sans-serif", size: 12 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#8c9baf', font: { family: "'Rubik', sans-serif", size: 12 }, maxTicksLimit: 7 }
                    }
                }
            }
        });
    },

    /**
     * Wind bar + line combo chart
     * @param {string} canvasId
     * @param {string[]} labels
     * @param {number[]} dataSpeed
     * @param {number[]} dataEnergy
     * @param {string} accentColor  e.g. '#00ff66'
     */
    createWindChart(canvasId, labels, dataSpeed, dataEnergy, accentColor = '#00ff66') {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (this.instances[canvasId]) this.instances[canvasId].destroy();

        const canvasCtx = ctx.getContext('2d');
        const gradBar = canvasCtx.createLinearGradient(0, 0, 0, 380);
        gradBar.addColorStop(0, accentColor + 'CC');
        gradBar.addColorStop(1, accentColor + '22');

        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Predicted Energy (kWh)',
                        data: dataEnergy,
                        backgroundColor: gradBar,
                        borderColor: accentColor,
                        borderWidth: 1,
                        borderRadius: 4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Wind Speed (m/s)',
                        data: dataSpeed,
                        type: 'line',
                        borderColor: '#ffffff',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#0a0d14',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#c0cad8',
                            usePointStyle: true,
                            padding: 24,
                            font: { family: "'Jost', sans-serif", size: 13, weight: '600' }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#0d1220',
                        titleColor: accentColor,
                        bodyColor: '#e0e6f0',
                        borderColor: accentColor,
                        borderWidth: 1,
                        padding: 16,
                        titleFont: { family: "'Jost', sans-serif", size: 14, weight: '700' },
                        bodyFont: { family: "'Rubik', sans-serif", size: 13 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.06)' },
                        ticks: { color: '#8c9baf', font: { family: "'Rubik', sans-serif", size: 12 } }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#8c9baf', font: { family: "'Rubik', sans-serif", size: 12 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#8c9baf', font: { family: "'Rubik', sans-serif", size: 12 }, maxTicksLimit: 7 }
                    }
                }
            }
        });
    }
};
