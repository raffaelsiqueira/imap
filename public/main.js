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


        cy.zoom(3);
        cy.maxZoom(9999999);

            //declaro um objeto vazio para armazenar as posições do nó selecionado
            var posicao = {

            };

            cy.on('click','node', function(e){
              selectedNode = e.cyTarget.id();
              cy.nodes().style('border-width', 'none');
              cy.nodes().style('border-color', 'white');
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

  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  // var $currentInput = $usernameInput.focus();

  // var socket = io();

  function addParticipantsMessage (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
  }

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      // $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
    }
  }

  // Sends a chat message
  function sendMessage () {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Log a message
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }

  // Adds the visual chat typing message
  function addChatTyping (data) {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
  }

  // Removes the visual chat typing message
  function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).html();
  }

  // Updates the typing event
  function updateTyping () {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages (data) {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      // $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $inputMessage.on('input', function() {
    updateTyping();
  });

  // Click events

  // Focus input when clicking anywhere on login page
  // $loginPage.click(function () {
  //   $currentInput.focus();
  // });

  // Focus input when clicking on the message input's border
  // $inputMessage.click(function () {
  //   $inputMessage.focus();
  // });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to IMAP Chat – ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });

  socket.on('disconnect', function () {
    log('you have been disconnected');
  });

  socket.on('reconnect', function () {
    log('you have been reconnected');
    if (username) {
      socket.emit('add user', username);
    }
  });

  socket.on('reconnect_error', function () {
    log('attempt to reconnect has failed');
  });











})();