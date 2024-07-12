import { imageURLs } from "./imageURLs";

// TODO: should just return the jsonData instead of building another graphData.
export function populateNodesEdges (incomingJson) {
  console.log('incomingJson =', incomingJson);

    const graphData = {
      info: [],
      nodes: [],
      edges: [],
      combos: []
    };
    // This format if we want to customise shapes and sizes according
    // to data
    const image = { type: 'image', 
                     size: 36};

    const circle = {  type: 'circle', 
                      size: 54, // this will be the default size of all the nodes
                      style: {
                      position: 'top',
                      stroke: '#5f6266',
                      fill: 'transparent',
                      lineWidth: 4,
                      } 
                    };
    
    const triangle = { type: 'triangle',
                       size: 20, 
                       direction: 'up'};
    
    const imageHash = {
      'User': imageURLs[15],
      'Group': imageURLs[16],
      'Computer': imageURLs[17],
      'Registry': imageURLs[18],
      'File': imageURLs[19],
      'Process': imageURLs[20],
      'Port': imageURLs[21],
      'Firewall': imageURLs[22],
      'Email': imageURLs[23],
      'IP_Address' : imageURLs[24]
    }                   
    
    // Add icon settings to graphData from BackEnd
    incomingJson.nodes.forEach((node) => {
      // assign custom modeltype/shape to use
      node["type"] = 'circle';
      node["size"] = 24;
      const iconType = node["display"]["labels"][0];
      if (Object.keys(imageHash).includes(iconType)){
        // formating for the icon and the image to be displaye inside the node circle
        // node["img"] = imageHash[iconType];
        node = {...node, ...circle};
        node["icon"] = { 
                        show: true,
                        /* icon's img address, string type */
                        img: imageHash[iconType],
                        /* icon's size, 20 * 20 by default: */
                        width: 30,
                        height: 30,
                         };
      } else {
        // set to questionmark icon
        node["img"] = imageURLs[25];
      }
      // push node daata to CyGraph graph data
      graphData["nodes"].push(node);
    })  

    graphData["info"].push(incomingJson["edges"][0])
    
    // push edge data to Cygraph edge data
    // i starts at 1 to skip timeBar info
    for(let i = 1; i < incomingJson["edges"].length; i++ ) {
      graphData["edges"].push(incomingJson["edges"][i])
    }

    // push combo data to CyGraph combo data
    if (incomingJson["combos"] !== undefined && incomingJson["combos"].length > 0) {
      for(let i = 0; i < incomingJson["combos"].length; i++ ) {
        // assign custom modeltype/shape to use
        incomingJson["combos"][i]["type"] = "cCircle";
        // push
        graphData["combos"].push(incomingJson["combos"][i]);
      }
    }

    // for self-looping.
    const selfLoopingEdges = graphData["edges"].filter((edge) => edge.source ===  edge.target)
    selfLoopingEdges.forEach((selfEdge) => {
      selfEdge["type"] = "loop"
    })

    // CyGraph injects calculated information based on graphData back into it (i.e. coordinates)
    console.log('graphData =', graphData); 
    console.log('incomingJson =', incomingJson)
    return graphData;
   }
