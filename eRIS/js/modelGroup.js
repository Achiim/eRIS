/**
 * 
 * 
 *  ****************************************
 *	* Sportstaetten-Reservierungs-System   *
 *	****************************************
 *	
 *	@author		Achim
 *	@version	2016
 *	@copyright 	alle Rechte vorbehalten
 *
 *	@description
 *  Klasse zum Zugriff auf die eRIS-Stammdaten: Gruppe
 * 
 */
   
	class erisGruppe {

		/**
		 * @param name = Bezeichung der erisGruppe
		 * @param farbe = default-Farbe der erisGruppe
		 * 
		 * @description
		 * Konstruktor für eine erisGruppe. 
		 * @example
		 * Aufrufbeispiel: var ah = new erisGruppe('Aktive', '#0a6f80'); 
		 */

		constructor(name, farbe) {
			this.name = name;						// Bezeichnung der erisGruppe
			this.farbe = farbe						// default-Farbe
		}

		view(containerId) {
			this.createTable(containerId);			// generiere äußeres Tabellen-Elemente
			this.createDataGrid();						// generiere easyUI DataGrid-Elemente
			
	    }		
		load (param) {
		    	$.ajax({
		    		type: "GET",
		    		url: 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/group',
		    		dataType: 'json', 
		    		data: $('#dgGruppe').serialize()})
		    	.done(function( responseJson ) {
		    		console.log("ajax done");
		    		console.log(responseJson);
		    		$('#dgGruppe').datagrid('loadData', responseJson.items ); 
		  	    });
		 }
		 loading() {
				$('#dgGruppe').datagrid('loading');
		 }
		 store (param) {
			 var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/group_update/' + param;
			 console.log(url);
		 }
		createTable(containerId) {
			$('<table></table>')					
	        .attr('id', 'dgGruppe')
	        .addClass('Gruppe')
	        .css({'width': '500', 'height': '260'})
	        .appendTo(containerId);
		}
		createDataGrid () {
		    $('#dgGruppe').datagrid({
		    	title: 'Stammdaten: eRIS-Gruppen',
		    	iconCls: 'icon-edit',
		    	rownumbers: true,
				singleSelect: true,
		    	fitColumns: true,
		    	pagination: false,
		    	striped: true,
		        columns:[[
		            {field:'groupId',title:'Gruppe',width:100, editor:'text', sortable: false},
		            {field:'color',title:'Farbe',width:100, editor:'text', sortable: false}
		        ]],
		    	idField: 'groupId',
		    	loadMsg: 'Bitte kurz warten. Daten werden geladen..',
		    	emptyMsg: 'keine Daten vorhanden',
		    	loader: this.load(),
	    		toolbar: [{
	    			iconCls: 'icon-add',
	    			handler: function(){console.log('addrow'); append();}
	    		}, {
    				iconCls: 'icon-remove',
    				handler: function(){console.log('remove'); removeit()}
	    		}, {
    				iconCls: 'icon-reload',
    				handler: function(){console.log('reload'); $('#dgGruppe').remove; eG.view('#groupContainer');}
	    		},'-',{
	    			iconCls: 'icon-help',
	    			handler: function(){console.log('help'); $('.Hilfe').remove(); helpDialog();}
	    		}],
				onClickCell: onClickCell,
	            onEndEdit: function(index,row,changes){
	                console.log("end edit");
	                console.log(index,row,changes);
	                if (changes != null) {
	                	console.log('Änderungen speichern');
	                	var p = row.groupId + '/' + row.color + '/' ;
	                	eG.store(p);
	                }
	            }    
		    })
		    .appendTo('#dgGruppe');
		}			

	} // end class erisGruppe
	
