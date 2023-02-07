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
const { htmlToText } = __webpack_require__(/*! html-to-text */ "./node_modules/html-to-text/lib/html-to-text.cjs");
var informationTypes = [
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
var color_options = [
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
var informationTypesDict = {
    'Action on Issue': 0,
    'Bug Reproduction': 1,
    'Contribution and Commitment': 2,
    'Expected Behaviour': 3,
    'Investigation': 4,
    'Motivation': 5,
    'Observed Bug Behaviour': 6,
    'Potential New Issues and Requests': 7,
    'Social Conversation': 8,
    'Solution Discussion': 9,
    'Task Progress': 10,
    'Usage': 11,
    'Workarounds': 12
};
//var infocounts = [9777,2462,464,522,2329,6081,674,9545,25097,71787,3327,1820,534,];
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
var elem = "body";
var v = $(elem).html();
var token = '';
var projects = [['codenameone', 'Codenameone'], ['eclipse-openj9', 'openj9'], ['oracle', 'graal'], ['ikvm-revived', 'ikvm'], ['nodejs', 'node'], ['denoland', 'deno'], ['mono', 'mono']];
var projectInfos = [[4031, 640, 260, 87, 735, 1122, 236, 2008, 23975, 33433, 2992, 219, 56,],
    [9777, 2462, 464, 522, 2329, 6081, 674, 9545, 25097, 71787, 3327, 1820, 534],
    [3674, 1428, 199, 1243, 1265, 2979, 4519, 8222, 17332, 31898, 1389, 551, 136],
    [201, 132, 29, 16, 114, 275, 36, 261, 1652, 3072, 176, 31, 11],
    [20663.0, 5724.0, 1656.0, 1262.0, 6971.0, 19684.0, 3981.0, 39192.0, 143085.0, 207487.0, 8363.0, 2087.0, 977.0],
    [51969, 24968, 9414, 7514, 3991, 2529, 1993, 1536, 1066, 602, 408, 255, 225],
    [5121, 1477, 245, 676, 1692, 3674, 1581, 4268, 28311, 56272, 2107, 617, 129]];
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
        //this.getComments();
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
    console.log(valCountDict);
    drawPie();
    createChart();
    //console.log('hi')
}
function createSidebarContainer() {
    const div = document.createElement('div');
    div.id = 'github-user-languages-language-header';
    //div.height=1000
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
    //div.height=1000
    div.classList.add('border-top', 'color-border-secondary', 'pt-3', 'mt-3', 'clearfix', 'hide-sm', 'hide-md');
    //header.classList.add('mb-2', 'h4')
    //div.appendChild(header)
    // Append the container to the parent
    sidebar_parent.appendChild(div);
    return div;
}
function createCanvas(width) {
    //console.log(width)
    //console.log('gg')
    // Round width down to the nearest 50
    width = Math.floor(width / 50) * 50;
    // Create the canvas to put the chart in
    const canvas = document.createElement('canvas');
    // Before creating the Charts.js thing ensure that we set the
    // width and height to be the computed width of the containing div
    canvas.id = 'github-user-languages-language-chart';
    canvas.width = width;
    canvas.height = width;
    // Save the canvas
    return canvas;
}
function buildPieChart() {
    container = createSidebarContainer();
    // Get the width and height of the container and use it to build the canvas
    const width = +(window.getComputedStyle(container).width.split('px')[0]);
    pieCanvas = createCanvas(width);
    container.appendChild(pieCanvas);
    drawPie();
    // Get whether or not we should draw the legend from the sync storage and draw the chart
    /*chrome.storage.sync.get(['showLegend'], (result) => {
      const showLegend = result.showLegend || false
      this.drawPie()

    })*/
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
    // Get whether or not we should draw the legend from the sync storage and draw the chart
    /*chrome.storage.sync.get(['showLegend'], (result) => {
      this.createChart()
    })*/
}
function createChart() {
    pieCanvas.height += 1000; //(20 * Math.ceil(14 / 2))
    let total_year = 3; //trenddata['year'].count
    console.log(total_year);
    let years = [];
    for (let i = 0; i < total_year; i++) {
        years[i] = trenddata['year'][i];
    }
    console.log(years);
    let chartStatus = chart_js_1.Chart.getChart(lineCanvas); // <canvas> id
    if (chartStatus != undefined) {
        chartStatus.destroy();
        console.log('dd');
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
function drawPie() {
    var showLegend = true;
    pieCanvas.height += (20 * Math.ceil(14 / 2));
    pieCanvas.height = 1000;
    let chartStatus = chart_js_1.Chart.getChart(pieCanvas); // <canvas> id
    if (chartStatus != undefined) {
        chartStatus.destroy();
        console.log('dd');
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
            plugins: {
                legend: {
                    position: 'bottom',
                    display: true,
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
        type: 'pie',
    });
    //this.load_model()
    // Add event listeners to get the slitce that was clicked on
    // Will redirect to a list of the user's repos of that language
    pieCanvas.onclick = (e) => {
        const slice = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true)[0];
        //if (slice === undefined) { return }
        // Have to encode it in case of C++ and C#
        //const language = encodeURIComponent(langs[slice.index].toLowerCase())
        let ind = informationTypes[slice.index];
        //$('p').html(ind);
        if (Issue_page) {
            var pNodes = document.getElementsByTagName('p');
            for (var i = 0, length = pNodes.length; i < length; i++) {
                pNodes[i].innerHTML = pNodes[i].innerHTML.replaceAll('<span style="background-color:#FFCCCB">', '');
                pNodes[i].innerHTML = pNodes[i].innerHTML.replaceAll('<\span>', '');
            }
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
                        //sen=sen.replace('](','<breaka>')
                        sen = sen.slice(0, st) + '<breaka>' + sen.slice(end + 1);
                        sen = sen.replace('[', '<breaka>');
                        //console.log('ssssssssss')
                        console.log(sen);
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
                        console.log(lista[i]);
                        var pNodes = document.getElementsByTagName('p');
                        for (var p = 0, length = pNodes.length; p < length; p++) {
                            //console.log(pNodes[i].innerHTML)
                            if (pNodes[p].innerText.indexOf(lista[i]) != -1) { // console.log(pNodes[p].innerText)
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
            console.log(Stage);
        }
        else {
            let types = JSON.parse(result.summary);
            TypesAll = types;
            let typesClosed = JSON.parse(result.summaryClosed);
            TypesClosed = typesClosed;
            console.log('g');
            console.log(TypesClosed);
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
        console.log(valCountDict);
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
/******/ 		var chunkLoadingGlobal = self["webpackChunkgithub_user_languages"] = self["webpackChunkgithub_user_languages"] || [];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvLi9zcmMvY29udGVudC50cyIsIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZ2l0aHViLXVzZXItbGFuZ3VhZ2VzL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vZ2l0aHViLXVzZXItbGFuZ3VhZ2VzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vZ2l0aHViLXVzZXItbGFuZ3VhZ2VzL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0Q7QUFDQSxtQkFBbUIsbUJBQU8sQ0FBQywyREFBVTtBQUNyQyxVQUFVLG1CQUFPLENBQUMsb0RBQVE7QUFDMUIsT0FBTyxhQUFhLEdBQUcsbUJBQU8sQ0FBQyxzRUFBYztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxxQkFBcUIsRUFBRTtBQUM3RSx5REFBeUQsd0JBQXdCLEVBQUU7QUFDbkYsdURBQXVELHNCQUFzQixFQUFFO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLDZCQUE2QjtBQUM3Qix1QkFBdUI7QUFDdkI7QUFDQTtBQUNBLG1CQUFtQixnQkFBZ0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsNERBQTREO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJEO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsV0FBVztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2Qyx5QkFBeUIsR0FBRyxnREFBZ0Q7QUFDekg7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFLGtCQUFrQjtBQUN2RixvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELFlBQVk7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pELG1EQUFtRDtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxrQkFBa0I7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRCxZQUFZO0FBQzNFO0FBQ0EsOEVBQThFO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnRkFBZ0Y7QUFDaEY7QUFDQTtBQUNBLGdDQUFnQywrQkFBK0I7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7OztVQ3BoQkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOzs7OztXQ3pCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLDhCQUE4Qix3Q0FBd0M7V0FDdEU7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQkFBZ0IscUJBQXFCO1dBQ3JDO1dBQ0E7V0FDQSxpQkFBaUIscUJBQXFCO1dBQ3RDO1dBQ0E7V0FDQSxJQUFJO1dBQ0o7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFOzs7OztXQzFCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxvQkFBb0I7V0FDMUI7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0EsNEc7Ozs7O1VDOUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiY29udGVudF9zY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8vIFRoaXMgc2NyaXB0IGlzIGV4Y3V0ZWQgZGlyZWN0bHkgZnJvbSBpbnNpZGUgdGhlIHBhZ2VcbmNvbnN0IGNoYXJ0X2pzXzEgPSByZXF1aXJlKFwiY2hhcnQuanNcIik7XG5jb25zdCAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbmNvbnN0IHsgaHRtbFRvVGV4dCB9ID0gcmVxdWlyZSgnaHRtbC10by10ZXh0Jyk7XG52YXIgaW5mb3JtYXRpb25UeXBlcyA9IFtcbiAgICAnQWN0aW9uIG9uIElzc3VlJyxcbiAgICAnQnVnIFJlcHJvZHVjdGlvbicsXG4gICAgJ0NvbnRyaWJ1dGlvbiBhbmQgQ29tbWl0bWVudCcsXG4gICAgJ0V4cGVjdGVkIEJlaGF2aW91cicsXG4gICAgJ0ludmVzdGlnYXRpb24gYW5kIEV4cGxvcmF0aW9uJyxcbiAgICAnTW90aXZhdGlvbicsXG4gICAgJ09ic2VydmVkIEJ1ZyBCZWhhdmlvdXInLFxuICAgICdQb3RlbnRpYWwgTmV3IElzc3VlcyBhbmQgUmVxdWVzdHMnLFxuICAgICdTb2NpYWwgQ29udmVyc2F0aW9uJyxcbiAgICAnU29sdXRpb24gRGlzY3Vzc2lvbicsXG4gICAgJ1Rhc2sgUHJvZ3Jlc3MnLFxuICAgICdVc2FnZScsXG4gICAgJ1dvcmthcm91bmRzJ1xuXTtcbnZhciBjb2xvcl9vcHRpb25zID0gW1xuICAgICdyZWQnLFxuICAgICdtYXJvb24nLFxuICAgICd5ZWxsb3cnLFxuICAgICdvbGl2ZScsXG4gICAgJ2xpbWUnLFxuICAgICdncmVlbicsXG4gICAgJ2FxdWEnLFxuICAgICd0ZWFsJyxcbiAgICAnYmx1ZScsXG4gICAgJ25hdnknLFxuICAgICdmdWNoc2lhJyxcbiAgICAncHVycGxlJyxcbiAgICAndmlvbGV0JyxcbiAgICAncGluaydcbl07XG52YXIgaW5mb3JtYXRpb25UeXBlc0RpY3QgPSB7XG4gICAgJ0FjdGlvbiBvbiBJc3N1ZSc6IDAsXG4gICAgJ0J1ZyBSZXByb2R1Y3Rpb24nOiAxLFxuICAgICdDb250cmlidXRpb24gYW5kIENvbW1pdG1lbnQnOiAyLFxuICAgICdFeHBlY3RlZCBCZWhhdmlvdXInOiAzLFxuICAgICdJbnZlc3RpZ2F0aW9uJzogNCxcbiAgICAnTW90aXZhdGlvbic6IDUsXG4gICAgJ09ic2VydmVkIEJ1ZyBCZWhhdmlvdXInOiA2LFxuICAgICdQb3RlbnRpYWwgTmV3IElzc3VlcyBhbmQgUmVxdWVzdHMnOiA3LFxuICAgICdTb2NpYWwgQ29udmVyc2F0aW9uJzogOCxcbiAgICAnU29sdXRpb24gRGlzY3Vzc2lvbic6IDksXG4gICAgJ1Rhc2sgUHJvZ3Jlc3MnOiAxMCxcbiAgICAnVXNhZ2UnOiAxMSxcbiAgICAnV29ya2Fyb3VuZHMnOiAxMlxufTtcbi8vdmFyIGluZm9jb3VudHMgPSBbOTc3NywyNDYyLDQ2NCw1MjIsMjMyOSw2MDgxLDY3NCw5NTQ1LDI1MDk3LDcxNzg3LDMzMjcsMTgyMCw1MzQsXTtcbnZhciB0cmVuZGRhdGEgPSBbXTtcbnZhciBUeXBlcyA9IFtdO1xudmFyIHRyZW5kZGF0YUNsb3NlZCA9IFtdO1xudmFyIFR5cGVzQ2xvc2VkID0gW107XG52YXIgdHJlbmRkYXRhT3BlbiA9IFtdO1xudmFyIFR5cGVzT3BlbiA9IFtdO1xudmFyIHRyZW5kZGF0YUFsbCA9IFtdO1xudmFyIFR5cGVzQWxsID0gW107XG52YXIgU2VuTGlzdCA9IFtdO1xudmFyIElzc3VlX3BhZ2UgPSBmYWxzZTtcbnZhciBpbmZvY291bnRzID0gbmV3IEFycmF5KDEzKS5maWxsKDApO1xudmFyIFN0YWdlID0gJyc7XG52YXIgZWxlbSA9IFwiYm9keVwiO1xudmFyIHYgPSAkKGVsZW0pLmh0bWwoKTtcbnZhciB0b2tlbiA9ICcnO1xudmFyIHByb2plY3RzID0gW1snY29kZW5hbWVvbmUnLCAnQ29kZW5hbWVvbmUnXSwgWydlY2xpcHNlLW9wZW5qOScsICdvcGVuajknXSwgWydvcmFjbGUnLCAnZ3JhYWwnXSwgWydpa3ZtLXJldml2ZWQnLCAnaWt2bSddLCBbJ25vZGVqcycsICdub2RlJ10sIFsnZGVub2xhbmQnLCAnZGVubyddLCBbJ21vbm8nLCAnbW9ubyddXTtcbnZhciBwcm9qZWN0SW5mb3MgPSBbWzQwMzEsIDY0MCwgMjYwLCA4NywgNzM1LCAxMTIyLCAyMzYsIDIwMDgsIDIzOTc1LCAzMzQzMywgMjk5MiwgMjE5LCA1NixdLFxuICAgIFs5Nzc3LCAyNDYyLCA0NjQsIDUyMiwgMjMyOSwgNjA4MSwgNjc0LCA5NTQ1LCAyNTA5NywgNzE3ODcsIDMzMjcsIDE4MjAsIDUzNF0sXG4gICAgWzM2NzQsIDE0MjgsIDE5OSwgMTI0MywgMTI2NSwgMjk3OSwgNDUxOSwgODIyMiwgMTczMzIsIDMxODk4LCAxMzg5LCA1NTEsIDEzNl0sXG4gICAgWzIwMSwgMTMyLCAyOSwgMTYsIDExNCwgMjc1LCAzNiwgMjYxLCAxNjUyLCAzMDcyLCAxNzYsIDMxLCAxMV0sXG4gICAgWzIwNjYzLjAsIDU3MjQuMCwgMTY1Ni4wLCAxMjYyLjAsIDY5NzEuMCwgMTk2ODQuMCwgMzk4MS4wLCAzOTE5Mi4wLCAxNDMwODUuMCwgMjA3NDg3LjAsIDgzNjMuMCwgMjA4Ny4wLCA5NzcuMF0sXG4gICAgWzUxOTY5LCAyNDk2OCwgOTQxNCwgNzUxNCwgMzk5MSwgMjUyOSwgMTk5MywgMTUzNiwgMTA2NiwgNjAyLCA0MDgsIDI1NSwgMjI1XSxcbiAgICBbNTEyMSwgMTQ3NywgMjQ1LCA2NzYsIDE2OTIsIDM2NzQsIDE1ODEsIDQyNjgsIDI4MzExLCA1NjI3MiwgMjEwNywgNjE3LCAxMjldXTtcbi8vIFJlZ2lzdGVyIHRoZSBwYXJ0cyBvZiBDaGFydC5qcyBJIG5lZWRcbmNoYXJ0X2pzXzEuQ2hhcnQucmVnaXN0ZXIoY2hhcnRfanNfMS5QaWVDb250cm9sbGVyLCBjaGFydF9qc18xLlRvb2x0aXAsIGNoYXJ0X2pzXzEuTGVnZW5kLCBjaGFydF9qc18xLkFyY0VsZW1lbnQsIGNoYXJ0X2pzXzEuTGluZUVsZW1lbnQsIGNoYXJ0X2pzXzEuQmFyQ29udHJvbGxlciwgY2hhcnRfanNfMS5MaW5lQ29udHJvbGxlciwgY2hhcnRfanNfMS5CYXJFbGVtZW50LCBjaGFydF9qc18xLkNhdGVnb3J5U2NhbGUsIGNoYXJ0X2pzXzEuUG9pbnRFbGVtZW50LCBjaGFydF9qc18xLkxpbmVhclNjYWxlLCBjaGFydF9qc18xLlRpdGxlKTtcbi8vIFNldCBhbiBYUGF0aCBzeW50YXggdG8gZmluZCBVc2VyIGFuZCBPcmdhbmlzYXRpb24gY29udGFpbmVycyBmb3Igc3RvcmluZyB0aGUgZ3JhcGhcbmNvbnN0IE9SR19YUEFUSCA9ICcvLypbdGV4dCgpID0gXCJUb3AgbGFuZ3VhZ2VzXCJdJztcbmNvbnN0IFVTRVJfQ09OVEFJTkVSX1NFTEVDVE9SID0gJ2RpdltpdGVtdHlwZT1cImh0dHA6Ly9zY2hlbWEub3JnL1BlcnNvblwiXSc7XG5jb25zdCBTSURFQkFSX0NPTlRBSU5FUl9TRUxFQ1RPUiA9ICdkaXZbaWQ9XCJwYXJ0aWFsLWRpc2N1c3Npb24tc2lkZWJhclwiXSc7XG5jb25zdCBJU1NVRV9TVEFUVVNfU0VMRUNUT1IgPSAnZGl2W2NsYXNzPVwiZmxleC1zaHJpbmstMCBtYi0yIGZsZXgtc2VsZi1zdGFydCBmbGV4LW1kLXNlbGYtY2VudGVyXCJdJztcbmNvbnN0IENMT1NFRF9JU1NVRV9TVEFUVVNfU0VMRUNUT1IgPSAnc3Bhblt0aXRsZT1cIlN0YXR1czogQ2xvc2VkXCJdJztcbmNvbnN0ICRkaXNjdXNzaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0lERUJBUl9DT05UQUlORVJfU0VMRUNUT1IpO1xuY29uc3QgcXNhID0gKCRlbCwgc2VsKSA9PiBbLi4uJGVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKV07XG5sZXQgc2VudGVuY2VMaXN0ID0gW107XG5jb25zdCBQUk9KRUNUX1BBR0VfU0lERUJBUl9TRUxFQ1RPUiA9ICdkaXZbY2xhc3M9XCJCb3JkZXJHcmlkIEJvcmRlckdyaWQtLXNwYWNpb3VzXCJdJztcbmNvbnN0IG9yaWdpbmFsID0gJChcImJvZHlcIikuaHRtbCgpO1xudmFyIHNlbkMgPSAwO1xubGV0IHBpZUNhbnZhcyA9IG51bGw7XG5sZXQgbGluZUNhbnZhcyA9IG51bGw7XG5sZXQgY29udGFpbmVyID0gbnVsbDtcbmxldCBwYXJlbnQgPSBudWxsO1xubGV0IHNpZGViYXJfcGFyZW50ID0gbnVsbDtcbmxldCBkYXRhID0gbnVsbDtcbmxldCBpc3N1ZXBhZ2UgPSBmYWxzZTtcbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoKSB7XG4gICAgdmFyIGlzc3VlX3NpZGViYXJfcGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTSURFQkFSX0NPTlRBSU5FUl9TRUxFQ1RPUik7XG4gICAgdmFyIHByb2plY3Rfc2lkZWJhcl9wYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFBST0pFQ1RfUEFHRV9TSURFQkFSX1NFTEVDVE9SKTtcbiAgICB2YXIgaXNzdWVfc3RhdHVzX2NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoSVNTVUVfU1RBVFVTX1NFTEVDVE9SKTtcbiAgICBwYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVTRVJfQ09OVEFJTkVSX1NFTEVDVE9SKTtcbiAgICBpZiAoaXNzdWVfc2lkZWJhcl9wYXJlbnQgPT0gbnVsbCkge1xuICAgICAgICBzaWRlYmFyX3BhcmVudCA9IHByb2plY3Rfc2lkZWJhcl9wYXJlbnQ7XG4gICAgICAgIGlzc3VlcGFnZSA9IGZhbHNlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaXNzdWVwYWdlID0gdHJ1ZTtcbiAgICAgICAgc2lkZWJhcl9wYXJlbnQgPSBpc3N1ZV9zaWRlYmFyX3BhcmVudDtcbiAgICB9XG4gICAgaWYgKGlzc3VlcGFnZSkge1xuICAgICAgICBpZiAoU3RhZ2UgIT0gJycgJiYgU3RhZ2UgIT0gJ0ZpeGVkJykge1xuICAgICAgICAgICAgZ2V0UmVzb2x1dGlvblN0YWdlKCk7XG4gICAgICAgIH1cbiAgICAgICAgYnVpbGRQaWVDaGFydCgpO1xuICAgICAgICAvL3RoaXMuZ2V0Q29tbWVudHMoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGJ1aWxkUGllQ2hhcnQoKTtcbiAgICAgICAgYnVpbGRMaW5lQ2hhcnQoKTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRJc3N1ZUluZm8oc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT0gJ2FsbCcpIHtcbiAgICAgICAgVHlwZXMgPSBUeXBlc0FsbDtcbiAgICAgICAgdHJlbmRkYXRhID0gdHJlbmRkYXRhQWxsO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bmFsbFwiKS5zdHlsZS5ib3JkZXJDb2xvciA9ICdibGFjayc7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuY2xvc2VkXCIpLnN0eWxlLmJvcmRlckNvbG9yID0gJ3doaXRlJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG5vcGVuXCIpLnN0eWxlLmJvcmRlckNvbG9yID0gJ3doaXRlJztcbiAgICB9XG4gICAgZWxzZSBpZiAoc3RhdGUgPT0gJ2Nsb3NlZCcpIHtcbiAgICAgICAgVHlwZXMgPSBUeXBlc0Nsb3NlZDtcbiAgICAgICAgdHJlbmRkYXRhID0gdHJlbmRkYXRhQ2xvc2VkO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bmFsbFwiKS5zdHlsZS5ib3JkZXJDb2xvciA9ICd3aGl0ZSc7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuY2xvc2VkXCIpLnN0eWxlLmJvcmRlckNvbG9yID0gJ2JsYWNrJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG5vcGVuXCIpLnN0eWxlLmJvcmRlckNvbG9yID0gJ3doaXRlJztcbiAgICB9XG4gICAgZWxzZSBpZiAoc3RhdGUgPT0gJ29wZW4nKSB7XG4gICAgICAgIFR5cGVzID0gVHlwZXNPcGVuO1xuICAgICAgICB0cmVuZGRhdGEgPSB0cmVuZGRhdGFPcGVuO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bmFsbFwiKS5zdHlsZS5ib3JkZXJDb2xvciA9ICd3aGl0ZSc7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuY2xvc2VkXCIpLnN0eWxlLmJvcmRlckNvbG9yID0gJ3doaXR3JztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG5vcGVuXCIpLnN0eWxlLmJvcmRlckNvbG9yID0gJ2JsYWNrJztcbiAgICB9XG4gICAgaW5mb2NvdW50cyA9IG5ldyBBcnJheSgxMykuZmlsbCgwKTtcbiAgICBsZXQgdmFsQ291bnREaWN0ID0gdmFsdWVjb3VudChUeXBlcyk7XG4gICAgZm9yIChsZXQga2V5IGluIHZhbENvdW50RGljdCkge1xuICAgICAgICBpbmZvY291bnRzW2luZm9ybWF0aW9uVHlwZXNEaWN0W2tleV1dID0gdmFsQ291bnREaWN0W2tleV07XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHZhbENvdW50RGljdCk7XG4gICAgZHJhd1BpZSgpO1xuICAgIGNyZWF0ZUNoYXJ0KCk7XG4gICAgLy9jb25zb2xlLmxvZygnaGknKVxufVxuZnVuY3Rpb24gY3JlYXRlU2lkZWJhckNvbnRhaW5lcigpIHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuaWQgPSAnZ2l0aHViLXVzZXItbGFuZ3VhZ2VzLWxhbmd1YWdlLWhlYWRlcic7XG4gICAgLy9kaXYuaGVpZ2h0PTEwMDBcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNCcpO1xuICAgIGNvbnN0IGhlYWRlclRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnSXNzdWUgRGlzY3Vzc2lvbiBJbmZvcm1hdGlvbiBUeXBlcycpO1xuICAgIGlmICghaXNzdWVwYWdlKSB7XG4gICAgICAgIGNvbnN0IGJ0bmFsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBidG5hbGwuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzVweCc7XG4gICAgICAgIGJ0bmFsbC5pZCA9ICdidG5hbGwnO1xuICAgICAgICBidG5hbGwuaW5uZXJUZXh0ID0gJ0FsbCc7XG4gICAgICAgIGJ0bmFsbC5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnNXB4JztcbiAgICAgICAgY29uc3QgYnRub3BlbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBidG5vcGVuLmlkID0gJ2J0bm9wZW4nO1xuICAgICAgICBidG5vcGVuLmlubmVyVGV4dCA9ICdPcGVuJztcbiAgICAgICAgYnRub3Blbi5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnNXB4JztcbiAgICAgICAgYnRub3Blbi5zdHlsZS5ib3JkZXJDb2xvciA9ICd3aGl0ZSc7XG4gICAgICAgIGNvbnN0IGJ0bmNsb3NlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBidG5jbG9zZWQuaWQgPSAnYnRuY2xvc2VkJztcbiAgICAgICAgYnRuY2xvc2VkLnN0eWxlLmJvcmRlclJhZGl1cyA9ICc1cHgnO1xuICAgICAgICBidG5jbG9zZWQuaW5uZXJUZXh0ID0gJ0Nsb3NlZCc7XG4gICAgICAgIGJ0bmNsb3NlZC5zdHlsZS5ib3JkZXJDb2xvciA9ICd3aGl0ZSc7XG4gICAgICAgIC8vYnRuY2xvc2VkLm9uY2xpY2s9dGhpcy5nZXRJc3N1ZUluZm87XG4gICAgICAgIGhlYWRlci5hcHBlbmRDaGlsZChoZWFkZXJUZXh0KTtcbiAgICAgICAgaGVhZGVyLmFwcGVuZENoaWxkKGJ0bmFsbCk7XG4gICAgICAgIGhlYWRlci5hcHBlbmRDaGlsZChidG5vcGVuKTtcbiAgICAgICAgaGVhZGVyLmFwcGVuZENoaWxkKGJ0bmNsb3NlZCk7XG4gICAgICAgIGJ0bmFsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkgeyBnZXRJc3N1ZUluZm8oJ2FsbCcpOyB9KTtcbiAgICAgICAgYnRuY2xvc2VkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7IGdldElzc3VlSW5mbygnY2xvc2VkJyk7IH0pO1xuICAgICAgICBidG5vcGVuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7IGdldElzc3VlSW5mbygnb3BlbicpOyB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGhlYWRlci5hcHBlbmRDaGlsZChoZWFkZXJUZXh0KTtcbiAgICB9XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2NvbG9yLWJvcmRlci1zZWNvbmRhcnknLCAncHQtMycsICdtdC0zJywgJ2NsZWFyZml4JywgJ2hpZGUtc20nLCAnaGlkZS1tZCcpO1xuICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdtYi0yJywgJ2g0Jyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGhlYWRlcik7XG4gICAgLy8gQXBwZW5kIHRoZSBjb250YWluZXIgdG8gdGhlIHBhcmVudFxuICAgIHNpZGViYXJfcGFyZW50LmFwcGVuZENoaWxkKGRpdik7XG4gICAgcmV0dXJuIGRpdjtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUxpbmVDaGFydFNpZGViYXJDb250YWluZXIoKSB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmlkID0gJ2xpbmVjaGFydCc7XG4gICAgLy9kaXYuaGVpZ2h0PTEwMDBcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgnYm9yZGVyLXRvcCcsICdjb2xvci1ib3JkZXItc2Vjb25kYXJ5JywgJ3B0LTMnLCAnbXQtMycsICdjbGVhcmZpeCcsICdoaWRlLXNtJywgJ2hpZGUtbWQnKTtcbiAgICAvL2hlYWRlci5jbGFzc0xpc3QuYWRkKCdtYi0yJywgJ2g0JylcbiAgICAvL2Rpdi5hcHBlbmRDaGlsZChoZWFkZXIpXG4gICAgLy8gQXBwZW5kIHRoZSBjb250YWluZXIgdG8gdGhlIHBhcmVudFxuICAgIHNpZGViYXJfcGFyZW50LmFwcGVuZENoaWxkKGRpdik7XG4gICAgcmV0dXJuIGRpdjtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyh3aWR0aCkge1xuICAgIC8vY29uc29sZS5sb2cod2lkdGgpXG4gICAgLy9jb25zb2xlLmxvZygnZ2cnKVxuICAgIC8vIFJvdW5kIHdpZHRoIGRvd24gdG8gdGhlIG5lYXJlc3QgNTBcbiAgICB3aWR0aCA9IE1hdGguZmxvb3Iod2lkdGggLyA1MCkgKiA1MDtcbiAgICAvLyBDcmVhdGUgdGhlIGNhbnZhcyB0byBwdXQgdGhlIGNoYXJ0IGluXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgLy8gQmVmb3JlIGNyZWF0aW5nIHRoZSBDaGFydHMuanMgdGhpbmcgZW5zdXJlIHRoYXQgd2Ugc2V0IHRoZVxuICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgdG8gYmUgdGhlIGNvbXB1dGVkIHdpZHRoIG9mIHRoZSBjb250YWluaW5nIGRpdlxuICAgIGNhbnZhcy5pZCA9ICdnaXRodWItdXNlci1sYW5ndWFnZXMtbGFuZ3VhZ2UtY2hhcnQnO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAvLyBTYXZlIHRoZSBjYW52YXNcbiAgICByZXR1cm4gY2FudmFzO1xufVxuZnVuY3Rpb24gYnVpbGRQaWVDaGFydCgpIHtcbiAgICBjb250YWluZXIgPSBjcmVhdGVTaWRlYmFyQ29udGFpbmVyKCk7XG4gICAgLy8gR2V0IHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBjb250YWluZXIgYW5kIHVzZSBpdCB0byBidWlsZCB0aGUgY2FudmFzXG4gICAgY29uc3Qgd2lkdGggPSArKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGNvbnRhaW5lcikud2lkdGguc3BsaXQoJ3B4JylbMF0pO1xuICAgIHBpZUNhbnZhcyA9IGNyZWF0ZUNhbnZhcyh3aWR0aCk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHBpZUNhbnZhcyk7XG4gICAgZHJhd1BpZSgpO1xuICAgIC8vIEdldCB3aGV0aGVyIG9yIG5vdCB3ZSBzaG91bGQgZHJhdyB0aGUgbGVnZW5kIGZyb20gdGhlIHN5bmMgc3RvcmFnZSBhbmQgZHJhdyB0aGUgY2hhcnRcbiAgICAvKmNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFsnc2hvd0xlZ2VuZCddLCAocmVzdWx0KSA9PiB7XG4gICAgICBjb25zdCBzaG93TGVnZW5kID0gcmVzdWx0LnNob3dMZWdlbmQgfHwgZmFsc2VcbiAgICAgIHRoaXMuZHJhd1BpZSgpXG5cbiAgICB9KSovXG59XG5mdW5jdGlvbiBidWlsZExpbmVDaGFydCgpIHtcbiAgICBjb250YWluZXIgPSBjcmVhdGVMaW5lQ2hhcnRTaWRlYmFyQ29udGFpbmVyKCk7XG4gICAgLy8gR2V0IHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBjb250YWluZXIgYW5kIHVzZSBpdCB0byBidWlsZCB0aGUgY2FudmFzXG4gICAgdmFyIHdpZHRoID0gKyh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShjb250YWluZXIpLndpZHRoLnNwbGl0KCdweCcpWzBdKTtcbiAgICB3aWR0aCA9IE1hdGguZmxvb3Iod2lkdGggLyA1MCkgKiA1MDtcbiAgICAvLyBDcmVhdGUgdGhlIGNhbnZhcyB0byBwdXQgdGhlIGNoYXJ0IGluXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgLy8gQmVmb3JlIGNyZWF0aW5nIHRoZSBDaGFydHMuanMgdGhpbmcgZW5zdXJlIHRoYXQgd2Ugc2V0IHRoZVxuICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgdG8gYmUgdGhlIGNvbXB1dGVkIHdpZHRoIG9mIHRoZSBjb250YWluaW5nIGRpdlxuICAgIGNhbnZhcy5pZCA9ICdsaW5lY2FudmFzJztcbiAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgbGluZUNhbnZhcyA9IGNhbnZhcztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobGluZUNhbnZhcyk7XG4gICAgY3JlYXRlQ2hhcnQoKTtcbiAgICAvLyBHZXQgd2hldGhlciBvciBub3Qgd2Ugc2hvdWxkIGRyYXcgdGhlIGxlZ2VuZCBmcm9tIHRoZSBzeW5jIHN0b3JhZ2UgYW5kIGRyYXcgdGhlIGNoYXJ0XG4gICAgLypjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChbJ3Nob3dMZWdlbmQnXSwgKHJlc3VsdCkgPT4ge1xuICAgICAgdGhpcy5jcmVhdGVDaGFydCgpXG4gICAgfSkqL1xufVxuZnVuY3Rpb24gY3JlYXRlQ2hhcnQoKSB7XG4gICAgcGllQ2FudmFzLmhlaWdodCArPSAxMDAwOyAvLygyMCAqIE1hdGguY2VpbCgxNCAvIDIpKVxuICAgIGxldCB0b3RhbF95ZWFyID0gMzsgLy90cmVuZGRhdGFbJ3llYXInXS5jb3VudFxuICAgIGNvbnNvbGUubG9nKHRvdGFsX3llYXIpO1xuICAgIGxldCB5ZWFycyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG90YWxfeWVhcjsgaSsrKSB7XG4gICAgICAgIHllYXJzW2ldID0gdHJlbmRkYXRhWyd5ZWFyJ11baV07XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHllYXJzKTtcbiAgICBsZXQgY2hhcnRTdGF0dXMgPSBjaGFydF9qc18xLkNoYXJ0LmdldENoYXJ0KGxpbmVDYW52YXMpOyAvLyA8Y2FudmFzPiBpZFxuICAgIGlmIChjaGFydFN0YXR1cyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2hhcnRTdGF0dXMuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZygnZGQnKTtcbiAgICB9XG4gICAgY29uc3QgY2hhcnQxID0gbmV3IGNoYXJ0X2pzXzEuQ2hhcnQobGluZUNhbnZhcywge1xuICAgICAgICB0eXBlOiAnbGluZScsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGxhYmVsczogdHJlbmRkYXRhWyd5ZWFyJ10sXG4gICAgICAgICAgICBkYXRhc2V0czogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8wXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBpbmZvcm1hdGlvblR5cGVzWzBdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0cmVuZGRhdGFbaW5mb3JtYXRpb25UeXBlc1swXV0sXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3Jfb3B0aW9uc1swXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogaW5mb3JtYXRpb25UeXBlc1sxXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdHJlbmRkYXRhW2luZm9ybWF0aW9uVHlwZXNbMV1dLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yX29wdGlvbnNbMV1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHsgbGFiZWw6IGluZm9ybWF0aW9uVHlwZXNbMl0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRyZW5kZGF0YVtpbmZvcm1hdGlvblR5cGVzWzJdXSxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcl9vcHRpb25zWzJdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiBpbmZvcm1hdGlvblR5cGVzWzNdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0cmVuZGRhdGFbaW5mb3JtYXRpb25UeXBlc1szXV0sXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3Jfb3B0aW9uc1szXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogaW5mb3JtYXRpb25UeXBlc1s0XSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdHJlbmRkYXRhW2luZm9ybWF0aW9uVHlwZXNbNF1dLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yX29wdGlvbnNbNF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHsgbGFiZWw6IGluZm9ybWF0aW9uVHlwZXNbNV0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRyZW5kZGF0YVtpbmZvcm1hdGlvblR5cGVzWzVdXSxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcl9vcHRpb25zWzVdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiBpbmZvcm1hdGlvblR5cGVzWzZdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0cmVuZGRhdGFbaW5mb3JtYXRpb25UeXBlc1s2XV0sXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3Jfb3B0aW9uc1s2XVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogaW5mb3JtYXRpb25UeXBlc1s3XSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdHJlbmRkYXRhW2luZm9ybWF0aW9uVHlwZXNbN11dLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yX29wdGlvbnNbN11cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHsgbGFiZWw6IGluZm9ybWF0aW9uVHlwZXNbOF0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRyZW5kZGF0YVtpbmZvcm1hdGlvblR5cGVzWzhdXSxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcl9vcHRpb25zWzhdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiBpbmZvcm1hdGlvblR5cGVzWzldLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0cmVuZGRhdGFbaW5mb3JtYXRpb25UeXBlc1s5XV0sXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3Jfb3B0aW9uc1s5XVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogaW5mb3JtYXRpb25UeXBlc1sxMF0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRyZW5kZGF0YVtpbmZvcm1hdGlvblR5cGVzWzEwXV0sXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3Jfb3B0aW9uc1sxMF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHsgbGFiZWw6IGluZm9ybWF0aW9uVHlwZXNbMTFdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0cmVuZGRhdGFbaW5mb3JtYXRpb25UeXBlc1sxMV1dLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yX29wdGlvbnNbMTFdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiBpbmZvcm1hdGlvblR5cGVzWzEyXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdHJlbmRkYXRhW2luZm9ybWF0aW9uVHlwZXNbMTJdXSxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcl9vcHRpb25zWzEyXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgYXNwZWN0UmF0aW86IDAuNSxcbiAgICAgICAgICAgIHBsdWdpbnM6IHtcbiAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdib3R0b20nLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBmYWxzZSwgLy9zaG93TGVnZW5kLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gZHJhd1BpZSgpIHtcbiAgICB2YXIgc2hvd0xlZ2VuZCA9IHRydWU7XG4gICAgcGllQ2FudmFzLmhlaWdodCArPSAoMjAgKiBNYXRoLmNlaWwoMTQgLyAyKSk7XG4gICAgcGllQ2FudmFzLmhlaWdodCA9IDEwMDA7XG4gICAgbGV0IGNoYXJ0U3RhdHVzID0gY2hhcnRfanNfMS5DaGFydC5nZXRDaGFydChwaWVDYW52YXMpOyAvLyA8Y2FudmFzPiBpZFxuICAgIGlmIChjaGFydFN0YXR1cyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2hhcnRTdGF0dXMuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZygnZGQnKTtcbiAgICB9XG4gICAgY29uc3QgY2hhcnQgPSBuZXcgY2hhcnRfanNfMS5DaGFydChwaWVDYW52YXMsIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZGF0YXNldHM6IFt7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3Jfb3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5mb2NvdW50cyxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdpbmZvcm1hdGlvblR5cGVzJyxcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIGxhYmVsczogaW5mb3JtYXRpb25UeXBlcyxcbiAgICAgICAgfSxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgcGx1Z2luczoge1xuICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbScsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlUG9pbnRTdHlsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveFdpZHRoOiA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogeyBzaXplOiAxMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVMYWJlbHM6IGZ1bmN0aW9uIChjaGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdMZWdlbmRzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1bUNvdW50ID0gaW5mb2NvdW50cy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFydC5kYXRhLmxhYmVscy5mb3JFYWNoKGZ1bmN0aW9uIChsYWJlbCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJ0LmRhdGEuZGF0YXNldHNbMF0uZGF0YVtpbmRleF0gPT0gMCkgLy96ZXJvIHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGVnZW5kID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogYCR7Y2hhcnQuZGF0YS5sYWJlbHNbaW5kZXhdfSAkeyhpbmZvY291bnRzW2luZGV4XSAvIHN1bUNvdW50ICogMTAwKS50b0ZpeGVkKDEpfSVgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbFN0eWxlOiBjaGFydC5kYXRhLmRhdGFzZXRzWzBdLmJhY2tncm91bmRDb2xvcltpbmRleF0sIGRhdGFzZXRJbmRleDogaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3TGVnZW5kcy5wdXNoKGxlZ2VuZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld0xlZ2VuZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgdHlwZTogJ3BpZScsXG4gICAgfSk7XG4gICAgLy90aGlzLmxvYWRfbW9kZWwoKVxuICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgdG8gZ2V0IHRoZSBzbGl0Y2UgdGhhdCB3YXMgY2xpY2tlZCBvblxuICAgIC8vIFdpbGwgcmVkaXJlY3QgdG8gYSBsaXN0IG9mIHRoZSB1c2VyJ3MgcmVwb3Mgb2YgdGhhdCBsYW5ndWFnZVxuICAgIHBpZUNhbnZhcy5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgY29uc3Qgc2xpY2UgPSBjaGFydC5nZXRFbGVtZW50c0F0RXZlbnRGb3JNb2RlKGUsICduZWFyZXN0JywgeyBpbnRlcnNlY3Q6IHRydWUgfSwgdHJ1ZSlbMF07XG4gICAgICAgIC8vaWYgKHNsaWNlID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIH1cbiAgICAgICAgLy8gSGF2ZSB0byBlbmNvZGUgaXQgaW4gY2FzZSBvZiBDKysgYW5kIEMjXG4gICAgICAgIC8vY29uc3QgbGFuZ3VhZ2UgPSBlbmNvZGVVUklDb21wb25lbnQobGFuZ3Nbc2xpY2UuaW5kZXhdLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgIGxldCBpbmQgPSBpbmZvcm1hdGlvblR5cGVzW3NsaWNlLmluZGV4XTtcbiAgICAgICAgLy8kKCdwJykuaHRtbChpbmQpO1xuICAgICAgICBpZiAoSXNzdWVfcGFnZSkge1xuICAgICAgICAgICAgdmFyIHBOb2RlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdwJyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gcE5vZGVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcE5vZGVzW2ldLmlubmVySFRNTCA9IHBOb2Rlc1tpXS5pbm5lckhUTUwucmVwbGFjZUFsbCgnPHNwYW4gc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiNGRkNDQ0JcIj4nLCAnJyk7XG4gICAgICAgICAgICAgICAgcE5vZGVzW2ldLmlubmVySFRNTCA9IHBOb2Rlc1tpXS5pbm5lckhUTUwucmVwbGFjZUFsbCgnPFxcc3Bhbj4nLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBUeXBlcy5maW5kSW5kZXgoKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBpbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhTZW5MaXN0W2luZGV4XSlcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbiA9IFNlbkxpc3RbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBzZW4gPSBzZW4ucmVwbGFjZUFsbCgnXFxuJywgJzxicmVha2E+Jyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbiA9IHNlbi5yZXBsYWNlQWxsKCdcXHInLCAnPGJyZWFrYT4nKTtcbiAgICAgICAgICAgICAgICAgICAgc2VuID0gc2VuLnJlcGxhY2VBbGwoJyoqJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBzZW4gPSBzZW4ucmVwbGFjZUFsbCgnYGBgJywgJzxicmVha2E+Jyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbiA9IHNlbi5yZXBsYWNlQWxsKCdgJywgJzxicmVha2E+Jyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZWdleEZvclBlcmlvZCA9IC9cXC5cXHMvZzsgLy9yZWdleCB0byBmaW5kIHBlcmlvZFxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVnZXhGb3JRdWVzdGlvbiA9IC9cXD9cXHMvZzsgLy9yZWdleCB0byBmaW5kIHF1ZXN0aW9uIG1hcmtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlZ2V4Rm9yV29uZGVyID0gL1xcIVxccy9nO1xuICAgICAgICAgICAgICAgICAgICBzZW4gPSBzZW4ucmVwbGFjZUFsbChyZWdleEZvclBlcmlvZCwgJzxicmVha2E+Jyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbiA9IHNlbi5yZXBsYWNlQWxsKHJlZ2V4Rm9yUXVlc3Rpb24sICc8YnJlYWthPicpO1xuICAgICAgICAgICAgICAgICAgICBzZW4gPSBzZW4ucmVwbGFjZUFsbChyZWdleEZvcldvbmRlciwgJzxicmVha2E+Jyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbiA9IHNlbi5yZXBsYWNlKC9AXFxTKy9nLCAnPGJyZWFrYT4nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbi5pbmRleE9mKCdbJykgIT0gLTEgJiYgc2VuLmluZGV4T2YoJ10oJykgIT0gLTEgJiYgc2VuLmluZGV4T2YoJyknKSAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0ID0gc2VuLmluZGV4T2YoJ10oJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW5kID0gc2VuLmluZGV4T2YoJyknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2VuPXNlbi5yZXBsYWNlKCddKCcsJzxicmVha2E+JylcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbiA9IHNlbi5zbGljZSgwLCBzdCkgKyAnPGJyZWFrYT4nICsgc2VuLnNsaWNlKGVuZCArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VuID0gc2VuLnJlcGxhY2UoJ1snLCAnPGJyZWFrYT4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3Nzc3Nzc3Nzc3MnKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VuKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZW4gPSBzZW4ucmVwbGFjZSgvaHR0cFtzXT9cXFMrL2csICc8YnJlYWthPicpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbGlzdGEgPSBzZW4uc3BsaXQoJzxicmVha2E+Jyk7XG4gICAgICAgICAgICAgICAgICAgIC8vdiA9ICQoZWxlbSkuaHRtbCgpO1xuICAgICAgICAgICAgICAgICAgICAvL3Y9di5yZXBsYWNlKFNlbkxpc3RbaW5kZXhdLCc8c3BhbiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6cmVkXCI+JytTZW5MaXN0W2luZGV4XSArJzwvc3Bhbj4nKVxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuZ2V0Q29tbWVudHMoKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGFbaV0gPSBsaXN0YVtpXS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGFbaV0ubGVuZ3RoIDw9IDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhsaXN0YVtpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcE5vZGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3AnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwLCBsZW5ndGggPSBwTm9kZXMubGVuZ3RoOyBwIDwgbGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHBOb2Rlc1tpXS5pbm5lckhUTUwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBOb2Rlc1twXS5pbm5lclRleHQuaW5kZXhPZihsaXN0YVtpXSkgIT0gLTEpIHsgLy8gY29uc29sZS5sb2cocE5vZGVzW3BdLmlubmVyVGV4dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcE5vZGVzW3BdLmlubmVySFRNTCA9IHBOb2Rlc1twXS5pbm5lckhUTUwucmVwbGFjZShsaXN0YVtpXSwgJzxzcGFuIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjojRkZDQ0NCXCI+JyArIGxpc3RhW2ldICsgJzwvc3Bhbj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gU2V0IHVwIGEgbGlzdGVuZXIgZm9yIGNoYW5nZXMgdG8gdGhlIGBzaG93TGVnZW5kYCBrZXkgb2Ygc3RvcmFnZVxuICAgIGNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgbmFtZXNwYWNlKSA9PiB7XG4gICAgICAgIGlmICgnc2hvd0xlZ2VuZCcgaW4gY2hhbmdlcykge1xuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBjaGFydCB0byBzZXQgdGhlIGxlZ2VuZCBkaXNwbGF5IHRvIHRoZSBuZXdWYWx1ZSBvZiB0aGUgc3RvcmFnZVxuICAgICAgICAgICAgY2hhcnQub3B0aW9ucy5wbHVnaW5zLmxlZ2VuZC5kaXNwbGF5ID0gY2hhbmdlcy5zaG93TGVnZW5kLm5ld1ZhbHVlO1xuICAgICAgICAgICAgY2hhcnQudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldFJlc29sdXRpb25TdGFnZSgpIHtcbiAgICBjb25zdCAkZGlzY3Vzc2lvbnMgPSBxc2EoZG9jdW1lbnQsICcuanMtc29ja2V0LWNoYW5uZWwnKTtcbiAgICAkZGlzY3Vzc2lvbnMuZm9yRWFjaChkaXNjID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZGlzYy5pbm5lckhUTUwpXG4gICAgICAgIGlmIChkaXNjLmdldEF0dHJpYnV0ZShcImlkXCIpID09ICdwYXJ0aWFsLWRpc2N1c3Npb24tc2lkZWJhcicpIHtcbiAgICAgICAgICAgIGRpc2MuaW5uZXJIVE1MICs9ICc8ZGl2IGNsYXNzPVwiZGlzY3Vzc2lvbi1zaWRlYmFyLWl0ZW0ganMtZGlzY3Vzc2lvbi1zaWRlYmFyLWl0ZW1cIj4gPGg2IGNsYXNzPS9cImRpc2N1c3Npb24tc2lkZWJhci1oZWFkaW5nIHRleHQtYm9sZC9cIj4gSXNzdWUgUmVzb2x1dGlvbiBTdGFnZSA8L2g2PiAgPHNwYW4gY2xhc3M9XCJjc3MtdHJ1bmNhdGUgc2lkZWJhci1wcm9ncmVzcy1iYXJcIj4nICsgU3RhZ2UgKyAnPC9zcGFuPiA8L2Rpdj4nO1xuICAgICAgICAgICAgZGlzYy5pbm5lckhUTUwgKz0gJzxkaXYgaWQ9XCJ0aW1lY2hhcnRcIj48L2Rpdj4nO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5mdW5jdGlvbiBjaGVja1VSTCgpIHtcbiAgICBsZXQgY3VyVXJsID0gZG9jdW1lbnQuVVJMO1xuICAgIGlmIChjdXJVcmwuaW5kZXhPZignZ2l0aHViLmNvbScpICE9IC0xICYmIGN1clVybC5pbmRleE9mKCcvaXNzdWVzLycpICE9IC0xKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiB2YWx1ZWNvdW50KGFycikge1xuICAgIHJldHVybiBhcnIucmVkdWNlKChwcmV2LCBjdXJyKSA9PiAocHJldltjdXJyXSA9ICsrcHJldltjdXJyXSB8fCAxLCBwcmV2KSwge30pO1xufVxuZnVuY3Rpb24gbWFpbigpIHtcbiAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHRvcGljOiBbdG9rZW4sIGRvY3VtZW50LlVSTF0gfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSByZXNwb25zZS5mYXJld2VsbDtcbiAgICAgICAgbGV0IGlzc3VlX3BhZ2UgPSByZXN1bHQuaXNzdWVfcGFnZTtcbiAgICAgICAgaWYgKGlzc3VlX3BhZ2UgPT0gJ05vIGRhdGEgZm91bmQnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHR5cGVzID0gSlNPTi5wYXJzZShyZXN1bHQuc3VtbWFyeSk7XG4gICAgICAgIFR5cGVzID0gdHlwZXM7XG4gICAgICAgIElzc3VlX3BhZ2UgPSBpc3N1ZV9wYWdlO1xuICAgICAgICBpZiAoaXNzdWVfcGFnZSkge1xuICAgICAgICAgICAgbGV0IHNlbmxpc3QgPSBKU09OLnBhcnNlKHJlc3VsdC5yYXcpO1xuICAgICAgICAgICAgU2VuTGlzdCA9IHNlbmxpc3Q7XG4gICAgICAgICAgICBsZXQgc3RhZ2UgPSByZXN1bHQuc3RhZ2U7XG4gICAgICAgICAgICBTdGFnZSA9IHN0YWdlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coU3RhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IHR5cGVzID0gSlNPTi5wYXJzZShyZXN1bHQuc3VtbWFyeSk7XG4gICAgICAgICAgICBUeXBlc0FsbCA9IHR5cGVzO1xuICAgICAgICAgICAgbGV0IHR5cGVzQ2xvc2VkID0gSlNPTi5wYXJzZShyZXN1bHQuc3VtbWFyeUNsb3NlZCk7XG4gICAgICAgICAgICBUeXBlc0Nsb3NlZCA9IHR5cGVzQ2xvc2VkO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2cnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFR5cGVzQ2xvc2VkKTtcbiAgICAgICAgICAgIGxldCB0eXBlc09wZW4gPSBKU09OLnBhcnNlKHJlc3VsdC5zdW1tYXJ5T3Blbik7XG4gICAgICAgICAgICBUeXBlc09wZW4gPSB0eXBlc09wZW47XG4gICAgICAgICAgICBsZXQgdHJlbmRhbGwgPSBKU09OLnBhcnNlKHJlc3VsdC5yYXcpO1xuICAgICAgICAgICAgdHJlbmRkYXRhQWxsID0gdHJlbmRhbGw7XG4gICAgICAgICAgICBsZXQgdHJlbmRDbG9zZWQgPSBKU09OLnBhcnNlKHJlc3VsdC5yYXdDbG9zZWQpO1xuICAgICAgICAgICAgdHJlbmRkYXRhQ2xvc2VkID0gdHJlbmRDbG9zZWQ7XG4gICAgICAgICAgICBsZXQgdHJlbmRPcGVuID0gSlNPTi5wYXJzZShyZXN1bHQucmF3T3Blbik7XG4gICAgICAgICAgICB0cmVuZGRhdGFPcGVuID0gdHJlbmRPcGVuO1xuICAgICAgICAgICAgVHlwZXMgPSBUeXBlc0FsbDtcbiAgICAgICAgICAgIHRyZW5kZGF0YSA9IHRyZW5kZGF0YUFsbDtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coVHlwZXMpXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRyZW5kZGF0YSlcbiAgICAgICAgfVxuICAgICAgICBpbmZvY291bnRzID0gbmV3IEFycmF5KDEzKS5maWxsKDApO1xuICAgICAgICBsZXQgdmFsQ291bnREaWN0ID0gdmFsdWVjb3VudChUeXBlcyk7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiB2YWxDb3VudERpY3QpIHtcbiAgICAgICAgICAgIGluZm9jb3VudHNbaW5mb3JtYXRpb25UeXBlc0RpY3Rba2V5XV0gPSB2YWxDb3VudERpY3Rba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyh2YWxDb3VudERpY3QpO1xuICAgICAgICBjcmVhdGVFbGVtZW50KCk7XG4gICAgICAgIC8vbGV0IGxuZ2NsYXNzPW5ldyBMYW5ndWFnZURpc3BsYXkocHJvZmlsZU5hbWUpXG4gICAgfSk7XG59XG5jaHJvbWUuc3RvcmFnZS5zeW5jLmdldChbJ3BlcnNvbmFsQWNjZXNzVG9rZW4nXSwgKHJlc3VsdCkgPT4ge1xuICAgIHRva2VuID0gcmVzdWx0LnBlcnNvbmFsQWNjZXNzVG9rZW4gfHwgJyc7XG4gICAgaWYgKHRva2VuICE9ICcnKSB7XG4gICAgICAgIG1haW4oKTtcbiAgICB9XG59KTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0cmVzdWx0ID0gZm4oKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcImNvbnRlbnRfc2NyaXB0XCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdH1cblx0fVxuXHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZHNbaV1dID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rZ2l0aHViX3VzZXJfbGFuZ3VhZ2VzXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2dpdGh1Yl91c2VyX2xhbmd1YWdlc1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NvbnRlbnQudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=