// Cold chain network nodes — inspired by East African vaccine distribution
export const nodes = [
  { id: 'N01', name: 'Nairobi Central Depot', type: 'national', lat: -1.2921, lng: 36.8219, capacity: 50000, equipment: 'Walk-in Cold Room', reliability: 0.96, tempRange: [2, 8], currentTemp: 4.2, status: 'operational' },
  { id: 'N02', name: 'Mombasa Regional Hub', type: 'regional', lat: -4.0435, lng: 39.6682, capacity: 25000, equipment: 'Solar Direct Drive', reliability: 0.91, tempRange: [2, 8], currentTemp: 5.1, status: 'operational' },
  { id: 'N03', name: 'Kisumu District Store', type: 'district', lat: -0.0917, lng: 34.7680, capacity: 12000, equipment: 'Ice-Lined Refrigerator', reliability: 0.87, tempRange: [2, 8], currentTemp: 6.3, status: 'warning' },
  { id: 'N04', name: 'Nakuru Transit Point', type: 'transit', lat: -0.3031, lng: 36.0800, capacity: 8000, equipment: 'Vaccine Carrier', reliability: 0.93, tempRange: [2, 8], currentTemp: 3.8, status: 'operational' },
  { id: 'N05', name: 'Eldoret Regional Hub', type: 'regional', lat: 0.5143, lng: 35.2698, capacity: 18000, equipment: 'Walk-in Cold Room', reliability: 0.89, tempRange: [2, 8], currentTemp: 4.9, status: 'operational' },
  { id: 'N06', name: 'Garissa Health Center', type: 'facility', lat: -0.4532, lng: 39.6461, capacity: 3000, equipment: 'Solar Direct Drive', reliability: 0.78, tempRange: [2, 8], currentTemp: 7.1, status: 'warning' },
  { id: 'N07', name: 'Nyeri District Store', type: 'district', lat: -0.4197, lng: 36.9511, capacity: 10000, equipment: 'Ice-Lined Refrigerator', reliability: 0.92, tempRange: [2, 8], currentTemp: 4.5, status: 'operational' },
  { id: 'N08', name: 'Malindi Clinic', type: 'facility', lat: -3.2138, lng: 40.1169, capacity: 2000, equipment: 'Vaccine Carrier', reliability: 0.82, tempRange: [2, 8], currentTemp: 5.8, status: 'operational' },
  { id: 'N09', name: 'Thika Sub-County', type: 'district', lat: -1.0396, lng: 37.0900, capacity: 9000, equipment: 'Solar Direct Drive', reliability: 0.94, tempRange: [2, 8], currentTemp: 4.1, status: 'operational' },
  { id: 'N10', name: 'Machakos Transit', type: 'transit', lat: -1.5177, lng: 37.2634, capacity: 5000, equipment: 'Vaccine Carrier', reliability: 0.88, tempRange: [2, 8], currentTemp: 5.5, status: 'operational' },
  { id: 'N11', name: 'Lamu Outpost', type: 'facility', lat: -2.2717, lng: 40.9020, capacity: 1500, equipment: 'Solar Direct Drive', reliability: 0.72, tempRange: [2, 8], currentTemp: 7.8, status: 'critical' },
  { id: 'N12', name: 'Kakamega District', type: 'district', lat: 0.2827, lng: 34.7519, capacity: 11000, equipment: 'Walk-in Cold Room', reliability: 0.90, tempRange: [2, 8], currentTemp: 4.3, status: 'operational' },
  { id: 'N13', name: 'Kitale Health Center', type: 'facility', lat: 1.0187, lng: 35.0020, capacity: 4000, equipment: 'Ice-Lined Refrigerator', reliability: 0.85, tempRange: [2, 8], currentTemp: 5.2, status: 'operational' },
  { id: 'N14', name: 'Naivasha Transit', type: 'transit', lat: -0.7172, lng: 36.4310, capacity: 6000, equipment: 'Vaccine Carrier', reliability: 0.91, tempRange: [2, 8], currentTemp: 4.7, status: 'operational' },
  { id: 'N15', name: 'Voi Relay Station', type: 'transit', lat: -3.3964, lng: 38.5561, capacity: 4500, equipment: 'Solar Direct Drive', reliability: 0.83, tempRange: [2, 8], currentTemp: 6.0, status: 'operational' },
  { id: 'N16', name: 'Nanyuki Forward Base', type: 'district', lat: 0.0069, lng: 37.0722, capacity: 7500, equipment: 'Ice-Lined Refrigerator', reliability: 0.86, tempRange: [2, 8], currentTemp: 5.4, status: 'operational' },
  { id: 'N17', name: 'Isiolo Clinic', type: 'facility', lat: 0.3546, lng: 37.5822, capacity: 2500, equipment: 'Solar Direct Drive', reliability: 0.74, tempRange: [2, 8], currentTemp: 7.3, status: 'warning' },
  { id: 'N18', name: 'Embu District Store', type: 'district', lat: -0.5388, lng: 37.4596, capacity: 8500, equipment: 'Walk-in Cold Room', reliability: 0.93, tempRange: [2, 8], currentTemp: 4.0, status: 'operational' },
  { id: 'N19', name: 'Kericho Transit', type: 'transit', lat: -0.3692, lng: 35.2863, capacity: 5500, equipment: 'Vaccine Carrier', reliability: 0.89, tempRange: [2, 8], currentTemp: 4.6, status: 'operational' },
  { id: 'N20', name: 'Migori Health Facility', type: 'facility', lat: -1.0634, lng: 34.4731, capacity: 3500, equipment: 'Solar Direct Drive', reliability: 0.80, tempRange: [2, 8], currentTemp: 6.5, status: 'operational' },
  { id: 'N21', name: 'Narok Sub-County', type: 'district', lat: -1.0876, lng: 35.8600, capacity: 7000, equipment: 'Ice-Lined Refrigerator', reliability: 0.84, tempRange: [2, 8], currentTemp: 5.9, status: 'operational' },
  { id: 'N22', name: 'Wajir Outpost', type: 'facility', lat: 1.7471, lng: 40.0573, capacity: 1800, equipment: 'Solar Direct Drive', reliability: 0.69, tempRange: [2, 8], currentTemp: 8.2, status: 'critical' },
  { id: 'N23', name: 'Kilifi District', type: 'district', lat: -3.6305, lng: 39.8499, capacity: 9500, equipment: 'Walk-in Cold Room', reliability: 0.88, tempRange: [2, 8], currentTemp: 5.0, status: 'operational' },
  { id: 'N24', name: 'Bungoma Health Center', type: 'facility', lat: 0.5636, lng: 34.5608, capacity: 3200, equipment: 'Ice-Lined Refrigerator', reliability: 0.81, tempRange: [2, 8], currentTemp: 6.1, status: 'operational' },
  { id: 'N25', name: 'Meru Regional Hub', type: 'regional', lat: 0.0480, lng: 37.6559, capacity: 15000, equipment: 'Walk-in Cold Room', reliability: 0.90, tempRange: [2, 8], currentTemp: 4.4, status: 'operational' },
];

export const nodeTypes = {
  national: { color: '#6366f1', label: 'National Depot', icon: '🏛️' },
  regional: { color: '#8b5cf6', label: 'Regional Hub', icon: '🏢' },
  district: { color: '#06b6d4', label: 'District Store', icon: '🏬' },
  transit: { color: '#f59e0b', label: 'Transit Point', icon: '🚛' },
  facility: { color: '#10b981', label: 'Health Facility', icon: '🏥' },
};

export const getNodeById = (id) => nodes.find(n => n.id === id);
