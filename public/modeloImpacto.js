   // let i = 0;
    // let nId = 1;
    var pressedShift = false;
    //location.href = "lerJSON.php";
    //alert(testeSQL);
    //cy.json(variavel);
    //location.href = "lerJSON.php";

      $("#menu-toggle").click(function(e) {
       e.preventDefault();
       $("#wrapper").toggleClass("active");
       $("#cy").toggleClass("active");
      });


    $('input').keypress(function (ev) {
        if (ev.which == 13) {
            ev.preventDefault();
            $('#' + $(this).prop('name')).trigger('click');
        }
    });

    $('button').click(function (ev) {
        ev.preventDefault();
        //alert($(this).attr('id') + ' click');
    });
    
    $(document).keyup(function(e){
      if(e.which == 16) pressedShift = false;
    })
    
    $(document).keydown(function(e){
      if(e.which == 16) pressedShift = true;
      if((e.which == 67 || e.keyCode == 67) && pressedShift == true) {
        $('#createNodeModal').modal('show');
      }
    })
    $(document).keydown(function(e){
      if(e.which == 16) pressedShift = true;
      if((e.which == 82 || e.keyCode == 82) && pressedShift == true) {
        $('#renameNodeModal').modal('show');
      }
    })
    $(document).keydown(function(e){
      if(e.which == 46 || e.keyCode == 46){
        remove();
      }
    })
    $(document).keydown(function(e){
      if(e.which == 16) pressedShift = true;
      if((e.which == 77 || e.keyCode == 77) && pressedShift == true) {
        center();
      }
    })
    $(document).keydown(function(e){
      if(e.which == 16) pressedShift = true;
      if((e.which == 68 || e.keyCode == 68) && pressedShift == true) {
        $('#descriptionModal').modal('show');
      }
    })
    $(document).keydown(function(e){
      if(e.which == 16) pressedShift = true;
      if((e.which == 65 || e.keyCode == 65) && pressedShift == true) {
        openAltModel();
      }
    })
  /*  $(document).keypress(function(e) {
      if(e.charCode == 99) {
        alert("Você apertou c");
      }
    }); */
    //let level = 0;
    //console.log(cy.getElementById(selectedNode).children());

    function testeJSON(){
      var nomeMapa = prompt("Digite o nome do seu mapa");
      var textoJSON = '';
      textoJSON = JSON.stringify( cy.json() );
      location.href = "generateJSON.php?texto="+textoJSON+"&email="+emailGoogle+"&nome="+nomeMapa;
    }

    function exportMap(){
       var doc = new jsPDF('landscape', 'pt', 'a4');
       doc.addHTML(document.body,function(){
        doc.save("teste.pdf");
       });
    
    }

    function alertbobo(){
      alert('alert bobo');
    }

    function loadMapfromJSON(){
      var aux = 0;
      var nomeMapa = prompt("Digite o nome do mapa que deseja carregar");
      //var jsonexportada;
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'lerJSON.php',
        data: {
          nome: nomeMapa,
          email: emailGoogle
        },
        success: function(dados){
          //cy.json(dados);
          //alert(JSON.stringify(dados.json));
          //jsonexportada = dados.json;
          
          //cy.remove(cy.collection());
          cy.remove(cy.elements());
          cy.json(JSON.parse(dados.json));
          cy.nodes().forEach(function(node){
            if (node.data('nivel') == 1){
              node.style('shape', 'triangle');
            node.style("background-color","#00FF00");
            node.data('type', 'Scenario');
            }
            else if(node.data('nivel') == 2){
            node.style('shape', 'roundrectangle');
            node.style("background-color","#FF8C00"); 
            node.data('type', 'Alternative');
          }
          else if(node.data('nivel') == 3){
            node.style('shape', 'diamond');
            node.style("background-color","#0000FF");
            node.data('type', 'Implication');
          }
          else if(node.data('nivel') == 4){
            node.style('shape', 'star');
            node.style("background-color","#FF0000");
            node.data('type', 'Impact');
          }
          });
          
        }
      });

      
    }

    function invite(){
      let email = $('#emailInput').val()
      location.href = "envia_email_gmail.php?email="+email;
    }
    
    function pdf(){
      var doc = new jsPDF();
      let y = 10;
      let x = 20;
      doc.text(cy.getElementById(0).style('content'), 50, y);
      y+=10;
      cy.nodes().forEach(function(node){
        if(node.data('id')!=0){
          doc.text(node.data('type'), 10, y);
          y+=10;
          doc.text(node.style('content') + ': ' + node.data('description'), x, y);
          y+=10;  
        }
        
      });
      doc.save('description.pdf');
    }
  /*  $('#pdf').on('click', function(){
      var doc = new jsPDF()
      doc.text('Hello world!', 10, 10)
      doc.save('descriptions.pdf')
    });  */
    $('#update').on('click', function (){
      let nodeDescription = $("#recipient-name").val();
      //alert(nodeDescription);
      cy.getElementById(selectedNode).data("description", nodeDescription);
      $('#descriptionModal').modal('hide');
    });
    function openAltModel(){
      let nivelNode = cy.getElementById(selectedNode).data("nivel");
      if (nivelNode != 2){
        alert("This node isn't an alternative");
      } 
      else{
        alert("Redirecting to Alternative Model");
        openPage = function(){
          //$_SESSION['alternativeNode'] = cy.getElementById(selectedNode);
          location.href = "modeloAlt.php?Key="+cy.getElementById(selectedNode);
        }
        //javascript:window.location.href="modeloAlt.php";
        javascript:openPage();
      }
    }
    //$("#add").on('click', add());
     
    /*function remove(){
      var idAtual = cy.getElementById(selectedNode).data("id");
      var arestas = cy.elements('edge[source=idAtual]');
      var temFilho = 0;
      if(cy.getElementById(selectedNode).data("nivel") == 0){
        //alert("Você não pode remover a raiz!");
        alert("Unable to remove parents!");
      }else if(arestas!==undefined){
        alert("Voce so pode remover folhas");
      }
      else{
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
        //cy.getElementById(selectedNode).style("background-color","#000000");
      }
    }*/
    $("#edit").on ("click",function (){
      let idText = $("#nodeRename").val();
      cy.getElementById(selectedNode).data("idNome", idText);
      $('#renameNodeModal').modal('hide');
      $('#renameNodeModal').find('.modal-body input').val("")
    });

    function center(){
      cy.fit();
    }

    $('#descriptionModal').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget) // Button that triggered the modal
      var recipient = button.data('whatever') // Extract info from data-* attributes
      var text = cy.getElementById(selectedNode).data("description");
      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      var modal = $(this)
      modal.find('.modal-title').text('Description of ' + cy.getElementById(selectedNode).data("idNome"))
      modal.find('.modal-body input').val(text)
    });

    $('#createNodeModal').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget) // Button that triggered the modal
      var recipient = button.data('whatever') // Extract info from data-* attributes
      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      var modal = $(this)
      modal.find('.modal-title').text('Creating a new node')
    });

    $('#renameNodeModal').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget) // Button that triggered the modal
      var recipient = button.data('whatever') // Extract info from data-* attributes
      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      var modal = $(this)
      modal.find('.modal-title').text('Renaming a node')
    });