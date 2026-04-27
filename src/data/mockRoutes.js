// Pilot route network connecting cold chain nodes
export const routes = [
  {
    id: 'R01', name: 'Nairobi → Mombasa Coastal',
    nodes: ['N01', 'N10', 'N15', 'N02', 'N08'],
    distance: 485, estTime: 540, riskScore: 0.32,
    waypoints: [[-1.29, 36.82], [-1.52, 37.26], [-3.40, 38.56], [-4.04, 39.67], [-3.21, 40.12]],
    optimized: true, vaccines: 12000, status: 'active',
  },
  {
    id: 'R02', name: 'Nairobi → Kisumu Western',
    nodes: ['N01', 'N04', 'N14', 'N19', 'N03'],
    distance: 348, estTime: 420, riskScore: 0.28,
    waypoints: [[-1.29, 36.82], [-0.30, 36.08], [-0.72, 36.43], [-0.37, 35.29], [-0.09, 34.77]],
    optimized: true, vaccines: 8500, status: 'active',
  },
  {
    id: 'R03', name: 'Nairobi → Eldoret Northern',
    nodes: ['N01', 'N04', 'N05', 'N13'],
    distance: 312, estTime: 390, riskScore: 0.22,
    waypoints: [[-1.29, 36.82], [-0.30, 36.08], [0.51, 35.27], [1.02, 35.00]],
    optimized: true, vaccines: 9200, status: 'active',
  },
  {
    id: 'R04', name: 'Mombasa → Lamu Coastal Run',
    nodes: ['N02', 'N23', 'N08', 'N11'],
    distance: 335, estTime: 450, riskScore: 0.55,
    waypoints: [[-4.04, 39.67], [-3.63, 39.85], [-3.21, 40.12], [-2.27, 40.90]],
    optimized: false, vaccines: 4200, status: 'at-risk',
  },
  {
    id: 'R05', name: 'Nairobi → Garissa Eastern',
    nodes: ['N01', 'N09', 'N06'],
    distance: 370, estTime: 480, riskScore: 0.61,
    waypoints: [[-1.29, 36.82], [-1.04, 37.09], [-0.45, 39.65]],
    optimized: false, vaccines: 3800, status: 'at-risk',
  },
  {
    id: 'R06', name: 'Eldoret → Kakamega Loop',
    nodes: ['N05', 'N12', 'N24', 'N13'],
    distance: 145, estTime: 180, riskScore: 0.18,
    waypoints: [[0.51, 35.27], [0.28, 34.75], [0.56, 34.56], [1.02, 35.00]],
    optimized: true, vaccines: 6800, status: 'active',
  },
  {
    id: 'R07', name: 'Nairobi → Meru Highland',
    nodes: ['N01', 'N09', 'N07', 'N16', 'N25'],
    distance: 280, estTime: 360, riskScore: 0.25,
    waypoints: [[-1.29, 36.82], [-1.04, 37.09], [-0.42, 36.95], [0.01, 37.07], [0.05, 37.66]],
    optimized: true, vaccines: 7500, status: 'active',
  },
  {
    id: 'R08', name: 'Kisumu → Migori Southern',
    nodes: ['N03', 'N20'],
    distance: 165, estTime: 210, riskScore: 0.35,
    waypoints: [[-0.09, 34.77], [-1.06, 34.47]],
    optimized: true, vaccines: 3200, status: 'active',
  },
  {
    id: 'R09', name: 'Nairobi → Embu Central',
    nodes: ['N01', 'N09', 'N18'],
    distance: 130, estTime: 150, riskScore: 0.15,
    waypoints: [[-1.29, 36.82], [-1.04, 37.09], [-0.54, 37.46]],
    optimized: true, vaccines: 5600, status: 'active',
  },
  {
    id: 'R10', name: 'Garissa → Wajir Remote',
    nodes: ['N06', 'N17', 'N22'],
    distance: 420, estTime: 600, riskScore: 0.78,
    waypoints: [[-0.45, 39.65], [0.35, 37.58], [1.75, 40.06]],
    optimized: false, vaccines: 2100, status: 'critical',
  },
];

export const getRouteById = (id) => routes.find(r => r.id === id);

export const routeStatusColors = {
  active: '#10b981',
  'at-risk': '#f59e0b',
  critical: '#ef4444',
  completed: '#6366f1',
};
