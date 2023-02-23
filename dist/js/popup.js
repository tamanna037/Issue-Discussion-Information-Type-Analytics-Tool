/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup.ts":
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/
/***/ (function() {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
chrome.storage.sync.get(['showLegend', 'personalAccessToken', 'defaultInfoType', 'personalizeInfoTypes', 'chartType'], (result) => {
    setup(result);
});
function setup(result) {
    return __awaiter(this, void 0, void 0, function* () {
        //load HTML Elements
        const chartLegendCheck = document.getElementById('show-legend');
        const personalTokenInput = document.getElementById('personal-access-token');
        const defaultInfoTypeValue = document.getElementById('default-info-types');
        const personalizedInfoTypeInputList = document.getElementsByName('personalized-info-types');
        const chartTypeButton = document.getElementsByName('chartType');
        //Saved Values of HTML Element
        const showLegend = result.showLegend != null ? result.showLegend : true;
        const personalAccessToken = result.personalAccessToken || '';
        const defaultInfoType = result.defaultInfoType || 'Solution Discussion';
        const personalizeInfoTypes = result.personalizeInfoTypes;
        const chartType = result.chartType || 'pie';
        //Update HTML element with save values    
        chartLegendCheck.checked = showLegend;
        defaultInfoTypeValue.value = defaultInfoType;
        personalTokenInput.value = personalAccessToken;
        //console.log(personalizeInfoTypes)
        if (personalizeInfoTypes != null) {
            for (let i = 0; i < personalizedInfoTypeInputList.length; i++) {
                personalizedInfoTypeInputList[i].checked = personalizeInfoTypes[i];
            }
        }
        else {
            for (let i = 0; i < personalizedInfoTypeInputList.length; i++) {
                personalizedInfoTypeInputList[i].checked = true;
            }
        }
        if (chartType == 'pie') {
            chartTypeButton[0].checked = true;
            chartTypeButton[1].checked = false;
        }
        else if (chartType == 'bar') {
            chartTypeButton[0].checked = false;
            chartTypeButton[1].checked = true;
        }
        if (result.showLegend == undefined) {
            chrome.storage.sync.set({ showLegend: chartLegendCheck.checked });
        }
        if (result.defaultInfoType == undefined) {
            chrome.storage.sync.set({ defaultInfoType: defaultInfoTypeValue.value });
        }
        if (result.chartType == undefined) {
            chrome.storage.sync.set({ chartType: chartType });
        }
        if (result.personalizeInfoTypes == undefined) {
            chrome.storage.sync.set({ personalizeInfoTypes: [true, true, true, true, true, true, true, true, true, true, true, true, true] });
        }
        if (result.personalAccessToken == undefined) {
            chrome.storage.sync.set({ personalAccessToken: '' });
        }
        // Add event listeners to get the values when they change
        chartLegendCheck.addEventListener('click', () => {
            chrome.storage.sync.set({ showLegend: chartLegendCheck.checked });
        }, false);
        defaultInfoTypeValue.addEventListener('change', () => {
            chrome.storage.sync.set({ defaultInfoType: defaultInfoTypeValue.value });
        }, false);
        Array.from(chartTypeButton).forEach(el => el.addEventListener('change', () => {
            let ctype = 'pie';
            if (chartTypeButton[0].checked) {
                ctype = 'pie';
            }
            else if (chartTypeButton[1].checked) {
                ctype = 'bar';
            }
            console.log(ctype);
            chrome.storage.sync.set({ chartType: ctype });
        }, false));
        Array.from(personalizedInfoTypeInputList).forEach(el => el.addEventListener('change', () => {
            let templist = [];
            for (let i = 0; i < personalizedInfoTypeInputList.length; i++) {
                templist.push(personalizedInfoTypeInputList[i].checked);
            }
            chrome.storage.sync.set({ personalizeInfoTypes: templist });
        }, false));
        personalTokenInput.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
            const token = personalTokenInput.value;
            const storedData = { personalAccessToken: token };
            chrome.storage.sync.set(storedData);
        }), false);
        // Now enable the inputs for user input
        //chartLegendCheck.disabled = false
        //personalTokenInput.disabled = false
        //defaultInfoTypeValue.disabled = false
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Jc3N1ZSBJbmZvcm1hdGlvbiBUeXBlIERldGVjdG9yLy4vc3JjL3BvcHVwLnRzIiwid2VicGFjazovL0lzc3VlIEluZm9ybWF0aW9uIFR5cGUgRGV0ZWN0b3Ivd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0EsMkJBQTJCLCtEQUErRCxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlHO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQiwwQ0FBMEM7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMENBQTBDO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx1Q0FBdUM7QUFDNUU7QUFDQTtBQUNBLHFDQUFxQyw4Q0FBOEM7QUFDbkY7QUFDQTtBQUNBLHFDQUFxQyx1QkFBdUI7QUFDNUQ7QUFDQTtBQUNBLHFDQUFxQyx1R0FBdUc7QUFDNUk7QUFDQTtBQUNBLHFDQUFxQywwQkFBMEI7QUFDL0Q7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLHVDQUF1QztBQUM1RSxTQUFTO0FBQ1Q7QUFDQSxxQ0FBcUMsOENBQThDO0FBQ25GLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsbUJBQW1CO0FBQ3hELFNBQVM7QUFDVDtBQUNBO0FBQ0EsMkJBQTJCLDBDQUEwQztBQUNyRTtBQUNBO0FBQ0EscUNBQXFDLGlDQUFpQztBQUN0RSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnQkFBZ0I7QUFDeEMsQ0FBQzs7Ozs7Ozs7VUN4R0Q7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJwb3B1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoWydzaG93TGVnZW5kJywgJ3BlcnNvbmFsQWNjZXNzVG9rZW4nLCAnZGVmYXVsdEluZm9UeXBlJywgJ3BlcnNvbmFsaXplSW5mb1R5cGVzJywgJ2NoYXJ0VHlwZSddLCAocmVzdWx0KSA9PiB7XG4gICAgc2V0dXAocmVzdWx0KTtcbn0pO1xuZnVuY3Rpb24gc2V0dXAocmVzdWx0KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgLy9sb2FkIEhUTUwgRWxlbWVudHNcbiAgICAgICAgY29uc3QgY2hhcnRMZWdlbmRDaGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG93LWxlZ2VuZCcpO1xuICAgICAgICBjb25zdCBwZXJzb25hbFRva2VuSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGVyc29uYWwtYWNjZXNzLXRva2VuJyk7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRJbmZvVHlwZVZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlZmF1bHQtaW5mby10eXBlcycpO1xuICAgICAgICBjb25zdCBwZXJzb25hbGl6ZWRJbmZvVHlwZUlucHV0TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdwZXJzb25hbGl6ZWQtaW5mby10eXBlcycpO1xuICAgICAgICBjb25zdCBjaGFydFR5cGVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY2hhcnRUeXBlJyk7XG4gICAgICAgIC8vU2F2ZWQgVmFsdWVzIG9mIEhUTUwgRWxlbWVudFxuICAgICAgICBjb25zdCBzaG93TGVnZW5kID0gcmVzdWx0LnNob3dMZWdlbmQgIT0gbnVsbCA/IHJlc3VsdC5zaG93TGVnZW5kIDogdHJ1ZTtcbiAgICAgICAgY29uc3QgcGVyc29uYWxBY2Nlc3NUb2tlbiA9IHJlc3VsdC5wZXJzb25hbEFjY2Vzc1Rva2VuIHx8ICcnO1xuICAgICAgICBjb25zdCBkZWZhdWx0SW5mb1R5cGUgPSByZXN1bHQuZGVmYXVsdEluZm9UeXBlIHx8ICdTb2x1dGlvbiBEaXNjdXNzaW9uJztcbiAgICAgICAgY29uc3QgcGVyc29uYWxpemVJbmZvVHlwZXMgPSByZXN1bHQucGVyc29uYWxpemVJbmZvVHlwZXM7XG4gICAgICAgIGNvbnN0IGNoYXJ0VHlwZSA9IHJlc3VsdC5jaGFydFR5cGUgfHwgJ3BpZSc7XG4gICAgICAgIC8vVXBkYXRlIEhUTUwgZWxlbWVudCB3aXRoIHNhdmUgdmFsdWVzICAgIFxuICAgICAgICBjaGFydExlZ2VuZENoZWNrLmNoZWNrZWQgPSBzaG93TGVnZW5kO1xuICAgICAgICBkZWZhdWx0SW5mb1R5cGVWYWx1ZS52YWx1ZSA9IGRlZmF1bHRJbmZvVHlwZTtcbiAgICAgICAgcGVyc29uYWxUb2tlbklucHV0LnZhbHVlID0gcGVyc29uYWxBY2Nlc3NUb2tlbjtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhwZXJzb25hbGl6ZUluZm9UeXBlcylcbiAgICAgICAgaWYgKHBlcnNvbmFsaXplSW5mb1R5cGVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGVyc29uYWxpemVkSW5mb1R5cGVJbnB1dExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwZXJzb25hbGl6ZWRJbmZvVHlwZUlucHV0TGlzdFtpXS5jaGVja2VkID0gcGVyc29uYWxpemVJbmZvVHlwZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlcnNvbmFsaXplZEluZm9UeXBlSW5wdXRMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcGVyc29uYWxpemVkSW5mb1R5cGVJbnB1dExpc3RbaV0uY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYXJ0VHlwZSA9PSAncGllJykge1xuICAgICAgICAgICAgY2hhcnRUeXBlQnV0dG9uWzBdLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgY2hhcnRUeXBlQnV0dG9uWzFdLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjaGFydFR5cGUgPT0gJ2JhcicpIHtcbiAgICAgICAgICAgIGNoYXJ0VHlwZUJ1dHRvblswXS5jaGVja2VkID0gZmFsc2U7XG4gICAgICAgICAgICBjaGFydFR5cGVCdXR0b25bMV0uY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5zaG93TGVnZW5kID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBzaG93TGVnZW5kOiBjaGFydExlZ2VuZENoZWNrLmNoZWNrZWQgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5kZWZhdWx0SW5mb1R5cGUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IGRlZmF1bHRJbmZvVHlwZTogZGVmYXVsdEluZm9UeXBlVmFsdWUudmFsdWUgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5jaGFydFR5cGUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IGNoYXJ0VHlwZTogY2hhcnRUeXBlIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQucGVyc29uYWxpemVJbmZvVHlwZXMgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHBlcnNvbmFsaXplSW5mb1R5cGVzOiBbdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZV0gfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5wZXJzb25hbEFjY2Vzc1Rva2VuID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBwZXJzb25hbEFjY2Vzc1Rva2VuOiAnJyB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJzIHRvIGdldCB0aGUgdmFsdWVzIHdoZW4gdGhleSBjaGFuZ2VcbiAgICAgICAgY2hhcnRMZWdlbmRDaGVjay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgc2hvd0xlZ2VuZDogY2hhcnRMZWdlbmRDaGVjay5jaGVja2VkIH0pO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIGRlZmF1bHRJbmZvVHlwZVZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgZGVmYXVsdEluZm9UeXBlOiBkZWZhdWx0SW5mb1R5cGVWYWx1ZS52YWx1ZSB9KTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICBBcnJheS5mcm9tKGNoYXJ0VHlwZUJ1dHRvbikuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY3R5cGUgPSAncGllJztcbiAgICAgICAgICAgIGlmIChjaGFydFR5cGVCdXR0b25bMF0uY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIGN0eXBlID0gJ3BpZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGFydFR5cGVCdXR0b25bMV0uY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIGN0eXBlID0gJ2Jhcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjdHlwZSk7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IGNoYXJ0VHlwZTogY3R5cGUgfSk7XG4gICAgICAgIH0sIGZhbHNlKSk7XG4gICAgICAgIEFycmF5LmZyb20ocGVyc29uYWxpemVkSW5mb1R5cGVJbnB1dExpc3QpLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRlbXBsaXN0ID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlcnNvbmFsaXplZEluZm9UeXBlSW5wdXRMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGVtcGxpc3QucHVzaChwZXJzb25hbGl6ZWRJbmZvVHlwZUlucHV0TGlzdFtpXS5jaGVja2VkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgcGVyc29uYWxpemVJbmZvVHlwZXM6IHRlbXBsaXN0IH0pO1xuICAgICAgICB9LCBmYWxzZSkpO1xuICAgICAgICBwZXJzb25hbFRva2VuSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBwZXJzb25hbFRva2VuSW5wdXQudmFsdWU7XG4gICAgICAgICAgICBjb25zdCBzdG9yZWREYXRhID0geyBwZXJzb25hbEFjY2Vzc1Rva2VuOiB0b2tlbiB9O1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoc3RvcmVkRGF0YSk7XG4gICAgICAgIH0pLCBmYWxzZSk7XG4gICAgICAgIC8vIE5vdyBlbmFibGUgdGhlIGlucHV0cyBmb3IgdXNlciBpbnB1dFxuICAgICAgICAvL2NoYXJ0TGVnZW5kQ2hlY2suZGlzYWJsZWQgPSBmYWxzZVxuICAgICAgICAvL3BlcnNvbmFsVG9rZW5JbnB1dC5kaXNhYmxlZCA9IGZhbHNlXG4gICAgICAgIC8vZGVmYXVsdEluZm9UeXBlVmFsdWUuZGlzYWJsZWQgPSBmYWxzZVxuICAgIH0pO1xufVxuLy8gU2V0IHVwIGEgbGlzdGVuZXIgZm9yIGEgY2xpY2sgb24gdGhlIGxpbmsgdG8gb3BlbiBhIHRhYiB0byBnZW5lcmF0ZSBhIHRva2VuXG5jb25zdCB0b2tlblVybCA9ICdodHRwczovL2dpdGh1Yi5jb20vc2V0dGluZ3MvdG9rZW5zL25ldz9kZXNjcmlwdGlvbj1HaXRIdWIlMjBVc2VyJTIwTGFuZ3VhZ2VzJnNjb3Blcz1yZXBvJztcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnZXQtdG9rZW4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IHRva2VuVXJsIH0pO1xufSwgZmFsc2UpO1xuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbl9fd2VicGFja19tb2R1bGVzX19bXCIuL3NyYy9wb3B1cC50c1wiXSgpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==