import React, { useState, useEffect } from "react";
import { data as jsonData } from './graph-data/sourceOrg';
import {  cCircleComboShape, circleNodeShape, fundPolyline, customQuadratic} from "./parts/elements";
import { getUTCHrMinSec } from "./utilities/convertUTC";
import { populateNodesEdgesOrg } from "./parts/graphDataConfigOrg";

let log = console.log; 
let nodeA = "";
let nodeB = "";
let nodeDrag = false;
let comboDrop = false;
let dragCombo;
let dragleaveCombo;
let draggedOverCombos = [];
let comboDraggedOver; 

const TimeBarTrend
 = () => {
    const ref = React.useRef(null)
    const [newGraph, setGraph] = useState(null);
    const [timeBar, setTimeBar] = useState(null);

    useEffect(() => {
      const G6 = require('@antv/g6');

      //transform rawQuery jsonData into nodeEdgeData
      const nodeEdgeData = populateNodesEdgesOrg(jsonData);
      G6.Util.processParallelEdges(nodeEdgeData.edges, 45, 'quadratic-custom', 'fund-polyline', undefined);

      const container = ref.current;
      const width = container.scrollWidth;
      const height = (container.scrollHeight || 700) - 100;
      const timeBarData = [];

      const range = 18; // number of units that window will show
      const axisMin = jsonData.logsourceTime - (range / 2);
      const axisMax = jsonData.logsourceTime + (range / 2) + 1;
     

      // Scale: Seconds | Cyvestigo 18 seconds window for seconds scale
      // time = 6:59.08 am
      // window: 6:58.59am  - 6:59.17 am (60seconds)
      for (let i = axisMin; i < axisMax; i++) {
        //log(`i = ${i}`);
        timeBarData.push({
          date: i,
          value: Math.round(Math.random() * 200),
        });
        //log(`${i}seconds, timeString=${timeString}`)
      }


      const nodeSize = nodeEdgeData["nodes"][0].size; // originally set in graphDataConfig

      //log(G6.TimeBar);
      const newTimebar = new G6.TimeBar({
        x: 0,
        y: 0,
        width,
        height: 150,
        padding: 20,
        type: 'trend',
        tick: {
          tickLabelFormatter: (d) => {
            // convert the data accordingly
           // log(`d => ${JSON.stringify(d, null, 3)}`);
            // return getUTCHrMinSec(d.date);
            return d;
        },
          tickLabelStyle:{ 
            fontSize: 13, 
            fontFamily: 'Segoe UI',
            fillOpacity: 0.9,
            stroke: '#686868',
            strokeOpacity: 0.3,
          },
          tickLineStyle: {
            width: 30, //<<==== no effect, not working
            height: 15, //<===== no effect, not working 
            //offset: 250, //<===== no effect, not working
            stroke: '#686868',
            lineWidth: 2.5,  
            strokeOpacity: 0.6,
          }
      },
        trend: {
          height: 60,
          data: timeBarData,
          smooth: false,
          lineStyle: {
            stroke: 'transparent', // 'blue',
            lineWidth: 10,
          },
          isArea: true,
          areaStyle:{
            fill: 'lightgrey', // 'pink'
          },
        },
        slider: { 
          backgroundStyle: { // ShapeStyle object format
            fill: 'transparent', 
          },
          foregroundStyle: { // ShapeStyle object format
            fill: 'lightgrey', //'cyan',
            fillOpacity: 0.25,
          }, 
          height: 60,
          start: 0.1,
          end: 0.9,
          handlerStyle:{
            height: 500, // <===== not working
            width: 3, 
            fill:'gray',
            fillOpacity:0.7,
            stroke: 'lightgray',
            strokeOpacity: 0.7,
            /* style:{  //<========== not working
            }, */
          },
        },
        /* textStyle of slider display texts */
        textStyle: { 
          fill: 'black',
          fontFamily: 'Arial',
          fontSize: 0, // <=== turn off displayed text with 0.
        },
        backgroundStyle: {
          fill: 'black'
        },
        controllerCfg:{
          speed: 2, // slider playback speed, default = 1, Max = <10 { tickInterval / ((10 - speed) * 1000 / 60) }
          fontFamily: 'Arial',
          fontSize: 10,
          fill: 'transparent',
          stroke: 'transparent',
          preBtnStyle: {
            fill: '#6C6C6C',
            stroke: '#6C6C6C'
          },
          nextBtnStyle: {
            fill: '#6C6C6C',
            stroke: '#6C6C6C'
          },
          playBtnStyle: {
            stroke: '#6C6C6C'
          },
          speedControllerStyle: {
            pointer: {
              fill: '#6C6C6C',
              fillOpacity:1,
              stroke: '#6C6C6C',
            },
            scroller: {
              fill: '#6C6C6C',
              fillOpacity:0,
              stroke: '#6C6C6C',
            },
            text: {
              fill: '#6C6C6C',
              fillOpacity:0,
              stroke: '#6C6C6C',
            }, 
          },
          /** whether hide the 'time type controller' on the right-bottom */
          hideTimeTypeController: true,
          timeTypeControllerStyle: {
            text:{
              fillOpacity:0.0, 
              stroke: 'purple',
              fontFamily:'Arial',
            },
            box: {
              fillOpacity:0.0,
              stroke: 'gray',
            }
          },
          timePointControllerText:'time point',
          timeRangeControllerText:'time range',
        }
      });

    
      
      // constrained the layout inside the area
      // x: offset dist from left in px ? X-coordinate of the first node?
      // y: offset dist from top in px ? Y-coordinate of the first node?
      const constrainBox = { x: 60, y: 100, width: 800, height: 500 };
      
      const onTick = () => {
        let minx = 99999999;
        let maxx = -99999999;
        let miny = 99999999;
        let maxy = -99999999;
        let maxsize = -9999999; //<---- need to follow up, usage unknown
        nodeEdgeData.nodes.forEach((node) => {
          if (minx > node.x) {
            minx = node.x;
          }
          if (maxx < node.x) {
            maxx = node.x;
          }
          if (miny > node.y) {
            miny = node.y;
          }
          if (maxy < node.y) {
            maxy = node.y;
          }
        });
        const scalex = (constrainBox.width - nodeSize / 2) / (maxx - minx);
        const scaley = (constrainBox.height - nodeSize / 2) / (maxy - miny);
        nodeEdgeData.nodes.forEach((node) => {
          node.x = (node.x - minx) * scalex + constrainBox.x;
          node.y = (node.y - miny) * scaley + constrainBox.y;
        });
      };

      /*  *********** CUSTOM NODE  ***********   */
      G6.registerNode(
        'nCircle', // name that we decide for the custom node model shape type
        circleNodeShape,
        'circle' // built-in node shape to extend from
      );

      /*  *********** CUSTOM COMBO  ***********   */
      
      G6.registerCombo(
        'cCircle', // name that we decide for the custom Combo model
        cCircleComboShape,
        'circle', // built-in combo shape to extend from
      );

      /* ******* CUSTOM EDGES ******* */

      G6.registerEdge(
        'fund-polyline', 
        customQuadratic,
        'line'
      );

      G6.registerEdge(
        'quadratic-custom',
        customQuadratic,
        'quadratic' // built-in edge to extend from
      );

      /* *************************************************** */
      
      //log(G6.Graph);
      const newGraph = new G6.Graph({
        type: 'gforce',
        container: ref.current,
        width: width,
        height: height + 55,
        height: height + 55,
        linkCenter: false,
        plugins: [newTimebar],
        layout: {
          // type: 'grid',  // force, force2 messes with collapseCombo Edges
          //center: [200, 200],
          center: [800, 340], 
          preventOverlap: true,
          nodeSpacing: 5, 
          linkDistance: d => {
            if (d.source.id === 'node0') {
              return 200;
            }
            return 150;
          },
          nodeStrength: 0.5,
          edgeStrength: 0.1,
          collideStrength: 1,
          onTick,
          
        },
        defaultNode: {
          size: nodeSize,
          type: 'nCircle',
          style: {
            position: 'top',
            stroke: '#4fdcff', // color of the node ring
            fill: 'transparent',
            lineWidth: 4,
          },
          labelCfg: {
            position: 'bottom',
            //offset: 6,
            style: {
              fill: '#000000A6',
              fontFamily: 'Arial',
              fontSize: 11,
            }
          },
          icon: {
            /* whether show the icon, false by default */
            show: true,
            /* icon's img address, string type */
            // img: 'https://cdn.pixabay.com/photo/2012/04/13/00/17/question-mark-31190_960_720.png',
            img: 'https://cdn.pixabay.com/photo/2013/07/13/12/09/sign-159285_960_720.png',
            /* icon's size, 20 * 20 by default: */
            width: 30,
            height: 30
          },
        },
        // Set groupByTypes to false to get rendering result with reasonable visual zIndex for combos
        groupByTypes: false,
        defaultCombo: {
          type: 'cCircle', 
          size: 40, // The minimum size of the Combo
          padding: 10,
          style: {
            position:'bottom',
            stroke: 'gray',
            // fill: 'transparent', // commented out. handled at elements.js
            // lineWidth: 1.5, // this is to be commented out. handled at elements.js
          },
          labelCfg: {
            style: {
              position: 'bottom',
              fill: 'transparent',
              fontFamily: 'Arial',
              fontSize: 12
            }
          },
        },

        defaultEdge: { // this will be used for the parallelEdges
          type: 'fund-polyline',
          style: {
            stroke: '#5f6266',
            // lineWidth: 2,
            endArrow: {
              path: G6.Arrow.triangle(6.0, 6.0, 1), // (width, length, offset (wrt d))
              fill: '#5f6466',
              d: 1 // offset
            },
            // startArrow style used for dual edges 
            startArrow: {
              path: G6.Arrow.triangle(0, 0, 17), // (width, length, offset (wrt d))
              fill: 'transparent',
              d: 17 // offset
            },
          },
          labelCfg: {
            autoRotate: false, 
            position: 'left', // top, bottom, left, right, center
            style: {
              fontSize: 12,
              fontWeight: 300,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#000000D9',
              fontFamily: 'Arial',
              fontSize: 11
            }
          },
        },
        modes: {
          default: [
            'drag-node',
            {
              type: 'drag-canvas',
              enableOptimize: false, // enable the optimize to hide the shapes beside nodes' keyShape
            },
            {
              type: 'zoom-canvas',
              enableOptimize: false, // enable the optimize to hide the shapes beside nodes' keyShape
            },
            'drag-combo', 
            {
              type: 'collapse-expand-combo',
              trigger: 'click',
              relayout: false, // do not relayout after collapsing or expanding
            },
          ],
        },
        labelCfg: {
          position: 'bottom',
          offset: 6,
          style: {
            fill: '#000000A6',
            fontFamily: 'Arial',
            fontSize: 50
          }
        },
        nodeStateStyles: {
          hover: {
            stroke: 'orange',
            lineWidth: 4,
          },
          click: {
            stroke: 'orange',
            lineWidth: 5,
            fill: 'white',
          }
        },
        edgeStateStyles: {
          hover: {
            stroke: 'orange',
            lineWidth: 4
          },
          click: {
            stroke: 'orange',
            lineWidth: 5
          }
        },
        comboStateStyles: {
          hover: {
            lineWidth: 8,
            stroke: 'pink',
          },
          dragenter: {
            lineWidth: 6,
            stroke: '#00E100',
          },
          dragleave: {
            lineWidth: 4,
            stroke: '#FF5349',
            lineDash: [6, 18]
          }
        },
      });
      // load graph data
      newGraph.data(nodeEdgeData);

      newGraph.render();


      /* *************** MOUSE EVENTS ************** */

      window.addEventListener("contextmenu", e => e.preventDefault());

      let selectedId = null;

      newGraph.on('node:mouseenter', (e) => {
        newGraph.setItemState(e.item, 'hover', true)
        //turn on node highlight
        newGraph.updateItem(e.item, {
          labelCfg:{
            style:{
              fontFamily: 'Arial',
              fontWeight: 'bold',
              fontSize: 13,
              fill:'white',
              background:{
                fill: 'gray',
                padding: [5, 6, 5, 6], // [top, right, bottom, left]
                stroke: 'black',
                radius: 8,
                lineWidth: 2.5,
              }
            }
          }
        });
        nodeA = e.item._cfg.id;
      })

      newGraph.on('node:mouseleave', (e) => {    
        // newGraph.setItemState(e.item, 'hover', false)
        // turn off node highlight
        if (isSelected(e.item)) highlightSelected(e.item, true)
        else highlightSelected(e.item, false);
      })


      newGraph.on('node:click', (e) => {
        if ( e.item.get('states').includes('click')) {
          // clear node highlight
          highlightSelected(e.item, false);
          // clear selected Id
          selectedId = null;
        }
        else {
          // highlight node!
          /* CODE TO GET AND DISPLAY ALL NODE PROPERTIES! */
          if(e.item.getModel().properties !== undefined) log('node properties =', e.item.getModel().properties);

          highlightSelected(e.item, true);
          if (selectedId !== null) {
            // deactivate highlight on previously selected graph element
            const element = newGraph.findById(selectedId);
            highlightSelected(element, false);
          }
          selectedId = e.item.getID();
        } 
      })

      newGraph.on('node:mouseup', (e) => {
        if (comboDraggedOver !== undefined && e.item.getModel().comboId === undefined) {
          if(dragleaveCombo !== undefined && dragleaveCombo._cfg !== null) {
            // log('draggedover combos on node mouseup', draggedOverCombos)
            // log('node mouseup- dragleaveCombo', dragleaveCombo.getID());

            // // DIAGNOSTIC CONSOLE LOG!
            // const allNodesInDLCombo = getAllNodesInCombo(dragleaveCombo);
            // const nodeDisp = [];
            // allNodesInDLCombo.forEach((node) => nodeDisp.push(node.getID()));
            // log('node:mouse up DLCombo holds:', nodeDisp );


            // for draggin a  node out of nested combo group
            const combosToUpdate = getAllCombosInCombo(dragleaveCombo).concat(dragleaveCombo);
            combosToUpdate.forEach((combo) => {
              const allNodesInCombo = getAllNodesInCombo(combo);
              // combo.getModel().nodeCount = countNodesInCombo(combo)
              combo.getModel().nodeCount = allNodesInCombo.length;
              // update NODE COUNT
              if(combo.getModel().nodeCount < 1) {
                newGraph.uncombo(combo.getID());  
              } else {
                // we only need to update IOC status if the combo is still displayed
                // update IOC STATUS
                let iocStatus = false; 
                if(allNodesInCombo.some((node) => node.getModel().ioc)) iocStatus = true;
                combo.getModel().ioc = iocStatus;
                newGraph.updateCombo(combo);
              }


            });
          }
        }
        newGraph.setItemState(e.item, 'hover', false)
      })

      newGraph.on('edge:mouseenter', (e) => {
        newGraph.setItemState(e.item, 'hover', true)
        newGraph.updateItem(e.item, {
          labelCfg:{
            style:{
              fontFamily: 'Arial',
              fontWeight: 'bold',
              fontSize: 13,
              fill:'white',
              background:{
                fill: 'gray',
                padding: [5, 6, 5, 6], // [top, right, bottom, left]
                stroke: 'black',
                radius: 8,
                lineWidth: 2.5,
              }
            }
          }
        });
        // log('EDGE =', e.item);
      });
  
      newGraph.on('edge:mouseleave', (e) => {
        //newGraph.setItemState(e.item, 'hover', false)
        // turn off edge highlight
        if(isSelected(e.item)) highlightSelected(e.item, true)
        else highlightSelected(e.item, false);
      });
  
      newGraph.on('edge:click', (e) => {
        if(e.item.get('states').includes('click')) {
          // clear edge highlight
          highlightSelected(e.item, false);
          // clear selected Id
          selectedId = null; 
        }
        else {
          // highlight edge
          /* CODE TO DISPLAY ALL EDGE PROPERTIES */
          if(e.item.getModel().properties !== undefined) log('edge properties =', e.item.getModel().properties);
          if(!e.item.getModel().isVEdge) highlightSelected(e.item, true);
          if(selectedId !== null) {
            // deactivate highlight on previously selected graph element
            const element = newGraph.findById(selectedId);
            highlightSelected(element, false);
          }
          selectedId = e.item.getID();
        }
        
      })

      newGraph.on('node:drag', (e) => {
        // we need this check when dragging nodes in or out of combo 
        // to differentiate when combo is moved (dragged)
        nodeDrag = true; 
      })

      newGraph.on('node:dragend', (e) => {
        // nodeDrag status variable needs to be reset
        nodeDrag = false;
      });

      // check that the node that is being dragged, does not have a  comboId,  
      newGraph.on('node:dragenter', (e) => {
        //log('node:dragenter');
        const nodeBModel = e.item._cfg.model;
        nodeB = e.item._cfg.id;
        let nodeAModel = {};
        newGraph.getNodes().forEach((node) => {
          if (node._cfg.id === nodeA) {
            nodeAModel = node._cfg.model
          }
        });

        if ((('comboId' in nodeBModel !== true) || nodeBModel.comboId === undefined) && 
        (('comboId' in nodeAModel !== true) || nodeAModel.comboId === undefined)) { // if it has a comboId, do not create combo
          if (nodeA !== "" && nodeB !== nodeA ) { 
            
            let iocStatus = false;
            const comboCount = newGraph.getCombos().length;
            const last = (comboCount === 0 ? '0' : newGraph.getCombos()[comboCount - 1].getID().substring(5) );
            const newComboId = `combo${parseInt(last) + 1}`
            
            if(nodeAModel.ioc || nodeBModel.ioc) iocStatus = true;

            // *ioc status has to be set at the time of comboCreation because drawShape function within
            // the custom Shape option instance works at shape creation, not post creation.
            // else will have 'iocBadge' is null error.
            newGraph.createCombo({
              id: newComboId, 
              nodeCount: "",
              ioc: iocStatus
            }, [`${nodeA}`, `${nodeB}`]);
            
            const newCombo = newGraph.findById(newComboId);
            if(newCombo) {
              // count the new number of nodes in the combo
              // const newCount = countNodesInCombo(newCombo);
              // instead of using countNodesInCombo function here, we use getAllNodesInCombo to prevent from calling the same Fn twice
              const nodesInCombo = getAllNodesInCombo(newCombo);
              // count number of nodes in newCombo
              const newCount = nodesInCombo.length;
              // update the nodeCount display
              newGraph.updateItem(newCombo,{nodeCount: newCount}) ;
            }
          }
        }
      });

      newGraph.on("node:mouseup", (e) => {
        if (e.item.getModel().comboId != undefined) {
          const comboIdOfNode = e.item.getModel().comboId;
          const combo = newGraph.findById(comboIdOfNode);
          newGraph.setItemState(e.item, "dragenter", true);
          const currentNodeCount = countNodesInCombo(combo);
          if (e.item._cfg.model.nodeCount === "") {  // <----- what is this for?
            log("POOOOOOOOOOOOOT", e.item.getID());
            e.item._cfg.model.nodeCount = currentNodeCount;
          } 
          else {
            if (nodeDrag === true && dragleaveCombo !== undefined) {
              // when moving nodes between different nested combos and different combos
              //for updating the subtraction of node count from outermost combo
              // see combo drag leave
              if (dragleaveCombo._cfg !== null) {
                // log("argghh2");
                // update IOC rating for removing nodes out of combo
                const nodesInDLCombo = getAllNodesInCombo(dragleaveCombo);
                if(nodesInDLCombo.some((node) => node.getModel().ioc)) {
                  newGraph.updateItem(dragleaveCombo, {ioc: true});
                } else {
                  newGraph.updateItem(dragleaveCombo, {ioc: false});
                }
                newGraph.updateCombo(dragleaveCombo);
              } 
              else {
                // for when the only node is dragged out of combo
                // log("ARGGGHH 3")
                newGraph.updateCombo(combo);
              }
            } 
          }
        }
        const updatedCombos = newGraph.getCombos();
          updatedCombos.forEach((combo) => {
            newGraph.setItemState(combo, 'dragleave', false);
            newGraph.setItemState(combo, 'dragenter', false);
          })
      });

      newGraph.on(`combo:drag`,(e) => {
        dragCombo = e.item;
        // prevents dotted red border from showing when dragging combo
        newGraph.setItemState(e.item, 'dragleave', false);
      });

      newGraph.on('combo:dragover', (e) => {
        // log('combo:dragover =', e.item.getID());
        comboDraggedOver = e.item;
        // for updating node count on combo drag
        if(dragCombo !== undefined) {
          if(e.item._cfg !== null && dragCombo._cfg !== null /* && dragCombo !== undefined */) {
            if(!(draggedOverCombos.includes(e.item)) && !nodeDrag && e.item.getID() !== dragCombo.getID()){
              //log('combo dragged over combo');
              draggedOverCombos.push(e.item);
            }
          }
        }
        // for updating node count of combos on node drag
        if (!(draggedOverCombos.includes(e.item))) {
          draggedOverCombos.push(e.item);
          // log('node dragged over combo')
        }
        // for updating ioc  
        newGraph.setItemState(e.item, 'dragenter', true);
      });

      newGraph.on('combo:dragend', (e) => {
        newGraph.getCombos().forEach((combo) =>{
          newGraph.setItemState(combo, 'dragenter', false);
        });
      });


      // for the combo receiving elements that are dropped
      // when .this is a node or a combo that is being dropped
      newGraph.on('combo:drop', (e) => { 
        comboDrop = true; 
        //for COMBO: DRAG
        // if a combo is dropped into .this combo
        if(!nodeDrag){
          console.debug('combo dropped into combo')
        // GET OUTERMOST COUNTER DETAILS!
         let outerMostCombo = e.item; 
         if (e.item.getModel().parentId !== undefined){
           const allParents = getAllParents(e.item, newGraph)
           outerMostCombo = allParents[allParents.length - 1];          
         }
         // we want to update only the combos which have been dragged over, 
         // including the recipient combo and the outermost combo affected
         const allCombos = getAllCombosInCombo(outerMostCombo).concat(outerMostCombo);
         allCombos.forEach((combo) => {
          combo.getModel().nodeCount = countNodesInCombo(combo);
          //REQUIRED when deleting combos from multiple nested layers.
          if(combo.getModel().nodeCount < 1) {
            newGraph.uncombo(combo.getID());
          } else {
            newGraph.setItemState(combo, 'dragleave', false);
            newGraph.setItemState(combo, 'dragenter', false);
            // update combo
            newGraph.updateCombo(combo);
          }
         })
       } else {
        // for NODE:drag
        // if a node is dropped into .this combo
        console.debug('node dropped into combo');
        
        let combosToUpdate = [];
        e.item.getModel().nodeCount = countNodesInCombo(e.item);
        
        // for updating all recipient combo nodecounts and for the parents, grandparents' nodeCount
        if(e.item.getModel().parentId !== undefined) {
          const comboParents = getAllParents(e.item, newGraph);
          combosToUpdate = combosToUpdate.concat(comboParents);

        // for updating nodeCount when moving node across 2 sibling combos in the same parent
          const parent = newGraph.findById(e.item.getModel().parentId);
          if(parent.getCombos().length > 1){
            const children = parent.getCombos();
            const siblings = children.filter(child =>child.getID() !== e.item.getID());
            //log('siblings = ', siblings);
            siblings.forEach((sibling) => {
              combosToUpdate.push(sibling);
            })
          }
        } 

        // for updating all the sibling combos of the recipients 
        //( when node is drag out of a child combo, into a parent combo )
        if(e.item.getCombos() !== undefined) {
          const childCombos = e.item.getCombos();
          let allCCombos = [];
          childCombos.forEach((cCombo)=>{
            let cComboFamily = getAllCombosInCombo(cCombo, newGraph);
            cComboFamily.push(cCombo);
            allCCombos = allCCombos.concat(cComboFamily);
          });
          //log('allCCombos', allCCombos);
          combosToUpdate = combosToUpdate.concat(allCCombos);
        }

        // decrement previous parent combo 
        // when dragging node from one combo tree to another 
        if(draggedOverCombos.length > 0) {
          const draggedOverCombosDisplay = []
          draggedOverCombos.forEach((combo) => {
            if (combo._cfg !== null) {
              draggedOverCombosDisplay.push(combo.getID());
              // add previous parent to combosToUpdate
              if (!(combosToUpdate.includes(combo))) {
                combosToUpdate.push(combo)
              }
            }
          });
          // log('node dragged over these combos:', draggedOverCombosDisplay);
        }

        //log('dragleaveCombo =', dragleaveCombo.getID());
        combosToUpdate.push(e.item);

        // for updating originating combo's node count, 
        // when dragging node from it into a child of another combo
        const updatedCombosDisplay = []
        combosToUpdate.forEach((combo) => {
          updatedCombosDisplay.push(combo.getID())
          /* UPDATE IOC */
          // use getAllNodesInCombo, for IOC assignment and updating nodeCount
          const nodesInCombo = getAllNodesInCombo(combo);
          //const iocNodes = nodesInCombo.filter((node) => node.getModel().ioc);
          if(nodesInCombo.some((node)=> node.getModel().ioc)) {
            // log("sneeze");
            combo.getModel().ioc = true;
          } else {
            // log("ah choo =", combo.getID());
            combo.getModel().ioc = false;
          }
          /* UPDATE NODE COUNT */
          combo.getModel().nodeCount = nodesInCombo.length;
          newGraph.setItemState(combo, 'dragleave', false);
          newGraph.setItemState(combo, 'dragenter', false);
          if(combo.getModel().nodeCount < 1) {
            newGraph.uncombo(combo)
          } else {
            newGraph.updateCombo(combo);
          }
        })
        // log('updated combos =', updatedCombosDisplay);
       }
       // draggedOverCombos = []; // DO NOT UNCOMMENT!
      });


      newGraph.on('combo:dragleave', (e) => {
        // log('combo: dragleave');
        dragleaveCombo = e.item; // <--- active and assigned whilst nodeDrag = true.
        const nodeCountNmbr= countNodesInCombo(dragleaveCombo);
        newGraph.updateItem(dragleaveCombo, {nodeCount: nodeCountNmbr});
        newGraph.setItemState(e.item, 'dragleave', true);

      });

      newGraph.on('combo:mouseenter',(e) => {
        newGraph.setItemState(e.item, 'hover', true);
      });
      newGraph.on('combo:mouseleave',(e) => {
        newGraph.setItemState(e.item, 'hover', false);
      });


      // for .this combo that is being dropped
      newGraph.on('combo:mouseup', (e) => {
        // log('combo:mouseup')
        if(draggedOverCombos.length > 0  && dragleaveCombo !== undefined && dragCombo !== undefined){ 
          // prevents deletion of orphan combo when dragging across graph space quickly
          // (dragged Combo id can become dragleave combo id)
          if(dragleaveCombo._cfg !== null && dragleaveCombo.getID() !== dragCombo.getID()) {
            // to graph space
            // for SUBTRACTING count when DRAGGING NODES & COMBO from OUTERMOST COMBO out to GRAPH SPACE
            // the IF condition has to work for BOTH COMBO & NODE dragging.
            if(!comboDrop) {
              const otherCombos = Array.from(draggedOverCombos.filter(combo => combo.getID() !== dragCombo.getID()));
              otherCombos.forEach((combo, i) => {
                combo.getModel().nodeCount = countNodesInCombo(combo) - countNodesInCombo(dragCombo);
                if (combo.getModel().nodeCount === 0 || countNodesInCombo(combo) === 0) {
                  newGraph.uncombo(combo);
                } else {
                  newGraph.setItemState(combo, 'dragleave', false);
                  newGraph.setItemState(combo, 'dragenter', false);
                  newGraph.updateCombo(combo);
                }
              });
            } 
            // to other combo tree
            else if (comboDrop) {
              // for SUBTRACTING/ADDING (UPDATING) node when DRAGGING NODES & COMBO from nested cCOMBO into different combo tree.
              const draggedOverCombosDisplay = []
              draggedOverCombos.forEach((combo) => {
                // if combo node count become 0 after node or combo dragging, item's _cfg becomes null for that instance. (destroyed)
                if (combo._cfg !== null) {
                  // for logging
                  draggedOverCombosDisplay.push(combo.getID());
                  const nodeCountNmbr= countNodesInCombo(combo);
                  combo.getModel().nodeCount = nodeCountNmbr;
                  if(combo.getModel().nodeCount > 0) {
                    // log(`KEYED, ${combo.getID()}, count: ${nodeCount}`)
                    newGraph.setItemState(combo, 'dragleave', false);
                    newGraph.setItemState(combo, 'dragenter', false);
                    newGraph.updateCombo(combo); //===> draggedOVerCombos here CLASH WITH COMBO:DROPS use of DRAGGEDOVER COMBO? 
                                                // STILL NOT WORKING FULLY WHEN MOVING child combo out to graph space.
                  } else {
                    newGraph.uncombo(combo.getID());
                  }
                }
              });
              // log('draggedOver combos updated:', draggedOverCombosDisplay);
            }
          }
        }
        draggedOverCombos = [];
        comboDrop = false;
      });

      newGraph.on("combo:contextmenu", (e) => {
        const comboId = e.item.getID();
        newGraph.uncombo(comboId);
        });
      
      // for user's action on expanding and collapsing combo
      // target elements: combos & VEdges
      newGraph.on("combo:click", (e) => {
      const combo = e.item;
      const comboModel = e.item.getModel()
      // all actions to take when combo is collapsed. 
      if (comboModel.collapsed) {
        comboCollapseTTP(combo);
       } 
         else {
          comboExpandTTP(e.item);
          handleIOC(e.item, newGraph);
       } 
    });


    function comboCollapseTTP(combo) {
      // 1) grab all the VE from .this combo that is being collapsed
      // 2) grab all the nodes inside this combo
      // 3) from the nodes, find all the possible standard edges
      // 4) create a VE to edge map for all the VE of this collapsed combo
      // 5) transfer the VE label over if the nEdge is still inRange
      let allEdgesInRange = [];
      let veMap = {};
      const cVEdges = combo.getEdges();
      const cNodes = getAllNodesInCombo(combo);
      cNodes.forEach((node) => {
        const nodeEdgesInRange = node.getEdges().filter((edge) => !edge.getModel().isVEdge && edge.getModel().inRange);
        allEdgesInRange = allEdgesInRange.concat(nodeEdgesInRange);
      });
      
      const allEdgesDisp = [];
      allEdgesInRange.forEach((edge) => allEdgesDisp.push(edge.getID()));
      console.log('allEdges =', allEdgesDisp);

      cVEdges.forEach((vEdge) => { 
        // create empty array for holding standard edges
        veMap[vEdge.getID()] = [];
      })
      for (let i = 0; i< cVEdges.length; i++) {
        let veSourceNodeIds = [];
        let veTargetNodeIds = [];
        const veSource = cVEdges[i].getSource();
        const veTarget = cVEdges[i].getTarget();
        if(veSource.getType() === 'combo') {
          const vSourceNodes = getAllNodesInCombo(veSource);
          vSourceNodes.forEach((sNode) => {
            veSourceNodeIds.push(sNode.getID());
          });
         }
         if(veTarget.getType() === 'combo') {
          const vTargetNodes = getAllNodesInCombo(veTarget);
          vTargetNodes.forEach((vTarget) => {
            veTargetNodeIds.push(vTarget.getID())
          });
        }

        for(let j = 0; j < allEdgesInRange.length; j++) {
          const source = allEdgesInRange[j].getSource();
          const target = allEdgesInRange[j].getTarget();
          if((veSource.getID() === source.getID() || veSourceNodeIds.includes(source.getID()) ) && 
          (veTarget.getID() === target.getID() || veTargetNodeIds.includes(target.getID()) ) 
          ) {
           veMap[cVEdges[i].getID()].push(allEdgesInRange[j]);
          }
        }
      }
      cVEdges.forEach((vEdge) => {
        const edgesRepresented = veMap[vEdge.getID()];
        if (edgesRepresented.some((edge) => edge.getModel().ttp)) {
          newGraph.updateItem(vEdge, {ttp: true});
        }
      });
    }
    
    // Expand combo -> starting from VEdge and collapsed combo  
    function comboExpandTTP(combo) {
      const combos = combo.getCombos();
      const nodes = combo.getNodes();
      if (nodes.length > 0) {
        for (let i = 0; i < nodes.length; i++) {
          const neighbours = nodes[i].getNeighbors();
          let ttp = false;
          neighbours.forEach((neighbour) => {
            if (neighbour.getType() === "combo") {
              ttp = checkTTP(nodes[i], neighbour);
              // console.debug('3) TTP:',ttp);
              if (ttp) {
                const edges = nodes[i].getEdges();
                edges.forEach((edge) => {
                  if (edge.getModel().isVEdge) {
                    if ( 
                      edge.getTarget() === neighbour || edge.getSource() === neighbour
                    ) {
                      edge.getModel()["ttp"] = ttp;
                      return;
                    } 
                  }
                });
                return;
              }
            }
          });
        }
      }
      if (combos.length > 0) {
        combos.forEach((inCombo) => {
          if (inCombo.getModel().collapsed) {
            const neighbours = inCombo.getNeighbors();
            for (let i = 0; i < neighbours.length; i++) {
              if (
                neighbours[i].getType() === "node" &&
                !nodes.includes(neighbours[i])
              ) {
                let ttp = false;
                const allCNodes = getAllNodesInCombo(inCombo);
                for (let j = 0; j < allCNodes.length; j++) {
                  if (allCNodes[j].getNeighbors().includes(neighbours[i])) {
                    const CNodeEdges = allCNodes[j].getEdges();
                    for (let k = 0; k < CNodeEdges.length; k++) {
                      if (
                        CNodeEdges[k].getSource() === neighbours[i] ||
                        CNodeEdges[k].getTarget() === neighbours[i]
                      ) {
                        ttp = CNodeEdges[k].getModel().ttp;
                        if (ttp) break;
                      }
                    }
                  }
                  if (ttp) break; // <=== needs further study.
                }
                if (ttp) {
                  const comboVedges = inCombo.getEdges();
                  for (let j = 0; j < comboVedges.length; j++) {
                    if (
                      comboVedges[j].getSource() === neighbours[i] ||
                      comboVedges[j].getTarget() === neighbours[i]
                    ) {
                      comboVedges[j].getModel()["ttp"] = true;
                      break;
                    }
                  }
                  // log('>>comboVE on EXPAND =', comboVedges);
                }
              } else if (
                neighbours[i].getType() === "combo" &&
                !combos.includes(neighbours[i])
              ) {
                let ttp = false;
                const nodesInNeighbour = getAllNodesInCombo(neighbours[i]);
                const nodesInCombo = getAllNodesInCombo(inCombo);
                for (let j = 0; j < nodesInCombo.length; j++) {
                  if (
                    nodesInCombo[j]
                      .getNeighbors()
                      .some((r) => nodesInNeighbour.includes(r))
                  ) {
                    const cNodeEdges = nodesInCombo[j].getEdges();
                    for (let k = 0; k < cNodeEdges.length; k++) {
                      if (
                        nodesInNeighbour.includes(cNodeEdges[k].getSource()) ||
                        nodesInNeighbour.includes(cNodeEdges[k].getTarget())
                      ) {
                        if (cNodeEdges[k].getModel().ttp) ttp = true;
                      }
                    }
                  }
                }
                if (ttp) {
                  const comboVedges = inCombo.getEdges();
                  for (let j = 0; j < comboVedges.length; j++) {
                    if (
                      comboVedges[j].getSource() === neighbours[i] ||
                      comboVedges[j].getTarget() === neighbours[i]
                    ) {
                      comboVedges[j].getModel()["ttp"] = true;
                      break;
                    }
                  }
                  // log('## comboVE on EXPAND =', comboVedges);
                }
              }
            }
          } else {
            comboExpandTTP(inCombo);
          }
        });
      }
    }


    function handleIOC(combo, graph) {
      let outerMostCombo;
      // find the outermost combo. 
      const allParents = getAllParents(combo, graph)
      if (allParents.length > 0) {
        outerMostCombo = allParents[allParents.length - 1];
      } else {
        outerMostCombo = combo
      }
      // from outermost combo, search inwards and find all combos
      const allCombos = getAllCombosInCombo(outerMostCombo).concat(outerMostCombo);
      let allCombosDisp = []
      allCombos.forEach((combo) => {
        allCombosDisp.push(combo.getID())
        let cNodesInRange = []
        const cNodes = getAllNodesInCombo(combo);
        cNodes.forEach((node) => {
          const nodeEdges = node.getEdges((edge) => !edge.getModel().VEdge);
          if(nodeEdges.some((edge) => edge.getModel().inRange)) cNodesInRange.push(node);
        })
        if (cNodesInRange.some((cNode) => cNode.getModel().ioc)) graph.updateItem(combo, {ioc: true});
      })
    }
    

      function getAllParents(childCombo, graph) {
        let arr = []
        grabParents(childCombo, arr, graph);
        return arr;
      }
      
      function grabParents(combo, array, graph) {
        if (combo.getModel().parentId === undefined) {
          return 
        } else {
          const parentID = combo.getModel().parentId
          const parentCombo = graph.findById(parentID);
          array.push(parentCombo);
          grabParents(parentCombo, array, graph);
        }
      }

      // // returns true if there is an edge between the node and combo
      // // AND that edge is TTP.
      // function checkTTP(node, combo) {
      //   const nEdges = node.getEdges();
      //   let x = false;
      //   let combosInCombo = combo.getCombos();
      //   if (combosInCombo.length > 0) {
      //     for (let i = 0; i < combosInCombo.length; i++) {
      //       x = checkTTP(node, combosInCombo[i]);
      //       if (x) break;
      //     }
      //   }
      //   if (x) return x; 
      //   let cNodes = combo.getNodes();
      //   for (let i = 0; i < nEdges.length; i++) {
      //     if (
      //       cNodes.includes(nEdges[i].getSource()) ||
      //       cNodes.includes(nEdges[i].getTarget())
      //     ) {
      //       if (nEdges[i].getModel().ttp) {
      //         x = true;
      //         break;
      //       }
      //     }
      //   }
      //   return x;
      // }

      // returns true if there is an edge between the node and combo
      // AND that edge is TTP.
      function checkTTP(node, combo) {
        // console.debug('**checkTTP**');
        let nEdgesInside = [];
        let ttpStatus = false; 
        const comboNodes = getAllNodesInCombo(combo);
        comboNodes.forEach((cNode) => {
          const cNodeNEdges = cNode.getEdges().filter(nEdge => !nEdge.getModel().isVEdge);
         nEdgesInside = nEdgesInside.concat(cNodeNEdges);
        });

        for(let i = 0; i < nEdgesInside.length; i++){
          if (nEdgesInside[i].getSource().getID() === node.getID() || nEdgesInside[i].getTarget().getID() === node.getID()) {
            if (nEdgesInside[i].getModel().ttp) {
              ttpStatus = true;
              break;
            } 
          }
        }
        // console.debug('1) ttpStatus', ttpStatus);
        return ttpStatus; 
      }

      const countNodesInCombo = (combo) => {
        if (combo !== undefined) {
          const allNodesCount = getAllNodesInCombo(combo).length;
         return allNodesCount;
        } 
        console.warn(`ERROR: comboId is undefined when counting nodes in combo`)
      }


      function getAllNodesInCombo(combo) {
        let arr = [];
        return grabAllNodes(combo, arr);
      }

      function grabAllNodes(combo, array) {
        let combos = combo.getCombos(); 
        let childNodes = combo.getNodes(); 
        
        combos.forEach((inCombo) => { array.concat(grabAllNodes(inCombo, array)); });
        childNodes.forEach((node) => { array.push(node); });
        return array;
      }


      function getAllCombosInCombo(outerMostCombo) {
        let arr = [];
        grabAllCombos(outerMostCombo, arr);
        return arr; 
      }

      function grabAllCombos(combo, array) {
        let cCombos = combo.getCombos();
        if(cCombos.length === 0){
          array.push(combo) // <---- ERRONEOUS!
          return array;
        } else {
          for(let i = 0; i < cCombos.length; i++) {
            array.push(cCombos[i])
            if (cCombos[i].getCombos().length > 0) {
              array.concat(grabAllCombos(cCombos[i], array))
            }
          }
        }
      }

      function highlightSelected(element, boolean) {
        if (boolean) {
          // Highlight this node keyshape
          newGraph.setItemState(element, 'click', true)
          //turn on node highlight
          newGraph.updateItem(element, {
            style:{
              fill: 'white',
            },
            labelCfg:{
              style:{
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fontSize: 13,
                fill:'black',
                background:{
                  fill: 'orange',
                  padding: [5, 6, 5, 6], // [top, right, bottom, left]
                  stroke: 'orange',
                  radius: 8,
                  lineWidth: 2.5,
                }
              }
            }
          });
        } 
        else {
          // Turn Off node click 
          newGraph.setItemState(element, 'click', false)
          newGraph.setItemState(element, 'hover', false)
          // turn off node highlight
          newGraph.updateItem(element, {
            labelCfg:{
              style:{
                fontFamily: 'Arial',
                fontWeight: 'normal',
                fontSize: 11, 
                fill:'black',
                background:{
                  fill: 'transparent',
                  padding:  [0, 0, 0, 0], // [top, right, bottom, left]
                  stroke: 'transparent',
                  lineWidth: 0,
                  radius: 0,
                }
              }
            }
          });
        }
      }

      function isSelected(element) {
        if (element.get('states').includes('click')){
          return true
        }
        return false
      }

      function nodeClearHighlight(node) {
        // clear all states on keyshape 
        node.clearStates()
        // restore formatting of label
        newGraph.updateItem(node, {
          labelCfg:{
            style:{
              fontFamily: 'Arial',
              fontWeight: 'normal',
              fontSize: 11, 
              fill:'black',
              background:{
                fill: 'transparent',
                padding: [0, 0, 0, 0], // [top, right, bottom, left]
                stroke: 'transparent',
                radius: 0,
                lineWidth: 0,
              }
            }
          }
        });
      }
      
  
      // DO NOT DELETE 
      newGraph.on("canvas:click", function (event) {
        const nodes = newGraph.getNodes();
        log('NODES:', nodes);
        nodes.forEach((node) => {
          log(`     ${node.getID()} | cBC: ${node.getModel().collapsedByCombo} | inRange: ${node.getModel().inRange}\n           | visible: ${node.isVisible()}`);

        })
        const edges = newGraph.getEdges();
        log('EDGES:', edges);
        edges.forEach((edge) => {
          log(`     ${edge.getID()} | s= ${edge.getSource().getID()}       | t= ${edge.getTarget().getID()}\n           | cBC: ${edge.getModel().collapsedByCombo} | inRange: ${edge.getModel().inRange}\n           | visible: ${edge.isVisible()}`);

        })
        const combos = newGraph.getCombos();
        log('COMBOS:', combos);
        const vEdges = newGraph.get('vedges');
        log('VEdges:', vEdges);
        vEdges.forEach((VEdge) => {
          log(`     ${VEdge.getID()} | \n         | s= ${VEdge.getSource().getID()}      | t= ${VEdge.getTarget().getID()}\n         | visible: ${VEdge.isVisible()} | inRange: ${VEdge.getModel().inRange}\n         | ttp: ${VEdge.getModel().ttp}`);
        })
        });


      // RESIZING
      if (typeof window !== 'undefined')
        window.onresize = () => {
          if (!newGraph || newGraph.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight) return;
          newGraph.changeSize(container.scrollWidth, container.scrollHeight - 100);
        };
      
      setGraph(newGraph);
      setTimeBar(newTimebar);
    }, [])
  
    return <div ref={ref}></div>
  }
  
  export default TimeBarTrend

  
