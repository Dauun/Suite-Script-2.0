/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */


 define(['N/url'], function(urlAPI){

   function beforeLoad(context){
     if (context.type == context.UserEventType.VIEW){
       var currentForm = context.form;
       var subsidiaryId = context.newRecord.getValue({ fieldId : 'subsidiary' });

       var output = urlAPI.resolveRecord({
         recordType: 'subsidiary',
         recordId: subsidiaryId,
         isEditMode: false
      });

      log.debug(output);

       currentForm.addButton({
         id: 'custpage_testbutton2',
         label: 'Subsidiary Link',
         functionName : "window.open('" + output + "');"
       });

       //inicia botón para asignación #7
       currentForm.addButton({
         id: 'custpage_testbutton_http',
         label: 'HTTP',
         functionName : "createHistorialRec()"
       });
       currentForm.clientScriptModulePath = './test_script.js';
       //termina botón para asignación #7
     }
   }

   return {
     beforeLoad : beforeLoad
   };
 });
