
var context = {
    callsign : "KQED",
    provisioningEndpoint : "https://full-kqed-sandbox.cs2.force.com/donate/services/apexrest/v1.0/provision/",
    passportEnabled : true,
    overlayEnabled : true,
    backgroundImage: "url('https://dun96pyxwe2yl.cloudfront.net/img/marketing/768/ballerinas.png')",
    stationContact: "http://www.kqed.org/support/membership/help/passport-faq.jsp",
    supportUrl: "http://support.pbs.org",
    supportPhone: "+1 415-942-8804",
    accentColor: "rgb(244, 88, 27)",
    logoUrl: "https://full-kqed-sandbox.cs2.force.com/donate/resource/1470600684000/KQED_PassportLogo"
};

var spinOpts = {
  lines: 15 // The number of lines to draw
, length: 22 // The length of each line
, width: 11 // The line thickness
, radius: 27 // The radius of the inner circle
, scale: 1.25 // Scales overall size of the spinner
, corners: 0 // Corner roundness (0..1)
, color: '#f4581b' // #rgb or #rrggbb or array of colors
, opacity: 0.05 // Opacity of the lines
, rotate: 59 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1 // Rounds per second
, trail: 60 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
}