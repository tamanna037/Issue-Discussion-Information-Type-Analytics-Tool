/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
/* Simple small background script for integrity purposes

  Integrity stuff:
    - Ensure that the sync storage is up to date with the 0.1.9 scheme (store token username)
*/
// Run whenever the extension is installed / updated
/*chrome.runtime.onInstalled.addListener(() => {
  console.log('Running Integrity Tests')
  console.log('Testing that sync storage is up to date (0.1.9)')
  chrome.storage.sync.get(['personalAccessToken', 'personalAccessTokenOwner'], async (result) => {
    // Ensure that the owner is set if the token is set, or set it otherwise
    const personalAccessToken : string = result.personalAccessToken || ''
    const personalAccessTokenOwner : string = result.personalAccessTokenOwner || ''

    if (personalAccessTokenOwner === '' && personalAccessToken !== '') {
      console.log('Data found to not match the structure for 0.1.9. Fixing.')
      const headers : HeadersInit = {Authorization: `token ${personalAccessToken}`}
      const url = 'https://api.github.com/user'
      let username : string | null = null
      try {
        const response = await fetch(url, {headers})
        if (response.ok) {
          const data = await response.json()
          username = data.login
        }
        // If not okay, we'll leave the username as null
      }
      catch (e) {
        // If there's an error then the token is likely invalid
      }
      // Store that back in the sync storage
      chrome.storage.sync.set({personalAccessTokenOwner: username})
    }
  })
})*/
var serverhost = 'http://127.0.0.1:8000';
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var url = serverhost + '/wiki/get_wiki_summary/?topic=' + encodeURIComponent(request.topic);
    //alert(url);
    console.log(url);
    //var url = "http://127.0.0.1:8000/wiki/get_wiki_summary/?topic=%22COVID19%22"	
    fetch(url)
        .then(response => response.json())
        .then(response => sendResponse({ farewell: response }))
        .catch(error => console.log(error));
    return true; // Will respond asynchronously.
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvLi9zcmMvYmFja2dyb3VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFDQUFxQyx3QkFBd0Isb0JBQW9CO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxRQUFRO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLG1DQUFtQztBQUNsRTtBQUNBLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxxQkFBcUI7QUFDN0Q7QUFDQSxnQkFBZ0I7QUFDaEIsQ0FBQyIsImZpbGUiOiJiYWNrZ3JvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogU2ltcGxlIHNtYWxsIGJhY2tncm91bmQgc2NyaXB0IGZvciBpbnRlZ3JpdHkgcHVycG9zZXNcblxuICBJbnRlZ3JpdHkgc3R1ZmY6XG4gICAgLSBFbnN1cmUgdGhhdCB0aGUgc3luYyBzdG9yYWdlIGlzIHVwIHRvIGRhdGUgd2l0aCB0aGUgMC4xLjkgc2NoZW1lIChzdG9yZSB0b2tlbiB1c2VybmFtZSlcbiovXG4vLyBSdW4gd2hlbmV2ZXIgdGhlIGV4dGVuc2lvbiBpcyBpbnN0YWxsZWQgLyB1cGRhdGVkXG4vKmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKCgpID0+IHtcbiAgY29uc29sZS5sb2coJ1J1bm5pbmcgSW50ZWdyaXR5IFRlc3RzJylcbiAgY29uc29sZS5sb2coJ1Rlc3RpbmcgdGhhdCBzeW5jIHN0b3JhZ2UgaXMgdXAgdG8gZGF0ZSAoMC4xLjkpJylcbiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoWydwZXJzb25hbEFjY2Vzc1Rva2VuJywgJ3BlcnNvbmFsQWNjZXNzVG9rZW5Pd25lciddLCBhc3luYyAocmVzdWx0KSA9PiB7XG4gICAgLy8gRW5zdXJlIHRoYXQgdGhlIG93bmVyIGlzIHNldCBpZiB0aGUgdG9rZW4gaXMgc2V0LCBvciBzZXQgaXQgb3RoZXJ3aXNlXG4gICAgY29uc3QgcGVyc29uYWxBY2Nlc3NUb2tlbiA6IHN0cmluZyA9IHJlc3VsdC5wZXJzb25hbEFjY2Vzc1Rva2VuIHx8ICcnXG4gICAgY29uc3QgcGVyc29uYWxBY2Nlc3NUb2tlbk93bmVyIDogc3RyaW5nID0gcmVzdWx0LnBlcnNvbmFsQWNjZXNzVG9rZW5Pd25lciB8fCAnJ1xuXG4gICAgaWYgKHBlcnNvbmFsQWNjZXNzVG9rZW5Pd25lciA9PT0gJycgJiYgcGVyc29uYWxBY2Nlc3NUb2tlbiAhPT0gJycpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdEYXRhIGZvdW5kIHRvIG5vdCBtYXRjaCB0aGUgc3RydWN0dXJlIGZvciAwLjEuOS4gRml4aW5nLicpXG4gICAgICBjb25zdCBoZWFkZXJzIDogSGVhZGVyc0luaXQgPSB7QXV0aG9yaXphdGlvbjogYHRva2VuICR7cGVyc29uYWxBY2Nlc3NUb2tlbn1gfVxuICAgICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vdXNlcidcbiAgICAgIGxldCB1c2VybmFtZSA6IHN0cmluZyB8IG51bGwgPSBudWxsXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge2hlYWRlcnN9KVxuICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICAgICAgdXNlcm5hbWUgPSBkYXRhLmxvZ2luXG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgbm90IG9rYXksIHdlJ2xsIGxlYXZlIHRoZSB1c2VybmFtZSBhcyBudWxsXG4gICAgICB9XG4gICAgICBjYXRjaCAoZSkge1xuICAgICAgICAvLyBJZiB0aGVyZSdzIGFuIGVycm9yIHRoZW4gdGhlIHRva2VuIGlzIGxpa2VseSBpbnZhbGlkXG4gICAgICB9XG4gICAgICAvLyBTdG9yZSB0aGF0IGJhY2sgaW4gdGhlIHN5bmMgc3RvcmFnZVxuICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoe3BlcnNvbmFsQWNjZXNzVG9rZW5Pd25lcjogdXNlcm5hbWV9KVxuICAgIH1cbiAgfSlcbn0pKi9cbnZhciBzZXJ2ZXJob3N0ID0gJ2h0dHA6Ly8xMjcuMC4wLjE6ODAwMCc7XG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgdmFyIHVybCA9IHNlcnZlcmhvc3QgKyAnL3dpa2kvZ2V0X3dpa2lfc3VtbWFyeS8/dG9waWM9JyArIGVuY29kZVVSSUNvbXBvbmVudChyZXF1ZXN0LnRvcGljKTtcbiAgICAvL2FsZXJ0KHVybCk7XG4gICAgY29uc29sZS5sb2codXJsKTtcbiAgICAvL3ZhciB1cmwgPSBcImh0dHA6Ly8xMjcuMC4wLjE6ODAwMC93aWtpL2dldF93aWtpX3N1bW1hcnkvP3RvcGljPSUyMkNPVklEMTklMjJcIlx0XG4gICAgZmV0Y2godXJsKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHNlbmRSZXNwb25zZSh7IGZhcmV3ZWxsOiByZXNwb25zZSB9KSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSk7XG4gICAgcmV0dXJuIHRydWU7IC8vIFdpbGwgcmVzcG9uZCBhc3luY2hyb25vdXNseS5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==