// ********************************************************************************************	
// Help-Dialog
	function helpDialog() {
		$('<div title="Hilfe: Stammdaten-Gruppe"></div>')
	    .attr('id', 'group-help-message')
	    .addClass('Hilfe')
	    .css({'width': '400'})
	    .appendTo('body');
	    
	    $('<p\>')
	    .addClass('Hilfe')
	    .html('Hier werden die eRIS-Gruppen gepflegt.')
	    .appendTo('#group-help-message');
	    
	    $('<p\>')
	    .addClass('Hilfe')
	    .html('Gruppe = Name einer Gruppe, der als Oberbegriff für Teams verwendet wird.')
	    .appendTo('#group-help-message');
	    
	    $('<p\>')
	    .addClass('Hilfe')
	    .html('Farbe = Farbnamen oder Farbcodes, die als Voreinstellung für alles Teams dieser Gruppe verwendet werden soll.')
	    .appendTo('#group-help-message');
	    
	    $('<p\>')
	    .addClass('Hilfe')
	    .html('Farbcodes und Farbnamen sind unter http://www.w3schools.com/colors/colors_names.asp definiert.')
	    .appendTo('#group-help-message');
 
	    $( '#group-help-message').dialog({
	        modal: true
	    });

	}

// ********************************************************************************************	
//	Editor Funktionalität
	
	var editIndex = undefined;
	function onClickCell(index, field){
		if (editIndex != index){
			if (endEditing()){
				$('#dgGruppe').datagrid('selectRow', index)
						.datagrid('beginEdit', index);
				var ed = $('#dgGruppe').datagrid('getEditor', {index:index,field:field});
				if (ed){
					($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
				}
				editIndex = index;
			} else {
				setTimeout(function(){
					$('#dgGruppe').datagrid('selectRow', editIndex);
				},0);
			}
		}
	}
	
	function endEditing(){
		if (typeof editIndex === 'undefined'){return true}
		if ($('#dgGruppe').datagrid('validateRow', editIndex)){
			$('#dgGruppe').datagrid('endEdit', editIndex);
			editIndex = undefined;
			return true;
		} else {
			return false;
		}
	}
	
	function append(){
		if (endEditing()){
			$('#dgGruppe').datagrid('appendRow',{status:'P'});
			editIndex = $('#dgGruppe').datagrid('getRows').length-1;
			$('#dgGruppe').datagrid('selectRow', editIndex)
					.datagrid('beginEdit', editIndex);
		}
	}
	
	function removeit(){
		if (typeof editIndex === 'undefined'){return}		// falls keine Zeile selektiert ist, nichts tun
		var toBeRemoved;
		toBeRemoved = $('#dgGruppe').datagrid('getSelected');
		console.log('removeit');
		console.log(toBeRemoved);
		
		var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/remove_group/' + toBeRemoved.groupId;
		console.log(url);
		
		$('#dgGruppe')
		.datagrid('cancelEdit', editIndex)		// edit-Modus abbrechen
		.datagrid('deleteRow', editIndex);		// Zeile in der Anzeige löschen
		
		editIndex = undefined;
	}
	
	$.extend($.fn.datagrid.methods, {
		editCell: function(jq,param){
			return jq.each(function(){
				var opts = $(this).datagrid('options');
				var fields = $(this).datagrid('getColumnFields',true).concat($(this).datagrid('getColumnFields'));
				for(var i=0; i<fields.length; i++){
					var col = $(this).datagrid('getColumnOption', fields[i]);
					col.editor1 = col.editor;
					if (fields[i] != param.field){
						col.editor = null;
					}
				}
				$(this).datagrid('beginEdit', param.index);
                var ed = $(this).datagrid('getEditor', param);
                if (ed){
                    if ($(ed.target).hasClass('textbox-f')){
                        $(ed.target).textbox('textbox').focus();
                    } else {
                        $(ed.target).focus();
                    }
                }
				for(var i=0; i<fields.length; i++){
					var col = $(this).datagrid('getColumnOption', fields[i]);
					col.editor = col.editor1;
				}
			});
		},
        enableCellEditing: function(jq){
            return jq.each(function(){
                var dg = $(this);
                var opts = dg.datagrid('options');
                opts.oldOnClickCell = opts.onClickCell;
                opts.onClickCell = function(index, field){
                    if (typeof opts.editIndex !== 'undefined'){
                        if (dg.datagrid('validateRow', opts.editIndex)){
                            dg.datagrid('endEdit', opts.editIndex);
                            opts.editIndex = undefined;
                        } else {
                            return;
                        }
                    }
                    dg.datagrid('selectRow', index).datagrid('editCell', {
                        index: index,
                        field: field
                    });
                    opts.editIndex = index;
                    opts.oldOnClickCell.call(this, index, field);
                }
            });
        }
	});

	$(function(){
		$('#dgGruppe').datagrid().datagrid('enableCellEditing');
	})
	



