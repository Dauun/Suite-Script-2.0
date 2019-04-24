/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */

define(['N/runtime', 'N/search', 'N/record'], function (runtimeAPI, searchAPI, recordAPI){
    function getData(context){
        
        var collectionClientID = runtimeAPI.getCurrentScript().getParameter({
                name:'custscriptclientids'
            }),
            collectionSalesOrder = [];

        if(collectionClientID) {
            searchAPI.create({
                type: 'salesorder',
                filters: [['entity', 'anyof', collectionClientID.split(',')], 'AND',
                        ['mainline', 'is', 'T']],
                columns:['tranid', 'trandate', 'entity', 'total', 'subsidiary']
            }).run().each(function (currentRow){
                collectionSalesOrder.push({
                    id: currentRow.id,
                    document: currentRow.getValue({ name:'tranid' }),
                    date: currentRow.getValue({ name: 'trandate' }),
                    customer: currentRow.getText({ name: 'entity' }),
                    customerId: currentRow.getValue({ name: 'entity' }),
                    total: currentRow.getValue({ name: 'total' }),
                    subsidiary: currentRow.getValue({ name: 'subsidiary' })
                });
                return true;
            });
            log.debug("METRIC_DATA", runtimeAPI.getCurrentScript().getRemainingUsage());
            return collectionSalesOrder;
        }

        return [];
    }

    function map(context){
        var salesOrder = JSON.parse(context.value);
        recordAPI.load({
            type:'salesorder',
            id: salesOrder.id
        });
        context.write({
            key: salesOrder.customerId,
            value: salesOrder
        });
        log.debug("METRIC_MAP", runtimeAPI.getCurrentScript().getRemainingUsage());
    }

    // SHUFFLE

    function reduce(context){
        var collectionSalesOrder = context.values;
        log.debug("INVOICES", 
                "CUSOMER ID: " + context.key + " COLLECTION: " + JSON.stringify(collectionSalesOrder));
        recordAPI.load({
            type:'customer',
            id: context.key
        });
        context.write({
            key: 1,
            value: collectionSalesOrder
        });
        log.debug("METRIC_REDUCE", runtimeAPI.getCurrentScript().getRemainingUsage());
    }

    function summarize(context){
        context.output.iterator().each(function (key, value){
            
            var array = JSON.parse(value);
            log.debug("GROUP_NO", array.length);
            log.debug("REDUCE_KEY",  key);
            return true;
        });
        log.debug("INPUT_ERROR", context.inputSummary.error);
        context.mapSummary.errors.iterator().each(function (key, mapError){
            log.debug("MAP_ERROR", "ERROR IN(" + key + "): " + mapError);
        });
        context.reduceSummary.errors.iterator().each(function (key, reduceError){
            log.debug("REDUCE_ERROR", "ERROR IN(" + key + "): " + reduceError);
        });
        log.debug("METRIC_SUMM", runtimeAPI.getCurrentScript().getRemainingUsage());
    }

    return {
        getInputData: getData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});