const STATUS_WEIGHTS = [
  { status: "Open", weight: 50 },
  { status: "In Process", weight: 25 },
  { status: "On Watch", weight: 15 },
  { status: "Acknowledged", weight: 10 }
];

function weightedRandom(weights) {
  const total = weights.reduce((sum, w) => sum + w.weight, 0);
  let random = Math.random() * total;

  for (const item of weights) {
    if (random < item.weight) return item.status;
    random -= item.weight;
  }
}

function generateAlerts() {
  const units = ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6"];
  const alerts = [];

  units.forEach(unit => {
    const alertCount = 15 + Math.floor(Math.random() * 10);

    for (let i = 0; i < alertCount; i++) {
      alerts.push({
        id: `${unit}-${i}`,
        unit,
        status: weightedRandom(STATUS_WEIGHTS),
        daysOpen: Math.floor(Math.random() * 200)
      });
    }
  });

  return alerts;
}

function getBarChartData(alerts) {
  const unitsMap = {};

  alerts.forEach(alert => {
    if (!unitsMap[alert.unit]) {
      unitsMap[alert.unit] = {
        unit: alert.unit,
        inProcess: 0,
        unacknowledged: 0,
        onWatch: 0
      };
    }

    if (alert.status === "In Process") unitsMap[alert.unit].inProcess++;
    if (alert.status === "Open") unitsMap[alert.unit].unacknowledged++;
    if (alert.status === "On Watch") unitsMap[alert.unit].onWatch++;
  });

  return Object.values(unitsMap);
}

function getDonutData(alerts) {
  const statusCount = {};

  alerts.forEach(alert => {
    statusCount[alert.status] = (statusCount[alert.status] || 0) + 1;
  });

  return Object.entries(statusCount).map(([status, value]) => ({
    status,
    value
  }));
}

function getSummary(alerts) {
  const openAlerts = alerts.filter(a => a.status === "Open").length;

  const closingRate =
    (alerts.filter(a => a.status === "Acknowledged").length / alerts.length) *
    100;

  const oldest = Math.max(...alerts.map(a => a.daysOpen));

  return {
    openAlerts,
    closingRate: +closingRate.toFixed(1),
    oldestUnacknowledgedDays: oldest,
    progress: Math.min(100, Math.floor(closingRate))
  };
}

function generateRealisticReport(id,title,subtitle) {
  const alerts = generateAlerts();

  return {
    id,
    title: title || `Report ${id}`,
    subtitle: subtitle || "Last 7 Days",
    alerts,
    summary: getSummary(alerts),
    unitAlerts: getBarChartData(alerts),
    alertDistribution: getDonutData(alerts)
  };
}

const reports = Array.from({ length: 50 }, (_, i) =>
  generateRealisticReport(i + 1)
);
export {generateRealisticReport}
export default reports;