



var MVCFE = MVCFE || {};


MVCFE.DomPreparation = function(context) {
    this.setupEnv();
    this.readyDomDialog();
  }

MVCFE.DomPreparation.prototype.setupEnv = function() {

    if (typeof jquery === 'function') {} else {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js";
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(s);
    }
    if (typeof JSON === 'object' && typeof JSON.stringify === 'function') {} else {
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/json2/20121008/json2.min.js", winHasJSON);
    }
};


MVCFE.DomPreparation.prototype.readyDomDialog = function() {
  this.overlay =  document.createElement("div");
  $(this.overlay).attr("id", "passport-loading");
  $(this.overlay).attr('style','visibility: hidden; position: fixed;left: 0px;top: 0px; width:100%;height:100%;text-align:center;z-index: 999; background-color:rgba(0,0,0,0.5);');

  $(this.overlay).detach();
  $("body").prepend(this.overlay);
  $("html, body").animate({
    scrollTop: 0
}, 600);
  this.overlay.style.visibility = "visible";
};




MVCFE.Event = function(data, context) {

   MVCFE.debug = MVCFE.debug || false;


  if (MVCFE.debug) console.log('Incoming Data:');
  if (MVCFE.debug) console.log(data);

if (typeof data !== undefined) this.callbackData = data ;

    this.evaluateType();

    if (this.typeName!='unknown') {
    this.createRequest();
    this.processAsyncRequest();
  } else {
   new  MVCFE.TransactionFailure(this, context);
  }
};

MVCFE.Event.prototype.evaluateType = function() {
    this.typeName = 'unknown';

       if (MVCFE.debug)  console.log('Method scope info, evaluateType:');
     if (MVCFE.debug)   console.log(this);

    try {
        if (typeof this.callbackData !== undefined
            && this.callbackData.__action == 'rC_Connect.Campaign_DesignForm.upsertData')
            this.typeName = "rc_connect";
    } catch (e) {
      if (MVCFE.debug)   console.log('Exception' + e);
    }

};


MVCFE.Event.prototype.createRequest = function() {
    if (MVCFE.debug)  console.log('Method scope info, createRequest:');
   if (MVCFE.debug)  console.log(this);
    switch(this.typeName) {
        case 'rc_connect':
// Overwrite and delete the CC number immediately
this.callbackData.rc_connect__payment_method_card_number__c = null;
delete this.callbackData.rc_connect__payment_method_card_number__c;
this.provisionRequestParams = {};
this.provisionRequestParams.token = this.callbackData.rc_connect__batch_upload_public_token__c;
this.provisionRequestParams.t = this.callbackData.rc_connect__giving_transaction_id__c;
this.provisionRequestParams.e = this.callbackData.rc_connect__contact_1_email__c;
break;

default:
context.error = 'unknown provisioning event';
}
};

MVCFE.Event.prototype.processAsyncRequest = function() {
    var passEvent = this;
    if (true === context.passportEnabled ) {
        $.ajax({
            url: context.provisioningEndpoint,
            data: this.provisionRequestParams,
            method: "GET",
        })
        .done(function(json) {
            myResult = new MVCFE.ProvisioningResult(passEvent, json, context);
        })
        .fail(function(e) {
            context.error = e;
            var na;
            myResult = new MVCFE.ProvisioningResult(this, na , context);
        });
    }
};



/* ProvisioningResult is the recipient of the originating
Event data and related AJAX response data */

