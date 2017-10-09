'use strict';

var selectedNode = 0;
(function() {

  var socket = io();

  var current = {
    color: 'black'
  };

  var dragging = false;

  socket.on('dragging', onDraggingEvent);

      
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
            // {
            //  //Imagem do google a ser exibida no mapa
            //  selector:'#googleUserImage',
      //        style:{
      //          'background-image': 'url('+GoogleURL+')',
      //          'background-fit': 'cover',
      //          'width': '12px',
      //          'height': '12px'
      //          }
      //      }

          ],
          elements: {
            nodes: [
              { data: { id: '0' , nivel: 0, description: '', type: '', metric: 0} },
            ],
            edges: []
          },
          
        });


        cy.zoom(4);
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
                    selectedNode = e.cyTarget.id();
                   updatePosition(e.cyPosition.x, e.cyPosition.y, selectedNode, true);
              });

function updatePosition(x0, y0, selectedNode, emit){
 
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

  function onDraggingEvent(data){
      var w = cy.width();
      var h = cy.height();
      updatePosition(data.x0 * w, data.y0 * h, data.selectedNode);
      // cy.getElementById(data.selectedNode).position(data.x0 * w, data.y0 * h);
       // cy.getElementById(selectedNode).position(x0,y0);
  }


$('#add').click(function () {
        let idText = $("#nodeName").val();
        let nivelPai = cy.getElementById(selectedNode).data("nivel");
        if (idText == ''){
          alert("Write the name of the node!");
        }else{
          if (!(cy.nodes().length == 0)){
            cy.add([
              { group: "nodes", data: {id:  i+1, idNome:idText, level: cy.getElementById(selectedNode).nivel + 1  }, position: {x: cy.getElementById(selectedNode).position("x")+50, y: cy.getElementById(selectedNode).position("y")+50}},
              { group: "edges", data: { id: 'edge'+i, source: selectedNode, target: i+1}}
            ]);
            cy.getElementById(i+1).data("nivel", nivelPai + 1);
            //console.log(cy.getElementById(idText).data("nivel"));
            
            i++;
          }else{
            cy.add([
              { group: "nodes", data: {id:  idText, idNome:idText  }, position: {x: 0, y: 0}},
            ]);
            selectedNode = idText;
            cy.getElementById(selectedNode).style("background-color","#000000");
          }
          $('#createNodeModal').modal('hide');
          $('#createNodeModal').find('.modal-body input').val("")
        }
        var nodeLevel = cy.getElementById(i).data("nivel");
        if(nodeLevel == 1){
          cy.getElementById(i).style('shape', 'triangle');
          cy.getElementById(i).style("background-color","#00FF00");
          cy.getElementById(i).data('type', 'Scenario');
        }
        else if(nodeLevel == 2){
          cy.getElementById(i).style('shape', 'roundrectangle');
          cy.getElementById(i).style("background-color","#FF8C00"); 
          cy.getElementById(i).data('type', 'Alternative');
        }
        else if(nodeLevel == 3){
          cy.getElementById(i).style('shape', 'diamond');
          cy.getElementById(i).style("background-color","#0000FF");
          cy.getElementById(i).data('type', 'Implication');
        }
        else if(nodeLevel == 4){
          cy.getElementById(i).style('shape', 'star');
          cy.getElementById(i).style("background-color","#FF0000");
          cy.getElementById(i).data('type', 'Impact');
        }
        
        //cy.fit();
      });





})();

