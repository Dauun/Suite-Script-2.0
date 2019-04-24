/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
 define(['N/task','N/runtime'],function(taskAPI,runtimeAPI) {


 	function onRequest(context){
 		if(context.request.method === 'GET'){
 			var scheduledDeploymentId = runtimeAPI.getCurrentScript().getParameter({
 				name: 'custscript_task_deplyment_id_said'
 			});
 			 var testTask = taskAPI.create({
 			 	taskType: taskAPI.TaskType.SCHEDULED_SCRIPT,
 			 	scriptId: 'customscript_said_schedule_ch', //id del script
 			 	deploymentId: scheduledDeploymentId,
 			 	params: {
 			 		custscript_c_client_id_said: context.request.parameters.client
 			 	}
 			 });

 			 var currentTaskId = testTask.submit();
 			 var taskStatus = taskAPI.checkStatus(currentTaskId);

 			 log.debug('Tracking ID: ', currentTaskId);
 			 log.debug('Tracking Status: ',taskStatus);
 		}
 	}

 	return{
 		onRequest: onRequest
 	}
 });