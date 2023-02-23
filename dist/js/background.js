/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
var serverhost = 'http://127.0.0.1:8000';
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var url = serverhost + '/issuebot/get_issue_info/?topic=' + encodeURIComponent(request.topic);
    fetch(url)
        .then(response => response.json())
        .then(response => sendResponse({ farewell: response }))
        .catch(error => console.log(error));
    return true; // Will respond asynchronously.
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Jc3N1ZSBJbmZvcm1hdGlvbiBUeXBlIERldGVjdG9yLy4vc3JjL2JhY2tncm91bmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLHFCQUFxQjtBQUM3RDtBQUNBLGdCQUFnQjtBQUNoQixDQUFDIiwiZmlsZSI6ImJhY2tncm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc2VydmVyaG9zdCA9ICdodHRwOi8vMTI3LjAuMC4xOjgwMDAnO1xuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgIHZhciB1cmwgPSBzZXJ2ZXJob3N0ICsgJy9pc3N1ZWJvdC9nZXRfaXNzdWVfaW5mby8/dG9waWM9JyArIGVuY29kZVVSSUNvbXBvbmVudChyZXF1ZXN0LnRvcGljKTtcbiAgICBmZXRjaCh1cmwpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gc2VuZFJlc3BvbnNlKHsgZmFyZXdlbGw6IHJlc3BvbnNlIH0pKVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpKTtcbiAgICByZXR1cm4gdHJ1ZTsgLy8gV2lsbCByZXNwb25kIGFzeW5jaHJvbm91c2x5LlxufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9