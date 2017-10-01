'use strict';

(function() {

  var socket = io();
  var canvas = document.getElementsByClassName('whiteboard')[0];
  var colors = document.getElementsByClassName('color');
  var context = canvas.getContext('2d');

  var current = {
    color: 'black'
  };

  var drawing = false;
  var dragging = false;

  for (var i = 0; i < colors.length; i++){
    colors[i].addEventListener('click', false);
  }

  socket.on('drawing', onDrawingEvent);
  socket.on('dragging', onDraggingEvent);


  window.addEventListener('resize', onResize, false);
  onResize();


              var selectedNode = 0;
              var cy = window.cy = cytoscape({
              container: document.getElementById('cy'),
              boxSelectionEnabled: false,
              autounselectify: true,
               wheelSensitivity: 0.1,
              layout: {
                name: 'dagre'
              },
              style: [
                {
                  selector: 'node',
                  style: {
                    'shape': 'circle',
                    'content': 'data(idNome)',
                    'text-opacity': 0.5,
                    'text-valign': 'center',
                    'text-halign': 'right',
                    'background-color': [169,169,169]
                  }
                },
                {
                  selector: 'edge',
                  style: {
                    'width': 1,
                    'target-arrow-shape': 'triangle',
                    'line-color': [157,186,234],
                    'target-arrow-color': [157,186,234],
                    'curve-style': 'bezier'
                  }
                }


              ],
          elements: {
            nodes: [
              { data: { id: 'n0' } },
              { data: { id: 'n1' } },
              { data: { id: 'n2' } },
              { data: { id: 'n3' } },
              { data: { id: 'n4' } },
              { data: { id: 'n5' } },
              { data: { id: 'n6' } },
              { data: { id: 'n7' } },
              { data: { id: 'n8' } },
              { data: { id: 'n9' } },
              { data: { id: 'n10' } },
              { data: { id: 'n11' } },
              { data: { id: 'n12' } },
              { data: { id: 'n13' } },
              { data: { id: 'n14' } },
              { data: { id: 'n15' } },
              { data: { id: 'n16' } }
            ],
            edges: [
              { data: { source: 'n0', target: 'n1' } },
              { data: { source: 'n1', target: 'n2' } },
              { data: { source: 'n1', target: 'n3' } },
              { data: { source: 'n4', target: 'n5' } },
              { data: { source: 'n4', target: 'n6' } },
              { data: { source: 'n6', target: 'n7' } },
              { data: { source: 'n6', target: 'n8' } },
              { data: { source: 'n8', target: 'n9' } },
              { data: { source: 'n8', target: 'n10' } },
              { data: { source: 'n11', target: 'n12' } },
              { data: { source: 'n12', target: 'n13' } },
              { data: { source: 'n13', target: 'n14' } },
              { data: { source: 'n13', target: 'n15' } },
            ]              },
              
            });




            cy.zoom(1.5);
            cy.maxZoom(9999999);  


            var posicao = {

            };

            cy.on('click','node', function(e){
              selectedNode = e.cyTarget.id();
              cy.getElementById(selectedNode).style('border-width', '1');
              cy.getElementById(selectedNode).style('border-color', 'black');

              });

            cy.on('mousedown','node', function(e){
                dragging = true;
                selectedNode = e.cyTarget.id();
                // posicao.x  = e.cyRenderedPosition.x;
                // posicao.y = e.cyRenderedPosition.y;
                  posicao.x  = e.cyRenderedPosition.x;
                  posicao.y = e.cyRenderedPosition.y;
              });

              cy.on('mouseup','node', function(e){
                  if (!dragging) { return; }
                    dragging = false;
                    drawLine(posicao.x, posicao.y, e.cyRenderedPosition.x, e.cyRenderedPosition.y, current.color, true);

                    selectedNode = e.cyTarget.id();
                   updatePosition(e.cyPosition.x, e.cyPosition.y, selectedNode, true);
              });


              // cy.on('mouseout', 'node', function(e){
              //     if (!dragging) { return; }
              //       dragging = false;
              //       drawLine(posicao.x, posicao.y, e.cyRenderedPosition.x, e.cyRenderedPosition.y, current.color, true);


              //      //   selectedNode = e.cyTarget.id();
              //      // updatePosition(posicao.x, posicao.y, selectedNode, true);

              // });


              // cy.on('mousemove', 'node', function(e){
              //     if (!dragging) { return; }
              //     drawLine(posicao.x, posicao.y, e.cyRenderedPosition.x, e.cyRenderedPosition.y, current.color, true);

              //     posicao.x = e.cyRenderedPosition.x;
              //     posicao.y = e.cyRenderedPosition.y;
              //     selectedNode = e.cyTarget.id();
              //     updatePosition(e.cyRenderedPosition.x, e.cyRenderedPosition.y, selectedNode, true);
              // });


  function drawLine(x0, y0, x1, y1, color, emit){
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    var w = canvas.width;
    var h = canvas.height;
    
    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color
    });
  }



function updatePosition(x0, y0, selectedNode, emit){
 

// cy.getElementById(selectedNode).positions(function(i, ele){
//      return{

//           x : cy.getElementById(selectedNode).position(x0),
//           y : cy.getElementById(selectedNode).position(y0)

//     };
// });
;

    cy.$('#' + selectedNode).position({
      x: x0,
      y: y0
    });

     if (!emit) { return; }
        var w = cy.width();
        var h = cy.height();

        socket.emit('dragging', {
            x0: x0 / w,
            y0: y0 / h,
            selectedNode: selectedNode
         });
}


  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }

  function onDraggingEvent(data){
      var w = cy.width();
      var h = cy.height();
      updatePosition(data.x0 * w, data.y0 * h, data.selectedNode);
      // cy.getElementById(data.selectedNode).position(data.x0 * w, data.y0 * h);
       // cy.getElementById(selectedNode).position(x0,y0);
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

})();
