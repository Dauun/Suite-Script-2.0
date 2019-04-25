/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

 define(['N/record'], function(record){

   function beforeLoad(context){
     if (context.type === context.UserEventType.VIEW){
       log.debug({
         title : "hola",
         details : "Mi mensaje"
       });
     } else {
       log.debug({
         title : "adios",
         details : "Mensaje"
       });
     }
   }

   return {
     beforeLoad : beforeLoad
   };
 });
