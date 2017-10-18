'use strict';

//Sempre declare variáveis globais fora do escopo local. Senão elas vão resetar e não vai funcionar
var selectedNode = 0;
var i = 0;

(function() {

  var socket = io();

  var current = {
    color: 'black'
  };

  var dragging = false;


  //chamo as funções do socket via os eventos abaixo. Eles são chamados quando executamos o socket.emit
  socket.on('adding', onAddingEvent);
  socket.on('removing', onRemovingEvent);
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

            //declaro um objeto vazio para armazenar as posições do nó selecionado
            var posicao = {

            };

            cy.on('click','node', function(e){
              selectedNode = e.cyTarget.id();
              cy.getElementById(selectedNode).style('border-width', '1');
              cy.getElementById(selectedNode).style('border-color', 'black');

              });

            cy.on('mousedown','node', function(e){
              //troco o valor dessa variavel para permitir a emissão do evento
                dragging = true;
                selectedNode = e.cyTarget.id();
                  posicao.x  = e.cyRenderedPosition.x;
                  posicao.y = e.cyRenderedPosition.y;
              });

              cy.on('mouseup','node', function(e){
                  if (!dragging) { return; }
                    dragging = false;
                    selectedNode = e.cyTarget.id();
                    //quando solto o botão do mouse, mando atualizar a posição do nó 
                   updatePosition(e.cyPosition.x, e.cyPosition.y, selectedNode, true);
              });

function updatePosition(x0, y0, selectedNode, emit){
 
    cy.$('#' + selectedNode).position({
      x: x0,
      y: y0
    });

    //essa validação do emit tem uma tirada importante. Quando chamamos no onDraggingEvent, o valor
    //emit não é enviado. Ele então é dado como undefined e nega a emissão. Isso evita o loop que
    //iria acontecer quando essa função chega no cliente. O mesmo só atualiza o valor e para de emitir.
     if (!emit) { return; }
        var w = cy.width();
        var h = cy.height();


    //Emito os valores que eu quero para a função desejada
        socket.emit('dragging', {
            x0: x0 / w,   //divido por w e h só para ter o valor certo do viewport atual
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
      //chamo a função novamente para gerá-los no cliente

      // cy.getElementById(data.selectedNode).position(data.x0 * w, data.y0 * h);
      // cy.getElementById(selectedNode).position(x0,y0);
  }


  function onAddingEvent(nodedata){
    console.log("evento");
    addNode(nodedata.selectedNode, nodedata.idText, nodedata.nivelPai);
  }

  function onRemovingEvent(nodeData){
    console.log("Removing");
    removeNode(nodeData.selectedNode, nodeData.idAtual, nodeData.temFilho);
  }



function addNode(selectedNode, idText, nivelPai , emit){ //ivalue
    cy.add([
          { group: "nodes", data: {id:  i+1, idNome:idText, level: nivelPai + 1  }, position: {x: cy.getElementById(selectedNode).position("x")+50, y: cy.getElementById(selectedNode).position("y")+50}},
          { group: "edges", data: { id: 'edge'+i, source: selectedNode, target: i+1}}
    ]);
    cy.getElementById(i+1).data("nivel", nivelPai + 1);
    i++;

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

    if (!emit) { return; }

        socket.emit('adding', {
            selectedNode: selectedNode,
            idText: idText,
            nivelPai: nivelPai,
            // i: i
        });     
}

function removeNode(selectedNode, idAtual, temFilho, emit){
    let saveNode = selectedNode;
    let passow = false;
    cy.edges().forEach(function (edge){
      if(edge.source().id() == selectedNode){
        alert("You can only remove leaves");
        temFilho=1;
        return;
      }
    });
    cy.edges().forEach(function (edge){
    if(edge.target().id() == selectedNode){
      selectedNode = edge.source().id();
      passow = true;
    }
  });
    if(temFilho==0){
      cy.getElementById(saveNode).remove();
    }
    
    if (!passow){
      if (!(cy.nodes().length == 0)){
        selectedNode = cy.nodes()[0].id();
      }
    }

    if (!emit) { return; }

        socket.emit('removing', {
            selectedNode: saveNode,
            idAtual: idAtual,
            temFilho: temFilho,
            // i: i
        });

}

$('#add').on('click', function () {
        let idText = $("#nodeNames").val();
        let nivelPai = cy.getElementById(selectedNode).data("nivel");
        var nodeLevel = cy.getElementById(i).data("nivel");
        if (idText == ''){
          alert("Write the name of the node!");
        }else{
          if (!(cy.nodes().length == 0)){
           addNode(selectedNode, idText, nivelPai, true);
          }
        $('#createNodeModal').modal('hide');
        $('#createNodeModal').find('.modal-body input').val("")
        }

      });

$('#remove').on('click', function () {
      var idAtual = cy.getElementById(selectedNode).data("id");
      var temFilho = 0;
      if(cy.getElementById(selectedNode).data("nivel") == 0){
        //alert("Você não pode remover a raiz!");
        alert("Unable to remove parents!");
      }
      else{
        removeNode(selectedNode, idAtual, temFilho, true);
      }
});

})();