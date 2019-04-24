/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */

 define(['N/search', 'N/runtime', 'N/record'], function(searchAPI, runtimeAPI, recordAPI){
 	
 	function getData(){

 		var clientId = runtimeAPI.getCurrentScript().getParameter({
 			name: 'custscript_c_client_id_said' //Parámetro
 		});

 		log.debug('ClientID: ', clientId);
 		var idCollection = [];
 		if(clientId){
 			searchAPI.create({
 				type: 'salesorder',
 				filters: ['entity', 'anyof', clientId]
 			}).run().each(function(currentRow){
 				idCollection.push(currentRow.id);
 				return true;
 			});
 		}
 		return idCollection;
 	}

 	function execute(context){
 		var currentScript = runtimeAPI.getCurrentScript();
 		log.debug('Invocation Type: ', context.type);
 		var colletionId = getData();
 		log.debug('COLLECTION', colletionId);
 		var total = colletionId.length;
 		var x = 0;
 		colletionId.forEach(function(currentId){
 			try{
 				var currentSalesOrder = recordAPI.load({
 					type: 'salesorder',
 					id: currentId
 				});
 				log.debug('SALESORDER #' + currentId, currentSalesOrder);
 				currentSalesOrder.save();
 			} catch(error) {
 				log.debug('ERROR SALES ORDER', error.message);
 			}
 			x++;
 			currentScript.percentComplete = (x * 100)/total;
 		});
 	}

 	return {
        execute: execute
    }
 });