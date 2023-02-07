/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup.ts":
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/
/***/ (function() {

// Add listeners to the elements in popup.html to update the sync storage when changes are made
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Helper methods
/*async function getUsernameForToken(token: string) : Promise<string | null> {
  // If there's no token, the username has to be null
  if (token === '') {
    return null
  }
  const headers : HeadersInit = {Authorization: `token ${token}`}
  const url = 'https://api.github.com/user'
  let username : string | null = null
  try {
    const response = await fetch(url, {headers})
    if (response.ok) {
      const data = await response.json()
      username = data.login
      console.log(username)
    }
    // If not okay, we'll leave the username as null
  }
  catch (e) {
    // If there's an error then the token is likely invalid
  }
  return username
}

// Get the old data of both of these values
chrome.storage.sync.get(['showLegend', 'personalAccessToken', 'personalAccessTokenOwner'], (result: ISyncData) => {
  setup(result)
})*/
chrome.storage.sync.get(['personalAccessToken'], (result) => {
    setup(result);
});
function setup(result) {
    return __awaiter(this, void 0, void 0, function* () {
        //const chartLegendCheck : HTMLInputElement = document.getElementById('show-legend') as HTMLInputElement
        const personalTokenInput = document.getElementById('personal-access-token');
        //const showLegend = result.showLegend || false
        const personalAccessToken = result.personalAccessToken || '';
        const personalAccessTokenOwner = result.personalAccessTokenOwner || '';
        // Set up the initial values of the inputs based on the storage read values
        //chartLegendCheck.checked = showLegend
        personalTokenInput.value = personalAccessToken;
        // Add event listeners to get the values when they change
        /*chartLegendCheck.addEventListener('click', () => {
          // Store the new value of the checkbox in sync storage
          chrome.storage.sync.set({showLegend: chartLegendCheck.checked})
        }, false)
      */
        personalTokenInput.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
            // Get the username for the Token as well, this will allow private repos to be included on the user's own page
            const token = personalTokenInput.value;
            //const username = await getUsernameForToken(token)
            const storedData = {
                personalAccessToken: token,
                //personalAccessTokenOwner: username,
            };
            console.log('setting data', storedData);
            chrome.storage.sync.set(storedData);
        }), false);
        // Now enable the inputs for user input
        //chartLegendCheck.disabled = false
        personalTokenInput.disabled = false;
    });
}
// Set up a listener for a click on the link to open a tab to generate a token
const tokenUrl = 'https://github.com/settings/tokens/new?description=GitHub%20User%20Languages&scopes=repo';
document.getElementById('get-token').addEventListener('click', () => {
    chrome.tabs.create({ url: tokenUrl });
}, false);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/popup.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvLi9zcmMvcG9wdXAudHMiLCJ3ZWJwYWNrOi8vZ2l0aHViLXVzZXItbGFuZ3VhZ2VzL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0EsMkJBQTJCLCtEQUErRCxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlHO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyx3QkFBd0IsTUFBTTtBQUMvRDtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsUUFBUTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMscUNBQXFDO0FBQ3hFLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnQkFBZ0I7QUFDeEMsQ0FBQzs7Ozs7Ozs7VUM3RUQ7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJwb3B1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEFkZCBsaXN0ZW5lcnMgdG8gdGhlIGVsZW1lbnRzIGluIHBvcHVwLmh0bWwgdG8gdXBkYXRlIHRoZSBzeW5jIHN0b3JhZ2Ugd2hlbiBjaGFuZ2VzIGFyZSBtYWRlXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbi8vIEhlbHBlciBtZXRob2RzXG4vKmFzeW5jIGZ1bmN0aW9uIGdldFVzZXJuYW1lRm9yVG9rZW4odG9rZW46IHN0cmluZykgOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgLy8gSWYgdGhlcmUncyBubyB0b2tlbiwgdGhlIHVzZXJuYW1lIGhhcyB0byBiZSBudWxsXG4gIGlmICh0b2tlbiA9PT0gJycpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIGNvbnN0IGhlYWRlcnMgOiBIZWFkZXJzSW5pdCA9IHtBdXRob3JpemF0aW9uOiBgdG9rZW4gJHt0b2tlbn1gfVxuICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2VyJ1xuICBsZXQgdXNlcm5hbWUgOiBzdHJpbmcgfCBudWxsID0gbnVsbFxuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7aGVhZGVyc30pXG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICB1c2VybmFtZSA9IGRhdGEubG9naW5cbiAgICAgIGNvbnNvbGUubG9nKHVzZXJuYW1lKVxuICAgIH1cbiAgICAvLyBJZiBub3Qgb2theSwgd2UnbGwgbGVhdmUgdGhlIHVzZXJuYW1lIGFzIG51bGxcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIC8vIElmIHRoZXJlJ3MgYW4gZXJyb3IgdGhlbiB0aGUgdG9rZW4gaXMgbGlrZWx5IGludmFsaWRcbiAgfVxuICByZXR1cm4gdXNlcm5hbWVcbn1cblxuLy8gR2V0IHRoZSBvbGQgZGF0YSBvZiBib3RoIG9mIHRoZXNlIHZhbHVlc1xuY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoWydzaG93TGVnZW5kJywgJ3BlcnNvbmFsQWNjZXNzVG9rZW4nLCAncGVyc29uYWxBY2Nlc3NUb2tlbk93bmVyJ10sIChyZXN1bHQ6IElTeW5jRGF0YSkgPT4ge1xuICBzZXR1cChyZXN1bHQpXG59KSovXG5jaHJvbWUuc3RvcmFnZS5zeW5jLmdldChbJ3BlcnNvbmFsQWNjZXNzVG9rZW4nXSwgKHJlc3VsdCkgPT4ge1xuICAgIHNldHVwKHJlc3VsdCk7XG59KTtcbmZ1bmN0aW9uIHNldHVwKHJlc3VsdCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIC8vY29uc3QgY2hhcnRMZWdlbmRDaGVjayA6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hvdy1sZWdlbmQnKSBhcyBIVE1MSW5wdXRFbGVtZW50XG4gICAgICAgIGNvbnN0IHBlcnNvbmFsVG9rZW5JbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwZXJzb25hbC1hY2Nlc3MtdG9rZW4nKTtcbiAgICAgICAgLy9jb25zdCBzaG93TGVnZW5kID0gcmVzdWx0LnNob3dMZWdlbmQgfHwgZmFsc2VcbiAgICAgICAgY29uc3QgcGVyc29uYWxBY2Nlc3NUb2tlbiA9IHJlc3VsdC5wZXJzb25hbEFjY2Vzc1Rva2VuIHx8ICcnO1xuICAgICAgICBjb25zdCBwZXJzb25hbEFjY2Vzc1Rva2VuT3duZXIgPSByZXN1bHQucGVyc29uYWxBY2Nlc3NUb2tlbk93bmVyIHx8ICcnO1xuICAgICAgICAvLyBTZXQgdXAgdGhlIGluaXRpYWwgdmFsdWVzIG9mIHRoZSBpbnB1dHMgYmFzZWQgb24gdGhlIHN0b3JhZ2UgcmVhZCB2YWx1ZXNcbiAgICAgICAgLy9jaGFydExlZ2VuZENoZWNrLmNoZWNrZWQgPSBzaG93TGVnZW5kXG4gICAgICAgIHBlcnNvbmFsVG9rZW5JbnB1dC52YWx1ZSA9IHBlcnNvbmFsQWNjZXNzVG9rZW47XG4gICAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgdG8gZ2V0IHRoZSB2YWx1ZXMgd2hlbiB0aGV5IGNoYW5nZVxuICAgICAgICAvKmNoYXJ0TGVnZW5kQ2hlY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgLy8gU3RvcmUgdGhlIG5ldyB2YWx1ZSBvZiB0aGUgY2hlY2tib3ggaW4gc3luYyBzdG9yYWdlXG4gICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoe3Nob3dMZWdlbmQ6IGNoYXJ0TGVnZW5kQ2hlY2suY2hlY2tlZH0pXG4gICAgICAgIH0sIGZhbHNlKVxuICAgICAgKi9cbiAgICAgICAgcGVyc29uYWxUb2tlbklucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIC8vIEdldCB0aGUgdXNlcm5hbWUgZm9yIHRoZSBUb2tlbiBhcyB3ZWxsLCB0aGlzIHdpbGwgYWxsb3cgcHJpdmF0ZSByZXBvcyB0byBiZSBpbmNsdWRlZCBvbiB0aGUgdXNlcidzIG93biBwYWdlXG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IHBlcnNvbmFsVG9rZW5JbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIC8vY29uc3QgdXNlcm5hbWUgPSBhd2FpdCBnZXRVc2VybmFtZUZvclRva2VuKHRva2VuKVxuICAgICAgICAgICAgY29uc3Qgc3RvcmVkRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwZXJzb25hbEFjY2Vzc1Rva2VuOiB0b2tlbixcbiAgICAgICAgICAgICAgICAvL3BlcnNvbmFsQWNjZXNzVG9rZW5Pd25lcjogdXNlcm5hbWUsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NldHRpbmcgZGF0YScsIHN0b3JlZERhdGEpO1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoc3RvcmVkRGF0YSk7XG4gICAgICAgIH0pLCBmYWxzZSk7XG4gICAgICAgIC8vIE5vdyBlbmFibGUgdGhlIGlucHV0cyBmb3IgdXNlciBpbnB1dFxuICAgICAgICAvL2NoYXJ0TGVnZW5kQ2hlY2suZGlzYWJsZWQgPSBmYWxzZVxuICAgICAgICBwZXJzb25hbFRva2VuSW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9KTtcbn1cbi8vIFNldCB1cCBhIGxpc3RlbmVyIGZvciBhIGNsaWNrIG9uIHRoZSBsaW5rIHRvIG9wZW4gYSB0YWIgdG8gZ2VuZXJhdGUgYSB0b2tlblxuY29uc3QgdG9rZW5VcmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL3NldHRpbmdzL3Rva2Vucy9uZXc/ZGVzY3JpcHRpb249R2l0SHViJTIwVXNlciUyMExhbmd1YWdlcyZzY29wZXM9cmVwbyc7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2V0LXRva2VuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiB0b2tlblVybCB9KTtcbn0sIGZhbHNlKTtcbiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG5fX3dlYnBhY2tfbW9kdWxlc19fW1wiLi9zcmMvcG9wdXAudHNcIl0oKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=