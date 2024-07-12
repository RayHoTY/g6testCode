import React, { useState, useEffect, useRef } from "react";
import { Graph } from '@antv/g6';

export default function WebGLtrial(){
  const ref = useRef();

  // const data = {
  //   nodes: [
  //     { id: 'node1', data: { name: 'Circle1' } },
  //     { id: 'node2', data: { name: 'Circle2' } },
  //   ],
  //   edges: [{ id: 'edge1', source: 'node1', target: 'node2', data: {} }],
  // };
  const numberOfNodes = 601;
  const data = { nodes: [], edges: []};
  for(let i = 0; i < numberOfNodes; i++) {
    const nodeId = `node${i}`;
    data.nodes.push({
      id: nodeId, 
      label: `computer${i}`,
      data:{name: `Circle${i}`}
    });
  }

  for(let j = 0; j < numberOfNodes; j++) {
    const edgeId = `edge${j}`
    data.edges.push({
      id: edgeId,
      source:`node${j}`,
      target: `node${j+1}`,
      ttp: ( j % 2 === 0) ? true : false,
      event: `Event-${j}`,
      frequency: j
    })
  }
 
  
  useEffect(() => {
    if (!ref.current) return;
    

    const graph = new Graph({
      container: ref.current,
      width: ref.current.scrollWidth,
      height: (ref.current.scrollHeight || 900) - 100,
      data,
      renderer:'webgl',
      modes: {
        default: ['drag-node', 'drag-canvas', 'zoom-canvas', ],
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref}></div>;
};