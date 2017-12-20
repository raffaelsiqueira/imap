
		// // let i = 0;
		// var pressedShift = false;
		
		// $(document).keyup(function(e){
		// 	if(e.which == 16) pressedShift = false;
		// })
		
		// $(document).keydown(function(e){
		// 	if(e.which == 16) pressedShift = true;
		// 	if((e.which == 67 || e.keyCode == 67) && pressedShift == true) {
		// 		$('#createNodeModal').modal('show');
		// 	}
		// })
		// $(document).keydown(function(e){
		// 	if(e.which == 16) pressedShift = true;
		// 	if((e.which == 82 || e.keyCode == 82) && pressedShift == true) {
		// 		$('#renameNodeModal').modal('show');
		// 	}
		// })
		// $(document).keydown(function(e){
		// 	if(e.which == 46 || e.keyCode == 46){
		// 		remove();
		// 	}
		// })
		// $(document).keydown(function(e){
		// 	if(e.which == 16) pressedShift = true;
		// 	if((e.which == 77 || e.keyCode == 77) && pressedShift == true) {
		// 		center();
		// 	}
		// })
		// $(document).keydown(function(e){
		// 	if(e.which == 16) pressedShift = true;
		// 	if((e.which == 68 || e.keyCode == 68) && pressedShift == true) {
		// 		$('#descriptionModal').modal('show');
		// 	}
		// })
		// $('#update').on('click', function (){
		// 	let nodeDescription = $("#recipient-name").val();
		// 	cy.getElementById(selectedNode).data("description", nodeDescription);
		// 	$('#descriptionModal').modal('hide');
		// });
		// //let level = 0;
		// //console.log(cy.getElementById(selectedNode).children());
		// $("#add").on('click',function (){
		// 		let idText = $("#nodeName").val();
		// 		let nivelPai = cy.getElementById(selectedNode).data("nivel");
				
		// 		if (idText == ''){
		// 			alert("Write a name for a node!");
		// 		}else{
		// 			if ((!(cy.nodes().length == 0)) && (cy.getElementById(selectedNode).data("nivel") == 0) ){
		// 				cy.add([
		// 					{ group: "nodes", data: {id:  idText, idNome:idText, level: cy.getElementById(selectedNode).nivel + 1  }, position: {x: cy.getElementById(selectedNode).position("x")+50, y: cy.getElementById(selectedNode).position("y")+50}},
		// 					{ group: "edges", data: { id: 'edge'+i, source: selectedNode, target: idText}}
		// 				]);
		// 				cy.getElementById(idText).data("nivel", nivelPai + 1);
		// 				//console.log(cy.getElementById(idText).data("nivel"));
		// 				i++;
		// 				verificaCreateRadio(idText);
		// 				$('#createNodeModal').modal('hide');
		// 			    $('#createNodeModal').find('.modal-body input').val("");
		// 			}else{
		// 				alert("Only the main node can be branched");
		// 			}
		// 		}
		// 		var nodeLevel = cy.getElementById(idText).data("nivel");
		// 		if(nodeLevel == 1){
		// 			cy.getElementById(idText).style('shape', 'roundrectangle');
		// 			cy.getElementById(idText).style("background-color","#a9a9a9");
		// 		}
		// 	});
		// function verificaCreateRadio(node){
		// 		alert($('input[name="ImpVal"]:checked').val());
		// 		cy.getElementById(node).data("valor", $('input[name="ImpVal"]:checked').val());
		// 		addData(node, cy.getElementById(node).data("valor"));
		// 		$('input[name="ImpVal"]').attr('checked',false);
		// }
		
		// function remove(){
		// 	var idAtual = cy.getElementById(selectedNode).data("id");
		// 	var arestas = cy.elements('edge[source=idAtual]');
		// 	var temFilho = 0;
		// 	if(cy.getElementById(selectedNode).data("nivel") == 0){
		// 		//alert("Você não pode remover a raiz!");
		// 		alert("Unable to remove the main node!");
		// 	}/*else if(arestas!==undefined){
		// 		alert("Voce so pode remover folhas");
		// 	}*/
		// 	else{
		// 		let saveNode = selectedNode;
		// 		let passow = false;
		// 		cy.edges().forEach(function (edge){
		// 			if(edge.source().id() == selectedNode){
		// 				alert("Voce só pode remover folhas");
		// 				temFilho=1;
		// 				return;
		// 			}
		// 		});
		// 		cy.edges().forEach(function (edge){
		// 		if(edge.target().id() == selectedNode){
		// 			selectedNode = edge.source().id();
		// 			passow = true;
		// 		}
		// 	});
		// 		if(temFilho==0){
		// 			cy.getElementById(saveNode).remove();
		// 		}
				
		// 		if (!passow){
		// 			if (!(cy.nodes().length == 0)){
		// 				selectedNode = cy.nodes()[0].id();
		// 			}
		// 		}
		// 		//cy.getElementById(selectedNode).style("background-color","#000000");
		// 	}
		// }
		// $("#edit").on ("click",function (){
		// 	let idText = $("#textBoxEdit").val();
		// 	cy.getElementById(selectedNode).data("idNome", idText);
		// 	$('#renameNodeModal').modal('hide');
		// 	$('#renameNodeModal').find('.modal-body input').val("")
		// });
		// function center(){
		// 	cy.fit();
		// }
		// $('#descriptionModal').on('show.bs.modal', function (event) {
		//   var button = $(event.relatedTarget) // Button that triggered the modal
		//   var recipient = button.data('whatever') // Extract info from data-* attributes
		//   var text = cy.getElementById(selectedNode).data("description");
		//   // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
		//   // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
		//   var modal = $(this)
		//   modal.find('.modal-title').text('Description of ' + cy.getElementById(selectedNode).data("idNome"))
		//   modal.find('.modal-body input').val(text)
		// });
		// $('#createNodeModal').on('show.bs.modal', function (event) {
		//   var button = $(event.relatedTarget) // Button that triggered the modal
		//   var recipient = button.data('whatever') // Extract info from data-* attributes
		//   // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
		//   // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
		//   var modal = $(this)
		//   modal.find('.modal-title').text('Creating a new node')
		// });
		// $('#renameNodeModal').on('show.bs.modal', function (event) {
		//   var button = $(event.relatedTarget) // Button that triggered the modal
		//   var recipient = button.data('whatever') // Extract info from data-* attributes
		//   // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
		//   // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
		//   var modal = $(this)
		//   modal.find('.modal-title').text('Renaming a node')
		// });