MVCFE.ProvisioningResult = function(ev, j, context) {
    var trackLabel = context.callsign +  ' Provisioning Complete';
try {
    this.response = JSON.parse(j);
    this.dialog = {};
    this.dialog.dialogHeader = this.response.dialogHeader;
    this.dialog.dialogMessage = this.response.dialogMessage;
    this.dialog.nextUrl = this.response.nextUrl;
    this.dialog.buttonLabel = this.response.buttonLabel ? this.response.buttonLabel : 'Contact Support' ;

    this.jsonResponseString= j;
    this.evaluateResult();

    context.event = ev;
    context.result = this;
  if (MVCFE.debug)   console.log(this.response);
    if (typeof this.response!== undefined && this.response.provisionSuccess) {} else {

 analytics.track(context.callsign +  ' Provisioning Failed', context);

    }

} catch (e) {

    context.error = e;
   analytics.track(context.callsign +  ' Provisioning Error', context);

    this.dialog = {
        dialogHeader: "There was a problem completing your request",
        dialogMessage:  "Sorry, there was a problem creating your account. Please contact our support department.<br/> " + context.supportPhone,
        buttonLabel : "Contact Support",
        nextUrl :   context.supportUrl
    };

} finally {

    analytics.track(context.callsign +  ' Provisioning Complete', context);
    this.showDialog();
}
//console.log(this);

}

MVCFE.ProvisioningResult.prototype.evaluateResult = function() {
    if (typeof this.response === undefined ) {
       this.dialog = {
        dialogHeader: "There was a problem completing your request",
        dialogMessage:  "Sorry, there was a problem creating your account. Please contact our support department.<br/> " + context.supportPhone,
        buttonLabel : "Contact Support",
        nextUrl :   context.supportUrl
    };
}
this.showDialog();
        };

        MVCFE.ProvisioningResult.prototype.showDialog = function() {
            var loading = document.getElementById('passport-loading');
           this.overlayContainer = document.createElement("div");
           $(this.overlayContainer)
           .css('display','block')
           .css('position','fixed')
           .css('top',0)
           .css('left',0)
           .css('width',"100%")
           .css('height',"100%")
           .css('text-align',"center")
           .css('z-index',1000);

           this.overlayContent   = document.createElement("div");
           $(this.overlayContent).html("<div><img src='" + context.logoUrl + "' style='max-width:100%; height:auto' /><h3> " + this.dialog.dialogHeader + " </h3><p> " + this.dialog.dialogMessage + " </p> <a style='background:" + context.accentColor + "; border-color:" + context.accentColor + "' class='btn btn-primary btn-lg' href='" + this.dialog.nextUrl + "' target='_blank'  >" + this.dialog.buttonLabel + "</a></div>");
            $(this.overlayContent)
            .css('display','block')
           .css('position','relative')
           .css('background','white')
           .css('top',0)
           .css('left',0)
           .css('width',"100%")
           .css('max-width',"600px")
           .css('padding',"2em")
           .css('border-radius',".3em")

           .css('margin',"10% auto")
           .css('z-index',1001);
           $(this.overlayContainer).prepend(this.overlayContent);
           $("body").prepend(this.overlayContainer);
           //$(loading).css('display', 'none');

       };


MVCFE.TransactionFailure = function(ev) {
    var trackLabel = context.callsign + ' Transaction Failed';
    var responseObj = {dialogHeader: 'Transaction Incomplete',
                     dialogMessage: 'Sorry, we were unable to complete your donation in order to complete your ' + context.callsign + ' Passport account setup.',
                     nextUrl: context.supportUrl,
                     buttonLabel: 'Contact Support'
                    };

    try {
    this.response = responseObj;
    this.dialog = {};
    this.dialog.dialogHeader = this.response.dialogHeader;
    this.dialog.dialogMessage = this.response.dialogMessage;
    this.dialog.nextUrl = this.response.nextUrl;
    this.dialog.buttonLabel = this.response.buttonLabel ? this.response.buttonLabel : 'Contact Support' ;
    this.evaluateResult();
    this.showDialog();
    context.event = ev;
    context.result = this;
   if (MVCFE.debug)  console.log(this.response);
    if (typeof this.response!== undefined && this.response.provisionSuccess) {} else {
        analytics.track(context.callsign +  ' Provisioning Failed', context);
}
} catch (e) {

    context.error = e;
   analytics.track(context.callsign +  ' Provisioning Error', context);

} finally {

    analytics.track(context.callsign +  ' Provisioning Complete', context);

}
//console.log(this);

}


       function winHasJSON(obj) {
        var ret;
        try {
            ret = JSON.stringify(obj);
        } catch (err) {
// Rollbar.error("JSON.stringify failed: ", err);
}
return ret;
}







