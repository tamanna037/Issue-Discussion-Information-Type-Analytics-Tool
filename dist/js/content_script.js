/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/content.ts":
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
// This script is excuted directly from inside the page
const chart_js_1 = __webpack_require__(/*! chart.js */ "./node_modules/chart.js/dist/chart.esm.js");
const $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
const informationTypes = [
    'Action on Issue',
    'Bug Reproduction',
    'Contribution and Commitment',
    'Expected Behaviour',
    'Investigation and Exploration',
    'Motivation',
    'Observed Bug Behaviour',
    'Potential New Issues and Requests',
    'Social Conversation',
    'Solution Discussion',
    'Task Progress',
    'Usage',
    'Workarounds'
];
const informationTypesDict = {
    'Action on Issue': 0,
    'Bug Reproduction': 1,
    'Contribution and Commitment': 2,
    'Expected Behaviour': 3,
    'Investigation and Exploration': 4,
    'Motivation': 5,
    'Observed Bug Behaviour': 6,
    'Potential New Issues and Requests': 7,
    'Social Conversation': 8,
    'Solution Discussion': 9,
    'Task Progress': 10,
    'Usage': 11,
    'Workarounds': 12
};
const color_options = [
    'red',
    'maroon',
    'yellow',
    'olive',
    'lime',
    'green',
    'aqua',
    'teal',
    'blue',
    'navy',
    'fuchsia',
    'purple',
    'violet',
    'pink'
];
var trenddata = [];
var Types = [];
var trenddataClosed = [];
var TypesClosed = [];
var trenddataOpen = [];
var TypesOpen = [];
var trenddataAll = [];
var TypesAll = [];
var SenList = [];
var Issue_page = false;
var infocounts = new Array(13).fill(0);
var Stage = '';
var Summary = '';
var elem = "body";
var v = $(elem).html();
var token = '';
// Register the parts of Chart.js I need
chart_js_1.Chart.register(chart_js_1.PieController, chart_js_1.Tooltip, chart_js_1.Legend, chart_js_1.ArcElement, chart_js_1.LineElement, chart_js_1.BarController, chart_js_1.LineController, chart_js_1.BarElement, chart_js_1.CategoryScale, chart_js_1.PointElement, chart_js_1.LinearScale, chart_js_1.Title);
// Set an XPath syntax to find User and Organisation containers for storing the graph
const ORG_XPATH = '//*[text() = "Top languages"]';
const USER_CONTAINER_SELECTOR = 'div[itemtype="http://schema.org/Person"]';
const SIDEBAR_CONTAINER_SELECTOR = 'div[id="partial-discussion-sidebar"]';
const ISSUE_STATUS_SELECTOR = 'div[class="flex-shrink-0 mb-2 flex-self-start flex-md-self-center"]';
const CLOSED_ISSUE_STATUS_SELECTOR = 'span[title="Status: Closed"]';
const $discussions = document.querySelector(SIDEBAR_CONTAINER_SELECTOR);
const qsa = ($el, sel) => [...$el.querySelectorAll(sel)];
let sentenceList = [];
const PROJECT_PAGE_SIDEBAR_SELECTOR = 'div[class="BorderGrid BorderGrid--spacious"]';
const original = $("body").html();
var senC = 0;
let pieCanvas = null;
let lineCanvas = null;
let container = null;
let parent = null;
let sidebar_parent = null;
let data = null;
let issuepage = false;
function createElement() {
    var issue_sidebar_parent = document.querySelector(SIDEBAR_CONTAINER_SELECTOR);
    var project_sidebar_parent = document.querySelector(PROJECT_PAGE_SIDEBAR_SELECTOR);
    var issue_status_container = document.querySelector(ISSUE_STATUS_SELECTOR);
    parent = document.querySelector(USER_CONTAINER_SELECTOR);
    if (issue_sidebar_parent == null) {
        sidebar_parent = project_sidebar_parent;
        issuepage = false;
    }
    else {
        issuepage = true;
        sidebar_parent = issue_sidebar_parent;
    }
    if (issuepage) {
        if (Stage != '' && Stage != 'Fixed') {
            getResolutionStage();
        }
        buildPieChart();
        getSummary();
    }
    else {
        buildPieChart();
        buildLineChart();
    }
}
function getIssueInfo(state) {
    if (state == 'all') {
        Types = TypesAll;
        trenddata = trenddataAll;
        document.getElementById("btnall").style.borderColor = 'black';
        document.getElementById("btnclosed").style.borderColor = 'white';
        document.getElementById("btnopen").style.borderColor = 'white';
    }
    else if (state == 'closed') {
        Types = TypesClosed;
        trenddata = trenddataClosed;
        document.getElementById("btnall").style.borderColor = 'white';
        document.getElementById("btnclosed").style.borderColor = 'black';
        document.getElementById("btnopen").style.borderColor = 'white';
    }
    else if (state == 'open') {
        Types = TypesOpen;
        trenddata = trenddataOpen;
        document.getElementById("btnall").style.borderColor = 'white';
        document.getElementById("btnclosed").style.borderColor = 'whitw';
        document.getElementById("btnopen").style.borderColor = 'black';
    }
    infocounts = new Array(13).fill(0);
    let valCountDict = valuecount(Types);
    for (let key in valCountDict) {
        infocounts[informationTypesDict[key]] = valCountDict[key];
    }
    //console.log(valCountDict)
    chrome.storage.sync.get(['showLegend', 'personalizeInfoTypes', 'chartType'], (result) => {
        const showLegend = result.showLegend || false;
        let personalizeInfoTypes = result.personalizeInfoTypes;
        let chartType = result.chartType;
        drawPie(showLegend, personalizeInfoTypes, chartType);
    });
    createChart();
}
function createSidebarContainer() {
    const div = document.createElement('div');
    div.id = 'PieChart-sidebar';
    const header = document.createElement('h4');
    const headerText = document.createTextNode('Issue Discussion Information Types');
    if (!issuepage) {
        const btnall = document.createElement('button');
        btnall.style.borderRadius = '5px';
        btnall.id = 'btnall';
        btnall.innerText = 'All';
        btnall.style.borderRadius = '5px';
        const btnopen = document.createElement('button');
        btnopen.id = 'btnopen';
        btnopen.innerText = 'Open';
        btnopen.style.borderRadius = '5px';
        btnopen.style.borderColor = 'white';
        const btnclosed = document.createElement('button');
        btnclosed.id = 'btnclosed';
        btnclosed.style.borderRadius = '5px';
        btnclosed.innerText = 'Closed';
        btnclosed.style.borderColor = 'white';
        //btnclosed.onclick=this.getIssueInfo;
        header.appendChild(headerText);
        header.appendChild(btnall);
        header.appendChild(btnopen);
        header.appendChild(btnclosed);
        btnall.addEventListener("click", function () { getIssueInfo('all'); });
        btnclosed.addEventListener("click", function () { getIssueInfo('closed'); });
        btnopen.addEventListener("click", function () { getIssueInfo('open'); });
    }
    else {
        header.appendChild(headerText);
    }
    div.classList.add('color-border-secondary', 'pt-3', 'mt-3', 'clearfix', 'hide-sm', 'hide-md');
    header.classList.add('mb-2', 'h4');
    div.appendChild(header);
    // Append the container to the parent
    sidebar_parent.appendChild(div);
    return div;
}
function createLineChartSidebarContainer() {
    const div = document.createElement('div');
    div.id = 'linechart';
    div.classList.add('border-top', 'color-border-secondary', 'pt-3', 'mt-3', 'clearfix', 'hide-sm', 'hide-md');
    sidebar_parent.appendChild(div);
    return div;
}
function createCanvas(width) {
    width = Math.floor(width / 50) * 50;
    // Create the canvas to put the chart in
    const canvas = document.createElement('canvas');
    canvas.id = 'pie-chart-canvas';
    canvas.width = width;
    canvas.height = width;
    return canvas;
}
function buildPieChart() {
    container = createSidebarContainer();
    // Get the width and height of the container and use it to build the canvas
    const width = +(window.getComputedStyle(container).width.split('px')[0]);
    pieCanvas = createCanvas(width);
    container.appendChild(pieCanvas);
    chrome.storage.sync.get(['showLegend', 'personalizeInfoTypes', 'chartType'], (result) => {
        const showLegend = result.showLegend || false;
        let chartType = result.chartType;
        let personalizeInfoTypes = result.personalizeInfoTypes;
        drawPie(showLegend, personalizeInfoTypes, chartType);
    });
}
function buildLineChart() {
    container = createLineChartSidebarContainer();
    // Get the width and height of the container and use it to build the canvas
    var width = +(window.getComputedStyle(container).width.split('px')[0]);
    width = Math.floor(width / 50) * 50;
    // Create the canvas to put the chart in
    const canvas = document.createElement('canvas');
    // Before creating the Charts.js thing ensure that we set the
    // width and height to be the computed width of the containing div
    canvas.id = 'linecanvas';
    canvas.width = width;
    canvas.height = width;
    lineCanvas = canvas;
    container.appendChild(lineCanvas);
    createChart();
}
function createChart() {
    pieCanvas.height += 1000; //(20 * Math.ceil(14 / 2))
    let chartStatus = chart_js_1.Chart.getChart(lineCanvas); // <canvas> id
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
    const chart1 = new chart_js_1.Chart(lineCanvas, {
        type: 'line',
        data: {
            labels: trenddata['year'],
            datasets: [
                {
                    //0
                    label: informationTypes[0],
                    data: trenddata[informationTypes[0]],
                    backgroundColor: color_options[0]
                },
                { label: informationTypes[1],
                    data: trenddata[informationTypes[1]],
                    backgroundColor: color_options[1]
                },
                { label: informationTypes[2],
                    data: trenddata[informationTypes[2]],
                    backgroundColor: color_options[2]
                },
                { label: informationTypes[3],
                    data: trenddata[informationTypes[3]],
                    backgroundColor: color_options[3]
                },
                { label: informationTypes[4],
                    data: trenddata[informationTypes[4]],
                    backgroundColor: color_options[4]
                },
                { label: informationTypes[5],
                    data: trenddata[informationTypes[5]],
                    backgroundColor: color_options[5]
                },
                { label: informationTypes[6],
                    data: trenddata[informationTypes[6]],
                    backgroundColor: color_options[6]
                },
                { label: informationTypes[7],
                    data: trenddata[informationTypes[7]],
                    backgroundColor: color_options[7]
                },
                { label: informationTypes[8],
                    data: trenddata[informationTypes[8]],
                    backgroundColor: color_options[8]
                },
                { label: informationTypes[9],
                    data: trenddata[informationTypes[9]],
                    backgroundColor: color_options[9]
                },
                { label: informationTypes[10],
                    data: trenddata[informationTypes[10]],
                    backgroundColor: color_options[10]
                },
                { label: informationTypes[11],
                    data: trenddata[informationTypes[11]],
                    backgroundColor: color_options[11]
                },
                { label: informationTypes[12],
                    data: trenddata[informationTypes[12]],
                    backgroundColor: color_options[12]
                }
            ]
        },
        options: {
            aspectRatio: 0.5,
            plugins: {
                legend: {
                    position: 'bottom',
                    display: false, //showLegend,
                }
            }
        }
    });
}
function drawPie(showLegend, personalizeInfoTypes, chartType) {
    console.log(showLegend);
    console.log(personalizeInfoTypes);
    console.log(chartType);
    pieCanvas.height += (20 * Math.ceil(14));
    let chartStatus = chart_js_1.Chart.getChart(pieCanvas); // <canvas> id
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
    const chart = new chart_js_1.Chart(pieCanvas, {
        data: {
            datasets: [{
                    backgroundColor: color_options,
                    data: infocounts,
                    label: 'informationTypes',
                }],
            labels: informationTypes,
        },
        options: {
            aspectRatio: 0.8,
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: chartType == 'pie' ? false : true,
                    ticks: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    display: showLegend,
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6,
                        font: { size: 10 },
                        generateLabels: function (chart) {
                            var newLegends = [];
                            var sumCount = infocounts.reduce((a, b) => a + b, 0);
                            chart.data.labels.forEach(function (label, index) {
                                if (chart.data.datasets[0].data[index] == 0) //zero values
                                    return;
                                if (personalizeInfoTypes[index] == false)
                                    return;
                                var legend = {
                                    text: `${chart.data.labels[index]} ${(infocounts[index] / sumCount * 100).toFixed(1)}%`,
                                    fillStyle: chart.data.datasets[0].backgroundColor[index], datasetIndex: index
                                };
                                newLegends.push(legend);
                            });
                            return newLegends;
                        }
                    }
                },
            },
        },
        type: chartType,
    });
    for (let i = 0; i < personalizeInfoTypes.length; i++) {
        if (personalizeInfoTypes[i] == false) {
            chart.toggleDataVisibility(i);
        }
    }
    chart.update();
    pieCanvas.onclick = (e) => {
        const slice = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true)[0];
        let ind = informationTypes[slice.index];
        //$('p').html(ind);
        if (Issue_page) {
            var pNodes = document.getElementsByTagName('p');
            for (var i = 0, length = pNodes.length; i < length; i++) {
                pNodes[i].innerHTML = pNodes[i].innerHTML.replaceAll('<span style="background-color:#FFCCCB">', '');
                pNodes[i].innerHTML = pNodes[i].innerHTML.replaceAll('<\span>', '');
            }
            let summaryHeaderHolder = document.getElementById('summaryHeader');
            summaryHeaderHolder.innerHTML = 'Summary - ' + ind;
            let textareaholder = document.getElementById('Summary');
            textareaholder.innerHTML = '';
            for (let sent in Summary[ind]) {
                textareaholder.innerHTML += Summary[ind][sent] + '\n\n';
            }
            textareaholder.style.width = '300px';
            textareaholder.style.height = '0';
            textareaholder.style.height = textareaholder.scrollHeight + "px";
            //console.log( textareaholder.style.height)
            Types.findIndex((value, index) => {
                if (value == ind) {
                    //console.log(SenList[index])
                    let sen = SenList[index];
                    sen = sen.replaceAll('\n', '<breaka>');
                    sen = sen.replaceAll('\r', '<breaka>');
                    sen = sen.replaceAll('**', '');
                    sen = sen.replaceAll('```', '<breaka>');
                    sen = sen.replaceAll('`', '<breaka>');
                    var regexForPeriod = /\.\s/g; //regex to find period
                    var regexForQuestion = /\?\s/g; //regex to find question mark
                    var regexForWonder = /\!\s/g;
                    sen = sen.replaceAll(regexForPeriod, '<breaka>');
                    sen = sen.replaceAll(regexForQuestion, '<breaka>');
                    sen = sen.replaceAll(regexForWonder, '<breaka>');
                    sen = sen.replace(/@\S+/g, '<breaka>');
                    if (sen.indexOf('[') != -1 && sen.indexOf('](') != -1 && sen.indexOf(')') != -1) {
                        let st = sen.indexOf('](');
                        let end = sen.indexOf(')');
                        sen = sen.slice(0, st) + '<breaka>' + sen.slice(end + 1);
                        sen = sen.replace('[', '<breaka>');
                    }
                    sen = sen.replace(/http[s]?\S+/g, '<breaka>');
                    let lista = sen.split('<breaka>');
                    //v = $(elem).html();
                    //v=v.replace(SenList[index],'<span style="background-color:red">'+SenList[index] +'</span>')
                    //this.getComments();
                    for (let i = 0; i < lista.length; i++) {
                        lista[i] = lista[i].trim();
                        if (lista[i].length <= 1)
                            continue;
                        //console.log(lista[i])
                        var pNodes = document.getElementsByTagName('p');
                        for (var p = 0, length = pNodes.length; p < length; p++) {
                            if (pNodes[p].innerText.indexOf(lista[i]) != -1) {
                                pNodes[p].innerHTML = pNodes[p].innerHTML.replace(lista[i], '<span style="background-color:#FFCCCB">' + lista[i] + '</span>');
                            }
                        }
                    }
                }
            });
        }
    };
    // Set up a listener for changes to the `showLegend` key of storage
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if ('showLegend' in changes) {
            // Update the chart to set the legend display to the newValue of the storage
            chart.options.plugins.legend.display = changes.showLegend.newValue;
            chart.update();
        }
    });
}
function getResolutionStage() {
    const $discussions = qsa(document, '.js-socket-channel');
    $discussions.forEach(disc => {
        // console.log(disc.innerHTML)
        if (disc.getAttribute("id") == 'partial-discussion-sidebar') {
            disc.innerHTML += '<div class="discussion-sidebar-item js-discussion-sidebar-item"> <h6 class=/"discussion-sidebar-heading text-bold/"> Issue Resolution Stage </h6>  <span class="css-truncate sidebar-progress-bar">' + Stage + '</span> </div>';
            disc.innerHTML += '<div id="timechart"></div>';
        }
    });
}
function getSummary() {
    let defaultInfoType = 'Solution Discussion';
    const div = document.createElement('div');
    div.id = 'summary';
    //div.height=1000
    const header = document.createElement('h4');
    header.id = 'summaryHeader';
    //const headerText = document.createTextNode('Summary')
    header.innerHTML = 'Summary - ' + defaultInfoType;
    //header.appendChild(headerText)
    const textareaholder = document.createElement('TEXTAREA');
    textareaholder.id = 'Summary';
    textareaholder.setAttribute("readonly", "readonly");
    for (let sent in Summary[defaultInfoType]) {
        textareaholder.innerHTML += Summary[defaultInfoType][sent] + '\n\n';
    }
    div.classList.add('color-border-secondary', 'pt-3', 'mt-3', 'clearfix', 'hide-sm', 'hide-md');
    header.classList.add('mb-2', 'h4');
    div.appendChild(header);
    div.appendChild(textareaholder);
    // Append the container to the parent
    sidebar_parent.appendChild(div);
    chrome.storage.sync.get(['defaultInfoType'], (result) => {
        defaultInfoType = result.defaultInfoType;
        let textareaholder = document.getElementById('Summary');
        textareaholder.innerHTML = '';
        if (!(defaultInfoType in Object.keys(Summary)) && Object.keys(Summary).length != 0) {
            defaultInfoType = Object.keys(Summary)[0];
        }
        let summaryHeaderHolder = document.getElementById('summaryHeader');
        summaryHeaderHolder.innerHTML = 'Summary - ' + defaultInfoType;
        for (let sent in Summary[defaultInfoType]) {
            textareaholder.innerHTML += Summary[defaultInfoType][sent] + '\n\n';
        }
        textareaholder.style.width = '300px';
        textareaholder.style.height = textareaholder.scrollHeight + "px";
    });
}
function checkURL() {
    let curUrl = document.URL;
    if (curUrl.indexOf('github.com') != -1 && curUrl.indexOf('/issues/') != -1) {
        return true;
    }
    return false;
}
function valuecount(arr) {
    return arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {});
}
function main() {
    chrome.runtime.sendMessage({ topic: [token, document.URL] }, function (response) {
        let result = response.farewell;
        let issue_page = result.issue_page;
        if (issue_page == 'No data found') {
            return;
        }
        let types = JSON.parse(result.summary);
        Types = types;
        Issue_page = issue_page;
        if (issue_page) {
            let senlist = JSON.parse(result.raw);
            SenList = senlist;
            let stage = result.stage;
            Stage = stage;
            //console.log(Stage)
            let summary = JSON.parse(result.summaryDict);
            Summary = summary;
            //console.log(summary)
        }
        else {
            let types = JSON.parse(result.summary);
            TypesAll = types;
            let typesClosed = JSON.parse(result.summaryClosed);
            TypesClosed = typesClosed;
            //console.log(TypesClosed)
            let typesOpen = JSON.parse(result.summaryOpen);
            TypesOpen = typesOpen;
            let trendall = JSON.parse(result.raw);
            trenddataAll = trendall;
            let trendClosed = JSON.parse(result.rawClosed);
            trenddataClosed = trendClosed;
            let trendOpen = JSON.parse(result.rawOpen);
            trenddataOpen = trendOpen;
            Types = TypesAll;
            trenddata = trenddataAll;
            //console.log(Types)
            //console.log(trenddata)
        }
        infocounts = new Array(13).fill(0);
        let valCountDict = valuecount(Types);
        for (let key in valCountDict) {
            infocounts[informationTypesDict[key]] = valCountDict[key];
        }
        //console.log(valCountDict)
        createElement();
        //let lngclass=new LanguageDisplay(profileName)
    });
}
chrome.storage.sync.get(['personalAccessToken'], (result) => {
    token = result.personalAccessToken || '';
    if (token != '') {
        main();
    }
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					result = fn();
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"content_script": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) var result = runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkIssue_Information_Type_Detector"] = self["webpackChunkIssue_Information_Type_Detector"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/content.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Jc3N1ZSBJbmZvcm1hdGlvbiBUeXBlIERldGVjdG9yLy4vc3JjL2NvbnRlbnQudHMiLCJ3ZWJwYWNrOi8vSXNzdWUgSW5mb3JtYXRpb24gVHlwZSBEZXRlY3Rvci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9Jc3N1ZSBJbmZvcm1hdGlvbiBUeXBlIERldGVjdG9yL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vSXNzdWUgSW5mb3JtYXRpb24gVHlwZSBEZXRlY3Rvci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vSXNzdWUgSW5mb3JtYXRpb24gVHlwZSBEZXRlY3Rvci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0lzc3VlIEluZm9ybWF0aW9uIFR5cGUgRGV0ZWN0b3Ivd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9Jc3N1ZSBJbmZvcm1hdGlvbiBUeXBlIERldGVjdG9yL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL0lzc3VlIEluZm9ybWF0aW9uIFR5cGUgRGV0ZWN0b3Ivd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RDtBQUNBLG1CQUFtQixtQkFBTyxDQUFDLDJEQUFVO0FBQ3JDLFVBQVUsbUJBQU8sQ0FBQyxvREFBUTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QscUJBQXFCLEVBQUU7QUFDN0UseURBQXlELHdCQUF3QixFQUFFO0FBQ25GLHVEQUF1RCxzQkFBc0IsRUFBRTtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3Qiw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFdBQVc7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLHlCQUF5QixHQUFHLGdEQUFnRDtBQUN6SDtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0wsbUJBQW1CLGlDQUFpQztBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRUFBcUUsa0JBQWtCO0FBQ3ZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELFlBQVk7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRCxtREFBbUQ7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsa0JBQWtCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0QsWUFBWTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnRkFBZ0Y7QUFDaEY7QUFDQTtBQUNBLGdDQUFnQywrQkFBK0I7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7VUNwakJEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSw4QkFBOEIsd0NBQXdDO1dBQ3RFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsZ0JBQWdCLHFCQUFxQjtXQUNyQztXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0EsSUFBSTtXQUNKO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRTs7Ozs7V0MxQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0sb0JBQW9CO1dBQzFCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBLDRHOzs7OztVQzlDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImNvbnRlbnRfc2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vLyBUaGlzIHNjcmlwdCBpcyBleGN1dGVkIGRpcmVjdGx5IGZyb20gaW5zaWRlIHRoZSBwYWdlXG5jb25zdCBjaGFydF9qc18xID0gcmVxdWlyZShcImNoYXJ0LmpzXCIpO1xuY29uc3QgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5jb25zdCBpbmZvcm1hdGlvblR5cGVzID0gW1xuICAgICdBY3Rpb24gb24gSXNzdWUnLFxuICAgICdCdWcgUmVwcm9kdWN0aW9uJyxcbiAgICAnQ29udHJpYnV0aW9uIGFuZCBDb21taXRtZW50JyxcbiAgICAnRXhwZWN0ZWQgQmVoYXZpb3VyJyxcbiAgICAnSW52ZXN0aWdhdGlvbiBhbmQgRXhwbG9yYXRpb24nLFxuICAgICdNb3RpdmF0aW9uJyxcbiAgICAnT2JzZXJ2ZWQgQnVnIEJlaGF2aW91cicsXG4gICAgJ1BvdGVudGlhbCBOZXcgSXNzdWVzIGFuZCBSZXF1ZXN0cycsXG4gICAgJ1NvY2lhbCBDb252ZXJzYXRpb24nLFxuICAgICdTb2x1dGlvbiBEaXNjdXNzaW9uJyxcbiAgICAnVGFzayBQcm9ncmVzcycsXG4gICAgJ1VzYWdlJyxcbiAgICAnV29ya2Fyb3VuZHMnXG5dO1xuY29uc3QgaW5mb3JtYXRpb25UeXBlc0RpY3QgPSB7XG4gICAgJ0FjdGlvbiBvbiBJc3N1ZSc6IDAsXG4gICAgJ0J1ZyBSZXByb2R1Y3Rpb24nOiAxLFxuICAgICdDb250cmlidXRpb24gYW5kIENvbW1pdG1lbnQnOiAyLFxuICAgICdFeHBlY3RlZCBCZWhhdmlvdXInOiAzLFxuICAgICdJbnZlc3RpZ2F0aW9uIGFuZCBFeHBsb3JhdGlvbic6IDQsXG4gICAgJ01vdGl2YXRpb24nOiA1LFxuICAgICdPYnNlcnZlZCBCdWcgQmVoYXZpb3VyJzogNixcbiAgICAnUG90ZW50aWFsIE5ldyBJc3N1ZXMgYW5kIFJlcXVlc3RzJzogNyxcbiAgICAnU29jaWFsIENvbnZlcnNhdGlvbic6IDgsXG4gICAgJ1NvbHV0aW9uIERpc2N1c3Npb24nOiA5LFxuICAgICdUYXNrIFByb2dyZXNzJzogMTAsXG4gICAgJ1VzYWdlJzogMTEsXG4gICAgJ1dvcmthcm91bmRzJzogMTJcbn07XG5jb25zdCBjb2xvcl9vcHRpb25zID0gW1xuICAgICdyZWQnLFxuICAgICdtYXJvb24nLFxuICAgICd5ZWxsb3cnLFxuICAgICdvbGl2ZScsXG4gICAgJ2xpbWUnLFxuICAgICdncmVlbicsXG4gICAgJ2FxdWEnLFxuICAgICd0ZWFsJyxcbiAgICAnYmx1ZScsXG4gICAgJ25hdnknLFxuICAgICdmdWNoc2lhJyxcbiAgICAncHVycGxlJyxcbiAgICAndmlvbGV0JyxcbiAgICAncGluaydcbl07XG52YXIgdHJlbmRkYXRhID0gW107XG52YXIgVHlwZXMgPSBbXTtcbnZhciB0cmVuZGRhdGFDbG9zZWQgPSBbXTtcbnZhciBUeXBlc0Nsb3NlZCA9IFtdO1xudmFyIHRyZW5kZGF0YU9wZW4gPSBbXTtcbnZhciBUeXBlc09wZW4gPSBbXTtcbnZhciB0cmVuZGRhdGFBbGwgPSBbXTtcbnZhciBUeXBlc0FsbCA9IFtdO1xudmFyIFNlbkxpc3QgPSBbXTtcbnZhciBJc3N1ZV9wYWdlID0gZmFsc2U7XG52YXIgaW5mb2NvdW50cyA9IG5ldyBBcnJheSgxMykuZmlsbCgwKTtcbnZhciBTdGFnZSA9ICcnO1xudmFyIFN1bW1hcnkgPSAnJztcbnZhciBlbGVtID0gXCJib2R5XCI7XG52YXIgdiA9ICQoZWxlbSkuaHRtbCgpO1xudmFyIHRva2VuID0gJyc7XG4vLyBSZWdpc3RlciB0aGUgcGFydHMgb2YgQ2hhcnQuanMgSSBuZWVkXG5jaGFydF9qc18xLkNoYXJ0LnJlZ2lzdGVyKGNoYXJ0X2pzXzEuUGllQ29udHJvbGxlciwgY2hhcnRfanNfMS5Ub29sdGlwLCBjaGFydF9qc18xLkxlZ2VuZCwgY2hhcnRfanNfMS5BcmNFbGVtZW50LCBjaGFydF9qc18xLkxpbmVFbGVtZW50LCBjaGFydF9qc18xLkJhckNvbnRyb2xsZXIsIGNoYXJ0X2pzXzEuTGluZUNvbnRyb2xsZXIsIGNoYXJ0X2pzXzEuQmFyRWxlbWVudCwgY2hhcnRfanNfMS5DYXRlZ29yeVNjYWxlLCBjaGFydF9qc18xLlBvaW50RWxlbWVudCwgY2hhcnRfanNfMS5MaW5lYXJTY2FsZSwgY2hhcnRfanNfMS5UaXRsZSk7XG4vLyBTZXQgYW4gWFBhdGggc3ludGF4IHRvIGZpbmQgVXNlciBhbmQgT3JnYW5pc2F0aW9uIGNvbnRhaW5lcnMgZm9yIHN0b3JpbmcgdGhlIGdyYXBoXG5jb25zdCBPUkdfWFBBVEggPSAnLy8qW3RleHQoKSA9IFwiVG9wIGxhbmd1YWdlc1wiXSc7XG5jb25zdCBVU0VSX0NPTlRBSU5FUl9TRUxFQ1RPUiA9ICdkaXZbaXRlbXR5cGU9XCJodHRwOi8vc2NoZW1hLm9yZy9QZXJzb25cIl0nO1xuY29uc3QgU0lERUJBUl9DT05UQUlORVJfU0VMRUNUT1IgPSAnZGl2W2lkPVwicGFydGlhbC1kaXNjdXNzaW9uLXNpZGViYXJcIl0nO1xuY29uc3QgSVNTVUVfU1RBVFVTX1NFTEVDVE9SID0gJ2RpdltjbGFzcz1cImZsZXgtc2hyaW5rLTAgbWItMiBmbGV4LXNlbGYtc3RhcnQgZmxleC1tZC1zZWxmLWNlbnRlclwiXSc7XG5jb25zdCBDTE9TRURfSVNTVUVfU1RBVFVTX1NFTEVDVE9SID0gJ3NwYW5bdGl0bGU9XCJTdGF0dXM6IENsb3NlZFwiXSc7XG5jb25zdCAkZGlzY3Vzc2lvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNJREVCQVJfQ09OVEFJTkVSX1NFTEVDVE9SKTtcbmNvbnN0IHFzYSA9ICgkZWwsIHNlbCkgPT4gWy4uLiRlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbCldO1xubGV0IHNlbnRlbmNlTGlzdCA9IFtdO1xuY29uc3QgUFJPSkVDVF9QQUdFX1NJREVCQVJfU0VMRUNUT1IgPSAnZGl2W2NsYXNzPVwiQm9yZGVyR3JpZCBCb3JkZXJHcmlkLS1zcGFjaW91c1wiXSc7XG5jb25zdCBvcmlnaW5hbCA9ICQoXCJib2R5XCIpLmh0bWwoKTtcbnZhciBzZW5DID0gMDtcbmxldCBwaWVDYW52YXMgPSBudWxsO1xubGV0IGxpbmVDYW52YXMgPSBudWxsO1xubGV0IGNvbnRhaW5lciA9IG51bGw7XG5sZXQgcGFyZW50ID0gbnVsbDtcbmxldCBzaWRlYmFyX3BhcmVudCA9IG51bGw7XG5sZXQgZGF0YSA9IG51bGw7XG5sZXQgaXNzdWVwYWdlID0gZmFsc2U7XG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50KCkge1xuICAgIHZhciBpc3N1ZV9zaWRlYmFyX3BhcmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0lERUJBUl9DT05UQUlORVJfU0VMRUNUT1IpO1xuICAgIHZhciBwcm9qZWN0X3NpZGViYXJfcGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihQUk9KRUNUX1BBR0VfU0lERUJBUl9TRUxFQ1RPUik7XG4gICAgdmFyIGlzc3VlX3N0YXR1c19jb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKElTU1VFX1NUQVRVU19TRUxFQ1RPUik7XG4gICAgcGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVU0VSX0NPTlRBSU5FUl9TRUxFQ1RPUik7XG4gICAgaWYgKGlzc3VlX3NpZGViYXJfcGFyZW50ID09IG51bGwpIHtcbiAgICAgICAgc2lkZWJhcl9wYXJlbnQgPSBwcm9qZWN0X3NpZGViYXJfcGFyZW50O1xuICAgICAgICBpc3N1ZXBhZ2UgPSBmYWxzZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlzc3VlcGFnZSA9IHRydWU7XG4gICAgICAgIHNpZGViYXJfcGFyZW50ID0gaXNzdWVfc2lkZWJhcl9wYXJlbnQ7XG4gICAgfVxuICAgIGlmIChpc3N1ZXBhZ2UpIHtcbiAgICAgICAgaWYgKFN0YWdlICE9ICcnICYmIFN0YWdlICE9ICdGaXhlZCcpIHtcbiAgICAgICAgICAgIGdldFJlc29sdXRpb25TdGFnZSgpO1xuICAgICAgICB9XG4gICAgICAgIGJ1aWxkUGllQ2hhcnQoKTtcbiAgICAgICAgZ2V0U3VtbWFyeSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYnVpbGRQaWVDaGFydCgpO1xuICAgICAgICBidWlsZExpbmVDaGFydCgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldElzc3VlSW5mbyhzdGF0ZSkge1xuICAgIGlmIChzdGF0ZSA9PSAnYWxsJykge1xuICAgICAgICBUeXBlcyA9IFR5cGVzQWxsO1xuICAgICAgICB0cmVuZGRhdGEgPSB0cmVuZGRhdGFBbGw7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuYWxsXCIpLnN0eWxlLmJvcmRlckNvbG9yID0gJ2JsYWNrJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG5jbG9zZWRcIikuc3R5bGUuYm9yZGVyQ29sb3IgPSAnd2hpdGUnO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bm9wZW5cIikuc3R5bGUuYm9yZGVyQ29sb3IgPSAnd2hpdGUnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzdGF0ZSA9PSAnY2xvc2VkJykge1xuICAgICAgICBUeXBlcyA9IFR5cGVzQ2xvc2VkO1xuICAgICAgICB0cmVuZGRhdGEgPSB0cmVuZGRhdGFDbG9zZWQ7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuYWxsXCIpLnN0eWxlLmJvcmRlckNvbG9yID0gJ3doaXRlJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG5jbG9zZWRcIikuc3R5bGUuYm9yZGVyQ29sb3IgPSAnYmxhY2snO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bm9wZW5cIikuc3R5bGUuYm9yZGVyQ29sb3IgPSAnd2hpdGUnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzdGF0ZSA9PSAnb3BlbicpIHtcbiAgICAgICAgVHlwZXMgPSBUeXBlc09wZW47XG4gICAgICAgIHRyZW5kZGF0YSA9IHRyZW5kZGF0YU9wZW47XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuYWxsXCIpLnN0eWxlLmJvcmRlckNvbG9yID0gJ3doaXRlJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG5jbG9zZWRcIikuc3R5bGUuYm9yZGVyQ29sb3IgPSAnd2hpdHcnO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bm9wZW5cIikuc3R5bGUuYm9yZGVyQ29sb3IgPSAnYmxhY2snO1xuICAgIH1cbiAgICBpbmZvY291bnRzID0gbmV3IEFycmF5KDEzKS5maWxsKDApO1xuICAgIGxldCB2YWxDb3VudERpY3QgPSB2YWx1ZWNvdW50KFR5cGVzKTtcbiAgICBmb3IgKGxldCBrZXkgaW4gdmFsQ291bnREaWN0KSB7XG4gICAgICAgIGluZm9jb3VudHNbaW5mb3JtYXRpb25UeXBlc0RpY3Rba2V5XV0gPSB2YWxDb3VudERpY3Rba2V5XTtcbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyh2YWxDb3VudERpY3QpXG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoWydzaG93TGVnZW5kJywgJ3BlcnNvbmFsaXplSW5mb1R5cGVzJywgJ2NoYXJ0VHlwZSddLCAocmVzdWx0KSA9PiB7XG4gICAgICAgIGNvbnN0IHNob3dMZWdlbmQgPSByZXN1bHQuc2hvd0xlZ2VuZCB8fCBmYWxzZTtcbiAgICAgICAgbGV0IHBlcnNvbmFsaXplSW5mb1R5cGVzID0gcmVzdWx0LnBlcnNvbmFsaXplSW5mb1R5cGVzO1xuICAgICAgICBsZXQgY2hhcnRUeXBlID0gcmVzdWx0LmNoYXJ0VHlwZTtcbiAgICAgICAgZHJhd1BpZShzaG93TGVnZW5kLCBwZXJzb25hbGl6ZUluZm9UeXBlcywgY2hhcnRUeXBlKTtcbiAgICB9KTtcbiAgICBjcmVhdGVDaGFydCgpO1xufVxuZnVuY3Rpb24gY3JlYXRlU2lkZWJhckNvbnRhaW5lcigpIHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuaWQgPSAnUGllQ2hhcnQtc2lkZWJhcic7XG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDQnKTtcbiAgICBjb25zdCBoZWFkZXJUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0lzc3VlIERpc2N1c3Npb24gSW5mb3JtYXRpb24gVHlwZXMnKTtcbiAgICBpZiAoIWlzc3VlcGFnZSkge1xuICAgICAgICBjb25zdCBidG5hbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgYnRuYWxsLnN0eWxlLmJvcmRlclJhZGl1cyA9ICc1cHgnO1xuICAgICAgICBidG5hbGwuaWQgPSAnYnRuYWxsJztcbiAgICAgICAgYnRuYWxsLmlubmVyVGV4dCA9ICdBbGwnO1xuICAgICAgICBidG5hbGwuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzVweCc7XG4gICAgICAgIGNvbnN0IGJ0bm9wZW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgYnRub3Blbi5pZCA9ICdidG5vcGVuJztcbiAgICAgICAgYnRub3Blbi5pbm5lclRleHQgPSAnT3Blbic7XG4gICAgICAgIGJ0bm9wZW4uc3R5bGUuYm9yZGVyUmFkaXVzID0gJzVweCc7XG4gICAgICAgIGJ0bm9wZW4uc3R5bGUuYm9yZGVyQ29sb3IgPSAnd2hpdGUnO1xuICAgICAgICBjb25zdCBidG5jbG9zZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgYnRuY2xvc2VkLmlkID0gJ2J0bmNsb3NlZCc7XG4gICAgICAgIGJ0bmNsb3NlZC5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnNXB4JztcbiAgICAgICAgYnRuY2xvc2VkLmlubmVyVGV4dCA9ICdDbG9zZWQnO1xuICAgICAgICBidG5jbG9zZWQuc3R5bGUuYm9yZGVyQ29sb3IgPSAnd2hpdGUnO1xuICAgICAgICAvL2J0bmNsb3NlZC5vbmNsaWNrPXRoaXMuZ2V0SXNzdWVJbmZvO1xuICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQoaGVhZGVyVGV4dCk7XG4gICAgICAgIGhlYWRlci5hcHBlbmRDaGlsZChidG5hbGwpO1xuICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQoYnRub3Blbik7XG4gICAgICAgIGhlYWRlci5hcHBlbmRDaGlsZChidG5jbG9zZWQpO1xuICAgICAgICBidG5hbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHsgZ2V0SXNzdWVJbmZvKCdhbGwnKTsgfSk7XG4gICAgICAgIGJ0bmNsb3NlZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkgeyBnZXRJc3N1ZUluZm8oJ2Nsb3NlZCcpOyB9KTtcbiAgICAgICAgYnRub3Blbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkgeyBnZXRJc3N1ZUluZm8oJ29wZW4nKTsgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQoaGVhZGVyVGV4dCk7XG4gICAgfVxuICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdjb2xvci1ib3JkZXItc2Vjb25kYXJ5JywgJ3B0LTMnLCAnbXQtMycsICdjbGVhcmZpeCcsICdoaWRlLXNtJywgJ2hpZGUtbWQnKTtcbiAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnbWItMicsICdoNCcpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChoZWFkZXIpO1xuICAgIC8vIEFwcGVuZCB0aGUgY29udGFpbmVyIHRvIHRoZSBwYXJlbnRcbiAgICBzaWRlYmFyX3BhcmVudC5hcHBlbmRDaGlsZChkaXYpO1xuICAgIHJldHVybiBkaXY7XG59XG5mdW5jdGlvbiBjcmVhdGVMaW5lQ2hhcnRTaWRlYmFyQ29udGFpbmVyKCkge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5pZCA9ICdsaW5lY2hhcnQnO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdib3JkZXItdG9wJywgJ2NvbG9yLWJvcmRlci1zZWNvbmRhcnknLCAncHQtMycsICdtdC0zJywgJ2NsZWFyZml4JywgJ2hpZGUtc20nLCAnaGlkZS1tZCcpO1xuICAgIHNpZGViYXJfcGFyZW50LmFwcGVuZENoaWxkKGRpdik7XG4gICAgcmV0dXJuIGRpdjtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyh3aWR0aCkge1xuICAgIHdpZHRoID0gTWF0aC5mbG9vcih3aWR0aCAvIDUwKSAqIDUwO1xuICAgIC8vIENyZWF0ZSB0aGUgY2FudmFzIHRvIHB1dCB0aGUgY2hhcnQgaW5cbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjYW52YXMuaWQgPSAncGllLWNoYXJ0LWNhbnZhcyc7XG4gICAgY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgIHJldHVybiBjYW52YXM7XG59XG5mdW5jdGlvbiBidWlsZFBpZUNoYXJ0KCkge1xuICAgIGNvbnRhaW5lciA9IGNyZWF0ZVNpZGViYXJDb250YWluZXIoKTtcbiAgICAvLyBHZXQgdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIGNvbnRhaW5lciBhbmQgdXNlIGl0IHRvIGJ1aWxkIHRoZSBjYW52YXNcbiAgICBjb25zdCB3aWR0aCA9ICsod2luZG93LmdldENvbXB1dGVkU3R5bGUoY29udGFpbmVyKS53aWR0aC5zcGxpdCgncHgnKVswXSk7XG4gICAgcGllQ2FudmFzID0gY3JlYXRlQ2FudmFzKHdpZHRoKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGllQ2FudmFzKTtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChbJ3Nob3dMZWdlbmQnLCAncGVyc29uYWxpemVJbmZvVHlwZXMnLCAnY2hhcnRUeXBlJ10sIChyZXN1bHQpID0+IHtcbiAgICAgICAgY29uc3Qgc2hvd0xlZ2VuZCA9IHJlc3VsdC5zaG93TGVnZW5kIHx8IGZhbHNlO1xuICAgICAgICBsZXQgY2hhcnRUeXBlID0gcmVzdWx0LmNoYXJ0VHlwZTtcbiAgICAgICAgbGV0IHBlcnNvbmFsaXplSW5mb1R5cGVzID0gcmVzdWx0LnBlcnNvbmFsaXplSW5mb1R5cGVzO1xuICAgICAgICBkcmF3UGllKHNob3dMZWdlbmQsIHBlcnNvbmFsaXplSW5mb1R5cGVzLCBjaGFydFR5cGUpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gYnVpbGRMaW5lQ2hhcnQoKSB7XG4gICAgY29udGFpbmVyID0gY3JlYXRlTGluZUNoYXJ0U2lkZWJhckNvbnRhaW5lcigpO1xuICAgIC8vIEdldCB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgY29udGFpbmVyIGFuZCB1c2UgaXQgdG8gYnVpbGQgdGhlIGNhbnZhc1xuICAgIHZhciB3aWR0aCA9ICsod2luZG93LmdldENvbXB1dGVkU3R5bGUoY29udGFpbmVyKS53aWR0aC5zcGxpdCgncHgnKVswXSk7XG4gICAgd2lkdGggPSBNYXRoLmZsb29yKHdpZHRoIC8gNTApICogNTA7XG4gICAgLy8gQ3JlYXRlIHRoZSBjYW52YXMgdG8gcHV0IHRoZSBjaGFydCBpblxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIC8vIEJlZm9yZSBjcmVhdGluZyB0aGUgQ2hhcnRzLmpzIHRoaW5nIGVuc3VyZSB0aGF0IHdlIHNldCB0aGVcbiAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IHRvIGJlIHRoZSBjb21wdXRlZCB3aWR0aCBvZiB0aGUgY29udGFpbmluZyBkaXZcbiAgICBjYW52YXMuaWQgPSAnbGluZWNhbnZhcyc7XG4gICAgY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgIGxpbmVDYW52YXMgPSBjYW52YXM7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxpbmVDYW52YXMpO1xuICAgIGNyZWF0ZUNoYXJ0KCk7XG59XG5mdW5jdGlvbiBjcmVhdGVDaGFydCgpIHtcbiAgICBwaWVDYW52YXMuaGVpZ2h0ICs9IDEwMDA7IC8vKDIwICogTWF0aC5jZWlsKDE0IC8gMikpXG4gICAgbGV0IGNoYXJ0U3RhdHVzID0gY2hhcnRfanNfMS5DaGFydC5nZXRDaGFydChsaW5lQ2FudmFzKTsgLy8gPGNhbnZhcz4gaWRcbiAgICBpZiAoY2hhcnRTdGF0dXMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNoYXJ0U3RhdHVzLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgY29uc3QgY2hhcnQxID0gbmV3IGNoYXJ0X2pzXzEuQ2hhcnQobGluZUNhbnZhcywge1xuICAgICAgICB0eXBlOiAnbGluZScsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGxhYmVsczogdHJlbmRkYXRhWyd5ZWFyJ10sXG4gICAgICAgICAgICBkYXRhc2V0czogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8wXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBpbmZvcm1hdGlvblR5cGVzWzBdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0cmVuZGRhdGFbaW5mb3JtYXRpb25UeXBlc1swXV0sXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3Jfb3B0aW9uc1swXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogaW5mb3JtYXRpb25UeXBlc1sxXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdHJlbmRkYXRhW2luZm9ybWF0aW9uVHlwZXNbMV1dLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yX29wdGlvbnNbMV1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHsgbGFiZWw6IGluZm9ybWF0aW9uVHlwZXNbMl0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRyZW5kZGF0YVtpbmZvcm1hdGlvblR5cGVzWzJdXSxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcl9vcHRpb25zWzJdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiBpbmZvcm1hdGlvblR5cGVzWzNdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0cmVuZGRhdGFbaW5mb3JtYXRpb25UeXBlc1szXV0sXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3Jfb3B0aW9uc1szXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogaW5mb3JtYXRpb25UeXBlc1s0XSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdHJlbmRkYXRhW2luZm9ybWF0aW9uVHlwZXNbNF1dLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yX29wdGlvbnNbNF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHsgbGFiZWw6IGluZm9ybWF0aW9uVHlwZXNbNV0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRyZW5kZGF0YVtpbmZvcm1hdGlvblR5cGVzWzVdXSxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcl9vcHRpb25zWzVdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiBpbmZvcm1hdGlvblR5cGVzWzZdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0cmVuZGRhdGFbaW5mb3JtYXRpb25UeXBlc1s2XV0sXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3Jfb3B0aW9uc1s2XVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogaW5mb3JtYXRpb25UeXBlc1s3XSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdHJlbmRkYXRhW2luZm9ybWF0aW9uVHlwZXNbN11dLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yX29wdGlvbnNbN11cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHsgbGFiZWw6IGluZm9ybWF0aW9uVHlwZXNbOF0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRyZW5kZGF0YVtpbmZvcm1hdGlvblR5cGVzWzhdXSxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcl9vcHRpb25zWzhdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiBpbmZvcm1hdGlvblR5cGVzWzldLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0cmVuZGRhdGFbaW5mb3JtYXRpb25UeXBlc1s5XV0sXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3Jfb3B0aW9uc1s5XVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogaW5mb3JtYXRpb25UeXBlc1sxMF0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRyZW5kZGF0YVtpbmZvcm1hdGlvblR5cGVzWzEwXV0sXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3Jfb3B0aW9uc1sxMF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHsgbGFiZWw6IGluZm9ybWF0aW9uVHlwZXNbMTFdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0cmVuZGRhdGFbaW5mb3JtYXRpb25UeXBlc1sxMV1dLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yX29wdGlvbnNbMTFdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiBpbmZvcm1hdGlvblR5cGVzWzEyXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdHJlbmRkYXRhW2luZm9ybWF0aW9uVHlwZXNbMTJdXSxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcl9vcHRpb25zWzEyXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgYXNwZWN0UmF0aW86IDAuNSxcbiAgICAgICAgICAgIHBsdWdpbnM6IHtcbiAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdib3R0b20nLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBmYWxzZSwgLy9zaG93TGVnZW5kLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gZHJhd1BpZShzaG93TGVnZW5kLCBwZXJzb25hbGl6ZUluZm9UeXBlcywgY2hhcnRUeXBlKSB7XG4gICAgY29uc29sZS5sb2coc2hvd0xlZ2VuZCk7XG4gICAgY29uc29sZS5sb2cocGVyc29uYWxpemVJbmZvVHlwZXMpO1xuICAgIGNvbnNvbGUubG9nKGNoYXJ0VHlwZSk7XG4gICAgcGllQ2FudmFzLmhlaWdodCArPSAoMjAgKiBNYXRoLmNlaWwoMTQpKTtcbiAgICBsZXQgY2hhcnRTdGF0dXMgPSBjaGFydF9qc18xLkNoYXJ0LmdldENoYXJ0KHBpZUNhbnZhcyk7IC8vIDxjYW52YXM+IGlkXG4gICAgaWYgKGNoYXJ0U3RhdHVzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBjaGFydFN0YXR1cy5kZXN0cm95KCk7XG4gICAgfVxuICAgIGNvbnN0IGNoYXJ0ID0gbmV3IGNoYXJ0X2pzXzEuQ2hhcnQocGllQ2FudmFzLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGRhdGFzZXRzOiBbe1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yX29wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGluZm9jb3VudHMsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnaW5mb3JtYXRpb25UeXBlcycsXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBsYWJlbHM6IGluZm9ybWF0aW9uVHlwZXMsXG4gICAgICAgIH0sXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjgsXG4gICAgICAgICAgICBzY2FsZXM6IHtcbiAgICAgICAgICAgICAgICB4OiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGNoYXJ0VHlwZSA9PSAncGllJyA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdGlja3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGx1Z2luczoge1xuICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbScsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHNob3dMZWdlbmQsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlUG9pbnRTdHlsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveFdpZHRoOiA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogeyBzaXplOiAxMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVMYWJlbHM6IGZ1bmN0aW9uIChjaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdMZWdlbmRzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1bUNvdW50ID0gaW5mb2NvdW50cy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydC5kYXRhLmxhYmVscy5mb3JFYWNoKGZ1bmN0aW9uIChsYWJlbCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0LmRhdGEuZGF0YXNldHNbMF0uZGF0YVtpbmRleF0gPT0gMCkgLy96ZXJvIHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVyc29uYWxpemVJbmZvVHlwZXNbaW5kZXhdID09IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGVnZW5kID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogYCR7Y2hhcnQuZGF0YS5sYWJlbHNbaW5kZXhdfSAkeyhpbmZvY291bnRzW2luZGV4XSAvIHN1bUNvdW50ICogMTAwKS50b0ZpeGVkKDEpfSVgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbFN0eWxlOiBjaGFydC5kYXRhLmRhdGFzZXRzWzBdLmJhY2tncm91bmRDb2xvcltpbmRleF0sIGRhdGFzZXRJbmRleDogaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3TGVnZW5kcy5wdXNoKGxlZ2VuZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld0xlZ2VuZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgdHlwZTogY2hhcnRUeXBlLFxuICAgIH0pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGVyc29uYWxpemVJbmZvVHlwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHBlcnNvbmFsaXplSW5mb1R5cGVzW2ldID09IGZhbHNlKSB7XG4gICAgICAgICAgICBjaGFydC50b2dnbGVEYXRhVmlzaWJpbGl0eShpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGFydC51cGRhdGUoKTtcbiAgICBwaWVDYW52YXMub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgIGNvbnN0IHNsaWNlID0gY2hhcnQuZ2V0RWxlbWVudHNBdEV2ZW50Rm9yTW9kZShlLCAnbmVhcmVzdCcsIHsgaW50ZXJzZWN0OiB0cnVlIH0sIHRydWUpWzBdO1xuICAgICAgICBsZXQgaW5kID0gaW5mb3JtYXRpb25UeXBlc1tzbGljZS5pbmRleF07XG4gICAgICAgIC8vJCgncCcpLmh0bWwoaW5kKTtcbiAgICAgICAgaWYgKElzc3VlX3BhZ2UpIHtcbiAgICAgICAgICAgIHZhciBwTm9kZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgncCcpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHBOb2Rlcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHBOb2Rlc1tpXS5pbm5lckhUTUwgPSBwTm9kZXNbaV0uaW5uZXJIVE1MLnJlcGxhY2VBbGwoJzxzcGFuIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjojRkZDQ0NCXCI+JywgJycpO1xuICAgICAgICAgICAgICAgIHBOb2Rlc1tpXS5pbm5lckhUTUwgPSBwTm9kZXNbaV0uaW5uZXJIVE1MLnJlcGxhY2VBbGwoJzxcXHNwYW4+JywgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHN1bW1hcnlIZWFkZXJIb2xkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VtbWFyeUhlYWRlcicpO1xuICAgICAgICAgICAgc3VtbWFyeUhlYWRlckhvbGRlci5pbm5lckhUTUwgPSAnU3VtbWFyeSAtICcgKyBpbmQ7XG4gICAgICAgICAgICBsZXQgdGV4dGFyZWFob2xkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnU3VtbWFyeScpO1xuICAgICAgICAgICAgdGV4dGFyZWFob2xkZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICBmb3IgKGxldCBzZW50IGluIFN1bW1hcnlbaW5kXSkge1xuICAgICAgICAgICAgICAgIHRleHRhcmVhaG9sZGVyLmlubmVySFRNTCArPSBTdW1tYXJ5W2luZF1bc2VudF0gKyAnXFxuXFxuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRleHRhcmVhaG9sZGVyLnN0eWxlLndpZHRoID0gJzMwMHB4JztcbiAgICAgICAgICAgIHRleHRhcmVhaG9sZGVyLnN0eWxlLmhlaWdodCA9ICcwJztcbiAgICAgICAgICAgIHRleHRhcmVhaG9sZGVyLnN0eWxlLmhlaWdodCA9IHRleHRhcmVhaG9sZGVyLnNjcm9sbEhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coIHRleHRhcmVhaG9sZGVyLnN0eWxlLmhlaWdodClcbiAgICAgICAgICAgIFR5cGVzLmZpbmRJbmRleCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IGluZCkge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFNlbkxpc3RbaW5kZXhdKVxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VuID0gU2VuTGlzdFtpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIHNlbiA9IHNlbi5yZXBsYWNlQWxsKCdcXG4nLCAnPGJyZWFrYT4nKTtcbiAgICAgICAgICAgICAgICAgICAgc2VuID0gc2VuLnJlcGxhY2VBbGwoJ1xccicsICc8YnJlYWthPicpO1xuICAgICAgICAgICAgICAgICAgICBzZW4gPSBzZW4ucmVwbGFjZUFsbCgnKionLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbiA9IHNlbi5yZXBsYWNlQWxsKCdgYGAnLCAnPGJyZWFrYT4nKTtcbiAgICAgICAgICAgICAgICAgICAgc2VuID0gc2VuLnJlcGxhY2VBbGwoJ2AnLCAnPGJyZWFrYT4nKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlZ2V4Rm9yUGVyaW9kID0gL1xcLlxccy9nOyAvL3JlZ2V4IHRvIGZpbmQgcGVyaW9kXG4gICAgICAgICAgICAgICAgICAgIHZhciByZWdleEZvclF1ZXN0aW9uID0gL1xcP1xccy9nOyAvL3JlZ2V4IHRvIGZpbmQgcXVlc3Rpb24gbWFya1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVnZXhGb3JXb25kZXIgPSAvXFwhXFxzL2c7XG4gICAgICAgICAgICAgICAgICAgIHNlbiA9IHNlbi5yZXBsYWNlQWxsKHJlZ2V4Rm9yUGVyaW9kLCAnPGJyZWFrYT4nKTtcbiAgICAgICAgICAgICAgICAgICAgc2VuID0gc2VuLnJlcGxhY2VBbGwocmVnZXhGb3JRdWVzdGlvbiwgJzxicmVha2E+Jyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbiA9IHNlbi5yZXBsYWNlQWxsKHJlZ2V4Rm9yV29uZGVyLCAnPGJyZWFrYT4nKTtcbiAgICAgICAgICAgICAgICAgICAgc2VuID0gc2VuLnJlcGxhY2UoL0BcXFMrL2csICc8YnJlYWthPicpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VuLmluZGV4T2YoJ1snKSAhPSAtMSAmJiBzZW4uaW5kZXhPZignXSgnKSAhPSAtMSAmJiBzZW4uaW5kZXhPZignKScpICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3QgPSBzZW4uaW5kZXhPZignXSgnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbmQgPSBzZW4uaW5kZXhPZignKScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VuID0gc2VuLnNsaWNlKDAsIHN0KSArICc8YnJlYWthPicgKyBzZW4uc2xpY2UoZW5kICsgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZW4gPSBzZW4ucmVwbGFjZSgnWycsICc8YnJlYWthPicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbiA9IHNlbi5yZXBsYWNlKC9odHRwW3NdP1xcUysvZywgJzxicmVha2E+Jyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBsaXN0YSA9IHNlbi5zcGxpdCgnPGJyZWFrYT4nKTtcbiAgICAgICAgICAgICAgICAgICAgLy92ID0gJChlbGVtKS5odG1sKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vdj12LnJlcGxhY2UoU2VuTGlzdFtpbmRleF0sJzxzcGFuIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjpyZWRcIj4nK1Nlbkxpc3RbaW5kZXhdICsnPC9zcGFuPicpXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5nZXRDb21tZW50cygpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0YVtpXSA9IGxpc3RhW2ldLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaXN0YVtpXS5sZW5ndGggPD0gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cobGlzdGFbaV0pXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcE5vZGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3AnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwLCBsZW5ndGggPSBwTm9kZXMubGVuZ3RoOyBwIDwgbGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocE5vZGVzW3BdLmlubmVyVGV4dC5pbmRleE9mKGxpc3RhW2ldKSAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwTm9kZXNbcF0uaW5uZXJIVE1MID0gcE5vZGVzW3BdLmlubmVySFRNTC5yZXBsYWNlKGxpc3RhW2ldLCAnPHNwYW4gc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiNGRkNDQ0JcIj4nICsgbGlzdGFbaV0gKyAnPC9zcGFuPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvLyBTZXQgdXAgYSBsaXN0ZW5lciBmb3IgY2hhbmdlcyB0byB0aGUgYHNob3dMZWdlbmRgIGtleSBvZiBzdG9yYWdlXG4gICAgY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBuYW1lc3BhY2UpID0+IHtcbiAgICAgICAgaWYgKCdzaG93TGVnZW5kJyBpbiBjaGFuZ2VzKSB7XG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGNoYXJ0IHRvIHNldCB0aGUgbGVnZW5kIGRpc3BsYXkgdG8gdGhlIG5ld1ZhbHVlIG9mIHRoZSBzdG9yYWdlXG4gICAgICAgICAgICBjaGFydC5vcHRpb25zLnBsdWdpbnMubGVnZW5kLmRpc3BsYXkgPSBjaGFuZ2VzLnNob3dMZWdlbmQubmV3VmFsdWU7XG4gICAgICAgICAgICBjaGFydC51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0UmVzb2x1dGlvblN0YWdlKCkge1xuICAgIGNvbnN0ICRkaXNjdXNzaW9ucyA9IHFzYShkb2N1bWVudCwgJy5qcy1zb2NrZXQtY2hhbm5lbCcpO1xuICAgICRkaXNjdXNzaW9ucy5mb3JFYWNoKGRpc2MgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhkaXNjLmlubmVySFRNTClcbiAgICAgICAgaWYgKGRpc2MuZ2V0QXR0cmlidXRlKFwiaWRcIikgPT0gJ3BhcnRpYWwtZGlzY3Vzc2lvbi1zaWRlYmFyJykge1xuICAgICAgICAgICAgZGlzYy5pbm5lckhUTUwgKz0gJzxkaXYgY2xhc3M9XCJkaXNjdXNzaW9uLXNpZGViYXItaXRlbSBqcy1kaXNjdXNzaW9uLXNpZGViYXItaXRlbVwiPiA8aDYgY2xhc3M9L1wiZGlzY3Vzc2lvbi1zaWRlYmFyLWhlYWRpbmcgdGV4dC1ib2xkL1wiPiBJc3N1ZSBSZXNvbHV0aW9uIFN0YWdlIDwvaDY+ICA8c3BhbiBjbGFzcz1cImNzcy10cnVuY2F0ZSBzaWRlYmFyLXByb2dyZXNzLWJhclwiPicgKyBTdGFnZSArICc8L3NwYW4+IDwvZGl2Pic7XG4gICAgICAgICAgICBkaXNjLmlubmVySFRNTCArPSAnPGRpdiBpZD1cInRpbWVjaGFydFwiPjwvZGl2Pic7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldFN1bW1hcnkoKSB7XG4gICAgbGV0IGRlZmF1bHRJbmZvVHlwZSA9ICdTb2x1dGlvbiBEaXNjdXNzaW9uJztcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuaWQgPSAnc3VtbWFyeSc7XG4gICAgLy9kaXYuaGVpZ2h0PTEwMDBcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNCcpO1xuICAgIGhlYWRlci5pZCA9ICdzdW1tYXJ5SGVhZGVyJztcbiAgICAvL2NvbnN0IGhlYWRlclRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnU3VtbWFyeScpXG4gICAgaGVhZGVyLmlubmVySFRNTCA9ICdTdW1tYXJ5IC0gJyArIGRlZmF1bHRJbmZvVHlwZTtcbiAgICAvL2hlYWRlci5hcHBlbmRDaGlsZChoZWFkZXJUZXh0KVxuICAgIGNvbnN0IHRleHRhcmVhaG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnVEVYVEFSRUEnKTtcbiAgICB0ZXh0YXJlYWhvbGRlci5pZCA9ICdTdW1tYXJ5JztcbiAgICB0ZXh0YXJlYWhvbGRlci5zZXRBdHRyaWJ1dGUoXCJyZWFkb25seVwiLCBcInJlYWRvbmx5XCIpO1xuICAgIGZvciAobGV0IHNlbnQgaW4gU3VtbWFyeVtkZWZhdWx0SW5mb1R5cGVdKSB7XG4gICAgICAgIHRleHRhcmVhaG9sZGVyLmlubmVySFRNTCArPSBTdW1tYXJ5W2RlZmF1bHRJbmZvVHlwZV1bc2VudF0gKyAnXFxuXFxuJztcbiAgICB9XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2NvbG9yLWJvcmRlci1zZWNvbmRhcnknLCAncHQtMycsICdtdC0zJywgJ2NsZWFyZml4JywgJ2hpZGUtc20nLCAnaGlkZS1tZCcpO1xuICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdtYi0yJywgJ2g0Jyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGhlYWRlcik7XG4gICAgZGl2LmFwcGVuZENoaWxkKHRleHRhcmVhaG9sZGVyKTtcbiAgICAvLyBBcHBlbmQgdGhlIGNvbnRhaW5lciB0byB0aGUgcGFyZW50XG4gICAgc2lkZWJhcl9wYXJlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChbJ2RlZmF1bHRJbmZvVHlwZSddLCAocmVzdWx0KSA9PiB7XG4gICAgICAgIGRlZmF1bHRJbmZvVHlwZSA9IHJlc3VsdC5kZWZhdWx0SW5mb1R5cGU7XG4gICAgICAgIGxldCB0ZXh0YXJlYWhvbGRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdTdW1tYXJ5Jyk7XG4gICAgICAgIHRleHRhcmVhaG9sZGVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAoIShkZWZhdWx0SW5mb1R5cGUgaW4gT2JqZWN0LmtleXMoU3VtbWFyeSkpICYmIE9iamVjdC5rZXlzKFN1bW1hcnkpLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBkZWZhdWx0SW5mb1R5cGUgPSBPYmplY3Qua2V5cyhTdW1tYXJ5KVswXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3VtbWFyeUhlYWRlckhvbGRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdW1tYXJ5SGVhZGVyJyk7XG4gICAgICAgIHN1bW1hcnlIZWFkZXJIb2xkZXIuaW5uZXJIVE1MID0gJ1N1bW1hcnkgLSAnICsgZGVmYXVsdEluZm9UeXBlO1xuICAgICAgICBmb3IgKGxldCBzZW50IGluIFN1bW1hcnlbZGVmYXVsdEluZm9UeXBlXSkge1xuICAgICAgICAgICAgdGV4dGFyZWFob2xkZXIuaW5uZXJIVE1MICs9IFN1bW1hcnlbZGVmYXVsdEluZm9UeXBlXVtzZW50XSArICdcXG5cXG4nO1xuICAgICAgICB9XG4gICAgICAgIHRleHRhcmVhaG9sZGVyLnN0eWxlLndpZHRoID0gJzMwMHB4JztcbiAgICAgICAgdGV4dGFyZWFob2xkZXIuc3R5bGUuaGVpZ2h0ID0gdGV4dGFyZWFob2xkZXIuc2Nyb2xsSGVpZ2h0ICsgXCJweFwiO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gY2hlY2tVUkwoKSB7XG4gICAgbGV0IGN1clVybCA9IGRvY3VtZW50LlVSTDtcbiAgICBpZiAoY3VyVXJsLmluZGV4T2YoJ2dpdGh1Yi5jb20nKSAhPSAtMSAmJiBjdXJVcmwuaW5kZXhPZignL2lzc3Vlcy8nKSAhPSAtMSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gdmFsdWVjb3VudChhcnIpIHtcbiAgICByZXR1cm4gYXJyLnJlZHVjZSgocHJldiwgY3VycikgPT4gKHByZXZbY3Vycl0gPSArK3ByZXZbY3Vycl0gfHwgMSwgcHJldiksIHt9KTtcbn1cbmZ1bmN0aW9uIG1haW4oKSB7XG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0b3BpYzogW3Rva2VuLCBkb2N1bWVudC5VUkxdIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gcmVzcG9uc2UuZmFyZXdlbGw7XG4gICAgICAgIGxldCBpc3N1ZV9wYWdlID0gcmVzdWx0Lmlzc3VlX3BhZ2U7XG4gICAgICAgIGlmIChpc3N1ZV9wYWdlID09ICdObyBkYXRhIGZvdW5kJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0eXBlcyA9IEpTT04ucGFyc2UocmVzdWx0LnN1bW1hcnkpO1xuICAgICAgICBUeXBlcyA9IHR5cGVzO1xuICAgICAgICBJc3N1ZV9wYWdlID0gaXNzdWVfcGFnZTtcbiAgICAgICAgaWYgKGlzc3VlX3BhZ2UpIHtcbiAgICAgICAgICAgIGxldCBzZW5saXN0ID0gSlNPTi5wYXJzZShyZXN1bHQucmF3KTtcbiAgICAgICAgICAgIFNlbkxpc3QgPSBzZW5saXN0O1xuICAgICAgICAgICAgbGV0IHN0YWdlID0gcmVzdWx0LnN0YWdlO1xuICAgICAgICAgICAgU3RhZ2UgPSBzdGFnZTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coU3RhZ2UpXG4gICAgICAgICAgICBsZXQgc3VtbWFyeSA9IEpTT04ucGFyc2UocmVzdWx0LnN1bW1hcnlEaWN0KTtcbiAgICAgICAgICAgIFN1bW1hcnkgPSBzdW1tYXJ5O1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzdW1tYXJ5KVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IHR5cGVzID0gSlNPTi5wYXJzZShyZXN1bHQuc3VtbWFyeSk7XG4gICAgICAgICAgICBUeXBlc0FsbCA9IHR5cGVzO1xuICAgICAgICAgICAgbGV0IHR5cGVzQ2xvc2VkID0gSlNPTi5wYXJzZShyZXN1bHQuc3VtbWFyeUNsb3NlZCk7XG4gICAgICAgICAgICBUeXBlc0Nsb3NlZCA9IHR5cGVzQ2xvc2VkO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhUeXBlc0Nsb3NlZClcbiAgICAgICAgICAgIGxldCB0eXBlc09wZW4gPSBKU09OLnBhcnNlKHJlc3VsdC5zdW1tYXJ5T3Blbik7XG4gICAgICAgICAgICBUeXBlc09wZW4gPSB0eXBlc09wZW47XG4gICAgICAgICAgICBsZXQgdHJlbmRhbGwgPSBKU09OLnBhcnNlKHJlc3VsdC5yYXcpO1xuICAgICAgICAgICAgdHJlbmRkYXRhQWxsID0gdHJlbmRhbGw7XG4gICAgICAgICAgICBsZXQgdHJlbmRDbG9zZWQgPSBKU09OLnBhcnNlKHJlc3VsdC5yYXdDbG9zZWQpO1xuICAgICAgICAgICAgdHJlbmRkYXRhQ2xvc2VkID0gdHJlbmRDbG9zZWQ7XG4gICAgICAgICAgICBsZXQgdHJlbmRPcGVuID0gSlNPTi5wYXJzZShyZXN1bHQucmF3T3Blbik7XG4gICAgICAgICAgICB0cmVuZGRhdGFPcGVuID0gdHJlbmRPcGVuO1xuICAgICAgICAgICAgVHlwZXMgPSBUeXBlc0FsbDtcbiAgICAgICAgICAgIHRyZW5kZGF0YSA9IHRyZW5kZGF0YUFsbDtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coVHlwZXMpXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRyZW5kZGF0YSlcbiAgICAgICAgfVxuICAgICAgICBpbmZvY291bnRzID0gbmV3IEFycmF5KDEzKS5maWxsKDApO1xuICAgICAgICBsZXQgdmFsQ291bnREaWN0ID0gdmFsdWVjb3VudChUeXBlcyk7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiB2YWxDb3VudERpY3QpIHtcbiAgICAgICAgICAgIGluZm9jb3VudHNbaW5mb3JtYXRpb25UeXBlc0RpY3Rba2V5XV0gPSB2YWxDb3VudERpY3Rba2V5XTtcbiAgICAgICAgfVxuICAgICAgICAvL2NvbnNvbGUubG9nKHZhbENvdW50RGljdClcbiAgICAgICAgY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICAvL2xldCBsbmdjbGFzcz1uZXcgTGFuZ3VhZ2VEaXNwbGF5KHByb2ZpbGVOYW1lKVxuICAgIH0pO1xufVxuY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoWydwZXJzb25hbEFjY2Vzc1Rva2VuJ10sIChyZXN1bHQpID0+IHtcbiAgICB0b2tlbiA9IHJlc3VsdC5wZXJzb25hbEFjY2Vzc1Rva2VuIHx8ICcnO1xuICAgIGlmICh0b2tlbiAhPSAnJykge1xuICAgICAgICBtYWluKCk7XG4gICAgfVxufSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHJlc3VsdCA9IGZuKCk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJjb250ZW50X3NjcmlwdFwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHR9XG5cdH1cblx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzW2ldXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua0lzc3VlX0luZm9ybWF0aW9uX1R5cGVfRGV0ZWN0b3JcIl0gPSBzZWxmW1wid2VicGFja0NodW5rSXNzdWVfSW5mb3JtYXRpb25fVHlwZV9EZXRlY3RvclwiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NvbnRlbnQudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=