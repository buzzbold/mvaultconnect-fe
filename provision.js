

var MVCFE = MVCFE || {};




MVCFE.provisionAccess = function(framework, data) {



}

MVCFE.eventData = function (data) {
    this.data = data;



}


MVCFE.event = {
    typeName : "unknown",
    handleEvent: function (obj, fn) {
        this.evalType(obj);
    },
    evalType: function(obj) {

        try {
            if (typeof obj !== undefined && obj.__action == "rc_connect.Campaign_DesignForm.upsertData")
                this.typeName = "rc_connect";
        } catch (e) {

        }

    }

}







