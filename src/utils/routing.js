export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

export function buildGraph(corridors) {
    const graph = {}; // uniqueId -> { stop, edges: [{ to, weight, type, corridorId }] }
    const stopsByName = {}; // name -> [uniqueId]

    corridors.forEach(corridor => {
        const stops = corridor.stops;
        for (let i = 0; i < stops.length; i++) {
            const stop = stops[i];
            const uniqueId = `${stop.name}-${stop.lat}-${stop.lng}`;
            
            if (!graph[uniqueId]) {
                graph[uniqueId] = { stop: { ...stop, uniqueId }, edges: [] };
            }
            if (!stopsByName[stop.name]) {
                stopsByName[stop.name] = [];
            }
            if (!stopsByName[stop.name].includes(uniqueId)) {
                stopsByName[stop.name].push(uniqueId);
            }

            // Ride edges
            if (i > 0) {
                const prev = stops[i - 1];
                const prevId = `${prev.name}-${prev.lat}-${prev.lng}`;
                const dist = calculateDistance(prev.lat, prev.lng, stop.lat, stop.lng);
                
                // Add two-way ride edges
                graph[uniqueId].edges.push({ to: prevId, weight: dist, type: 'ride', corridorId: corridor.id, corridorName: corridor.name });
                if (!graph[prevId]) {
                    graph[prevId] = { stop: { ...prev, uniqueId: prevId }, edges: [] };
                }
                graph[prevId].edges.push({ to: uniqueId, weight: dist, type: 'ride', corridorId: corridor.id, corridorName: corridor.name });
            }
        }
    });

    // Transfer edges (between stops with the exact same name OR within 400 meters)
    const allIds = Object.keys(graph);
    for (let i = 0; i < allIds.length; i++) {
        for (let j = i + 1; j < allIds.length; j++) {
            const id1 = allIds[i];
            const id2 = allIds[j];
            const stop1 = graph[id1].stop;
            const stop2 = graph[id2].stop;
            
            const isSameName = stop1.name === stop2.name;
            const dist = calculateDistance(stop1.lat, stop1.lng, stop2.lat, stop2.lng);
            
            if (isSameName || dist <= 0.4) {
                // Add two-way transfer edge
                graph[id1].edges.push({
                    to: id2,
                    weight: 1.0, // Transfer penalty (equivalent to 1 km)
                    type: 'transfer',
                    corridorId: null
                });
                graph[id2].edges.push({
                    to: id1,
                    weight: 1.0,
                    type: 'transfer',
                    corridorId: null
                });
            }
        }
    }

    return graph;
}

class PriorityQueue {
    constructor() { this.values = []; }
    enqueue(val, priority) {
        this.values.push({ val, priority });
        this.sort();
    }
    dequeue() { return this.values.shift(); }
    sort() { this.values.sort((a, b) => a.priority - b.priority); }
    isEmpty() { return this.values.length === 0; }
}

export function findRoute(corridors, startId, endId) {
    const graph = buildGraph(corridors);
    if (!graph[startId] || !graph[endId]) return null;

    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();

    for (let node in graph) {
        if (node === startId) {
            distances[node] = 0;
            pq.enqueue(node, 0);
        } else {
            distances[node] = Infinity;
            pq.enqueue(node, Infinity);
        }
        previous[node] = null;
    }

    while (!pq.isEmpty()) {
        const smallest = pq.dequeue().val;
        
        if (smallest === endId) {
            // Reconstruct path
            const path = [];
            let current = smallest;
            let totalRideDistance = 0;
            
            while (current) {
                let edgeDetail = null;
                if (previous[current]) {
                    const prevEdges = graph[previous[current]].edges;
                    edgeDetail = prevEdges.find(e => e.to === current);
                    if (edgeDetail && edgeDetail.type === 'ride') {
                        totalRideDistance += edgeDetail.weight;
                    }
                }
                
                path.unshift({
                    stop: graph[current].stop,
                    edgeFromPrev: edgeDetail
                });
                current = previous[current];
            }
            return { path, totalDistance: totalRideDistance }; // Return real riding distance without penalty
        }

        if (smallest || distances[smallest] !== Infinity) {
            for (let neighbor of graph[smallest].edges) {
                let candidate = distances[smallest] + neighbor.weight;
                if (candidate < distances[neighbor.to]) {
                    distances[neighbor.to] = candidate;
                    previous[neighbor.to] = smallest;
                    pq.enqueue(neighbor.to, candidate);
                }
            }
        }
    }
    return null;
}

export function processRouteInstructions(routeData) {
    if (!routeData || !routeData.path.length) return [];
    
    const instructions = [];
    const path = routeData.path;
    
    let currentCorridor = null;
    let currentSegment = null;

    for (let i = 1; i < path.length; i++) {
        const step = path[i];
        const edge = step.edgeFromPrev;
        
        if (edge.type === 'ride') {
            if (currentCorridor !== edge.corridorId) {
                if (currentSegment) {
                    instructions.push(currentSegment);
                }
                currentCorridor = edge.corridorId;
                currentSegment = {
                    type: 'ride',
                    corridorId: edge.corridorId,
                    corridorName: edge.corridorName,
                    fromStop: path[i-1].stop,
                    toStop: step.stop,
                    stops: [path[i-1].stop, step.stop],
                    distance: edge.weight
                };
            } else {
                currentSegment.toStop = step.stop;
                currentSegment.stops.push(step.stop);
                currentSegment.distance += edge.weight;
            }
        } else if (edge.type === 'transfer') {
            if (currentSegment) {
                instructions.push(currentSegment);
                currentSegment = null;
            }
            currentCorridor = null;
            instructions.push({
                type: 'transfer',
                stop: step.stop
            });
        }
    }
    if (currentSegment) {
        instructions.push(currentSegment);
    }

    return instructions;
}

export function extractPathGeometry(corridors, instructions) {
    let fullGeometry = [];
    
    instructions.forEach(inst => {
        if (inst.type === 'ride') {
            const corridor = corridors.find(c => c.id === inst.corridorId);
            if (corridor) {
                const getClosestIndex = (path, lat, lng) => {
                    let minD = Infinity;
                    let minI = -1;
                    path.forEach((p, i) => {
                        const d = Math.pow(p[0]-lat, 2) + Math.pow(p[1]-lng, 2);
                        if(d < minD) { minD=d; minI=i; }
                    });
                    return minI;
                };
                
                const startIdx = getClosestIndex(corridor.path, inst.fromStop.lat, inst.fromStop.lng);
                const endIdx = getClosestIndex(corridor.path, inst.toStop.lat, inst.toStop.lng);
                
                if (startIdx !== -1 && endIdx !== -1) {
                    const min = Math.min(startIdx, endIdx);
                    const max = Math.max(startIdx, endIdx);
                    // Add the sliced segment
                    let segment = corridor.path.slice(min, max + 1);
                    if (startIdx > endIdx) {
                        segment.reverse();
                    }
                    fullGeometry = fullGeometry.concat(segment);
                } else {
                    // Fallback to straight lines between all stops in the segment if path extraction fails
                    inst.stops.forEach(s => fullGeometry.push([s.lat, s.lng]));
                }
            }
        }
    });
    
    return fullGeometry;
}
