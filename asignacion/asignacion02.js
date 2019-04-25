/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
 */

define(['N/ui/dialog'], function(dialogAPI){

  /**
  * Conocer el id de un campo custom
  */
  require(['N/record'], function(recordApi){
    function showRecord(){
      var rec = recordApi.load({
        type : 'salesorder',
        id : 176,
        isDynamic : true
      });

      var x = 0;
    }
    showRecord();
  });

  function validate(context){
    var chk_said = context.currentRecord.getValue({fieldId:'custbody_ch_chk_said_asignacion'});
    if( chk_said ) {
      var txt_said = context.currentRecord.getText({fieldId:'custbody_ch_txt_said_asignacion2'});
      if (txt_said === "") {
        dialogAPI.alert({
          title: 'Validación',
          message: 'Debe ingresar un valor'
        });
          return false;
      }
    }
    return true;
  }

  /**
  * Agregar un nuevo campo a sublist
  * Customizations > List, Records & Files > Transactions Line Fields
  * https://debugger.na0.netsuite.com/app/common/custom/columncustfields.nl?whence=
  */
  function validateLine(context){
    if(context.sublistId === 'item'){
      var currentRecord = context.currentRecord;
      var campo = currentRecord.getCurrentSublistValue({
        sublistId : 'item',
        fieldId : '	custcol_ch_said_sublist_campo'
      });
      if (campo === ''){
        dialogAPI.alert({
          title : 'Validación',
          message : 'El campo es requerido'
        });
        return false;
      }
    }
    return true;
  }

  return {
    saveRecord : validate,
    validateLine : validateLine
  };
});
