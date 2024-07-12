/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
// import { data as jsonData } from './sourceActiveDirLog';
// import { data as jsonData } from './sourceCheckPointLog';
// import { data as jsonData } from './sourceWinLog';
import { data as jsonData } from './graph-data/sourceWinLog2';
//import { data as jsonData } from './sourceIocTtp';
import { cCircleComboShape, circleNodeShape, fundPolyline, customQuadratic,} from "./parts/elements";
import { getUTCHrMinSec } from "./utilities/convertUTC";
import { populateNodesEdges } from "./parts/graphDataConfig";

let log = console.log; 
let nodeA = "";
let nodeB = "";
let nodeDrag = false;
let comboDrop = false;
let dragCombo;
let dragleaveCombo;
let draggedOverCombos = [];
let comboDraggedOver; 

const templateG5 = () => {
    const ref = React.useRef(null)
    const [graph, setGraph] = useState(null);


    useEffect(() => {
      const G6 = require('@antv/g6');


      setGraph(graph);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    
      return <div ref={ref}></div>
    }
    

       
  export default templateG5


  

