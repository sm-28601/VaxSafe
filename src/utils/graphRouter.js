export function findOptimalRoute(startNodeId, endNodeId, nodes, routes) {
  const graph = buildGraph(nodes, routes);
  const distances = { [startNodeId]: 0 };
  const previous = {};
  const unvisited = new Set(nodes.map(n => n.id)); // ✅ fixed

  nodes.forEach(n => {
    if (n.id !== startNodeId) distances[n.id] = Infinity; // ✅ fixed
  });

  while (unvisited.size) {
    let current = null;
    for (let node of unvisited) {
      if (distances[node] !== undefined && (current === null || distances[node] < distances[current])) {
        current = node;
      }
    }

    if (current === endNodeId) break;
    if (!current || distances[current] === Infinity) break;

    unvisited.delete(current);

    for (let neighbor of graph[current] || []) {
      const targetNode = nodes.find(n => n.id === neighbor.id); // ✅ fixed
      const isCritical = targetNode?.status === 'critical';
      const riskPenalty = targetNode?.reliability ? (1 - targetNode.reliability) : 0.5;
      const edgeWeight = neighbor.distance * (isCritical ? 100 : (1 + riskPenalty));
      const alt = distances[current] + edgeWeight;

      if (alt < (distances[neighbor.id] || Infinity)) { // ✅ fixed
        distances[neighbor.id] = alt;   // ✅ fixed
        previous[neighbor.id] = current; // ✅ fixed
      }
    }
  }

  const path = [];
  let step = endNodeId;
  while (step) {
    path.unshift(step);
    step = previous[step];
  }

  if (path.length === 1 && startNodeId !== endNodeId) return [];
  return path;
}

export function buildGraph(nodes, routes) {
  const graph = {};
  routes.forEach(route => {
    if (!route.nodes || route.nodes.length < 2) return;
    const segmentDistance = route.distance / (route.nodes.length - 1);

    for (let i = 0; i < route.nodes.length - 1; i++) {
      const from = route.nodes[i];
      const to = route.nodes[i + 1];

      if (!graph[from]) graph[from] = [];
      if (!graph[from].find(e => e.id === to)) { // ✅ fixed
        graph[from].push({ id: to, distance: segmentDistance });
      }

      if (!graph[to]) graph[to] = [];
      if (!graph[to].find(e => e.id === from)) { // ✅ fixed
        graph[to].push({ id: from, distance: segmentDistance });
      }
    }
  });
  return graph;
}
