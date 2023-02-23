// This script is excuted directly from inside the page
import { ArcElement, Chart, Legend, LineElement, PieController, Tooltip ,BarController, LineController,BarElement,CategoryScale,Title,PointElement,LinearScale} from 'chart.js'
import * as $ from "jquery";



const informationTypes=[
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

const informationTypesDict={
'Action on Issue':0, 
'Bug Reproduction':1, 
'Contribution and Commitment':2, 
'Expected Behaviour':3, 
'Investigation and Exploration':4, 
'Motivation':5, 
'Observed Bug Behaviour':6, 
'Potential New Issues and Requests':7, 
'Social Conversation':8,
'Solution Discussion':9, 
'Task Progress':10,
'Usage':11,      
'Workarounds':12
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


var trenddata=[]
var Types=[]

var trenddataClosed=[]
var TypesClosed=[]

var trenddataOpen=[]
var TypesOpen=[]

var trenddataAll=[]
var TypesAll=[]

var SenList=[]
var Issue_page=false
var infocounts=new Array(13).fill(0);
var Stage=''
var Summary=''
var elem = "body";

var v = $(elem).html();
var token=''



// Register the parts of Chart.js I need
Chart.register(PieController, Tooltip, Legend, ArcElement, LineElement, BarController, LineController,BarElement,CategoryScale, PointElement, LinearScale, Title)

// Set an XPath syntax to find User and Organisation containers for storing the graph
const ORG_XPATH = '//*[text() = "Top languages"]'
const USER_CONTAINER_SELECTOR = 'div[itemtype="http://schema.org/Person"]'
const SIDEBAR_CONTAINER_SELECTOR = 'div[id="partial-discussion-sidebar"]'
const ISSUE_STATUS_SELECTOR = 'div[class="flex-shrink-0 mb-2 flex-self-start flex-md-self-center"]'
const CLOSED_ISSUE_STATUS_SELECTOR = 'span[title="Status: Closed"]'
const $discussions= document.querySelector(SIDEBAR_CONTAINER_SELECTOR) as HTMLDivElement

const qsa = ($el, sel) => [ ...$el.querySelectorAll(sel) ];
let sentenceList=[];

const PROJECT_PAGE_SIDEBAR_SELECTOR='div[class="BorderGrid BorderGrid--spacious"]'

const original = $("body").html();
var senC=0

let pieCanvas=null;
let lineCanvas=null
let container=null
let parent=null
let sidebar_parent=null

let data=null
let issuepage=false


function createElement()
{
    var issue_sidebar_parent= document.querySelector(SIDEBAR_CONTAINER_SELECTOR) as HTMLDivElement
    var project_sidebar_parent=document.querySelector(PROJECT_PAGE_SIDEBAR_SELECTOR) as HTMLDivElement
    var issue_status_container=document.querySelector(ISSUE_STATUS_SELECTOR) as HTMLDivElement
    parent = document.querySelector(USER_CONTAINER_SELECTOR)

    if(issue_sidebar_parent==null) 
    {
        sidebar_parent=project_sidebar_parent
        issuepage=false
    }
    else {
        issuepage=true
        sidebar_parent=issue_sidebar_parent
    }
    
    if(issuepage) 
    {    
        if(Stage!='' && Stage!='Fixed')
        {
            getResolutionStage();
        }
        
        buildPieChart()
        getSummary()
    
    }
    else
    {

        buildPieChart()
        buildLineChart()

    }
}

function getIssueInfo(state)
{

   
    if(state=='all'){
        Types=TypesAll
        trenddata=trenddataAll
        document.getElementById("btnall").style.borderColor='black'
        document.getElementById("btnclosed").style.borderColor='white'
        document.getElementById("btnopen").style.borderColor='white'
    }
    else if(state=='closed')
    {   Types=TypesClosed
        trenddata=trenddataClosed
        document.getElementById("btnall").style.borderColor='white'
        document.getElementById("btnclosed").style.borderColor='black'
        document.getElementById("btnopen").style.borderColor='white'

    }
    else if(state=='open')
    {   Types=TypesOpen
        trenddata=trenddataOpen
        document.getElementById("btnall").style.borderColor='white'
        document.getElementById("btnclosed").style.borderColor='whitw'
        document.getElementById("btnopen").style.borderColor='black'

    }

    infocounts=new Array(13).fill(0);
    let valCountDict=valuecount(Types)

    for (let key in valCountDict) {
            infocounts[informationTypesDict[key]]=valCountDict[key]
        }
    
    //console.log(valCountDict)
    chrome.storage.sync.get(['showLegend','personalizeInfoTypes','chartType'], (result) => {
    const showLegend = result.showLegend || false
    let personalizeInfoTypes=result.personalizeInfoTypes
    let chartType=result.chartType
    drawPie(showLegend,personalizeInfoTypes,chartType)

    })
    createChart()
}

function createSidebarContainer() {

    const div = document.createElement('div')
    div.id='PieChart-sidebar'
   
    const header = document.createElement('h4')
    const headerText = document.createTextNode('Issue Discussion Information Types')
    if(!issuepage)
    {
    const btnall=document.createElement('button')
    btnall.style.borderRadius='5px'
    btnall.id='btnall'
    btnall.innerText='All'
    btnall.style.borderRadius='5px'

    const btnopen=document.createElement('button')
    btnopen.id='btnopen'
    btnopen.innerText='Open'
    btnopen.style.borderRadius='5px'
    btnopen.style.borderColor='white'
    const btnclosed=document.createElement('button')
    btnclosed.id='btnclosed'
    btnclosed.style.borderRadius='5px'
    btnclosed.innerText='Closed'
    btnclosed.style.borderColor='white'
    //btnclosed.onclick=this.getIssueInfo;

    header.appendChild(headerText)
    header.appendChild(btnall)
    header.appendChild(btnopen)
    header.appendChild(btnclosed)

    btnall.addEventListener("click", function(){getIssueInfo('all')});
    btnclosed.addEventListener("click", function(){getIssueInfo('closed')});
    btnopen.addEventListener("click", function(){getIssueInfo('open')});
    
    }
    else
    {
        header.appendChild(headerText)
    }


    div.classList.add('color-border-secondary', 'pt-3', 'mt-3', 'clearfix', 'hide-sm', 'hide-md')
    header.classList.add('mb-2', 'h4')
    div.appendChild(header)

    // Append the container to the parent
    sidebar_parent.appendChild(div)
    

    return div
}

function createLineChartSidebarContainer() {

    const div = document.createElement('div')
    div.id='linechart'
    div.classList.add('border-top', 'color-border-secondary', 'pt-3', 'mt-3', 'clearfix', 'hide-sm', 'hide-md')
    sidebar_parent.appendChild(div)
    return div
}


function createCanvas(width: number) {
    width = Math.floor(width / 50) * 50
    // Create the canvas to put the chart in
    const canvas = document.createElement('canvas')
    canvas.id = 'pie-chart-canvas'
    canvas.width = width
    canvas.height = width
    return canvas
}

function buildPieChart() {
    container = createSidebarContainer()
    // Get the width and height of the container and use it to build the canvas
    const width = +(window.getComputedStyle(container).width.split('px')[0])
    pieCanvas = createCanvas(width)
    container.appendChild(pieCanvas)
    chrome.storage.sync.get(['showLegend','personalizeInfoTypes','chartType'], (result) => {
      const showLegend = result.showLegend || false
      let chartType=result.chartType
      let personalizeInfoTypes=result.personalizeInfoTypes
      drawPie(showLegend,personalizeInfoTypes,chartType)

    })

}

function buildLineChart() {
    container = createLineChartSidebarContainer()
    // Get the width and height of the container and use it to build the canvas
    var width = +(window.getComputedStyle(container).width.split('px')[0])
    width = Math.floor(width / 50) * 50
    // Create the canvas to put the chart in
    const canvas = document.createElement('canvas')
    // Before creating the Charts.js thing ensure that we set the
    // width and height to be the computed width of the containing div
    canvas.id = 'linecanvas'
    canvas.width = width
    canvas.height = width

    lineCanvas = canvas
    container.appendChild(lineCanvas)
    createChart()
}
function createChart(){

    pieCanvas.height += 1000//(20 * Math.ceil(14 / 2))
 
    let chartStatus = Chart.getChart(lineCanvas); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
    
    const chart1 = new Chart(lineCanvas, {
    type: 'line', //this denotes tha type of chart

    data: {// values on X-Axis
      labels: trenddata['year'], 
       datasets: [
      {
          //0
        label: informationTypes[0],
            data: trenddata[informationTypes[0]],
        backgroundColor: color_options[0]
          },
        {label: informationTypes[1],
            data: trenddata[informationTypes[1]],
        backgroundColor: color_options[1]
          },
        {label: informationTypes[2],
            data: trenddata[informationTypes[2]],
        backgroundColor: color_options[2]
          },
        {label: informationTypes[3],
            data: trenddata[informationTypes[3]],
        backgroundColor: color_options[3]
          },
        {label: informationTypes[4],
            data: trenddata[informationTypes[4]],
        backgroundColor: color_options[4]
          }
           ,
        {label: informationTypes[5],
            data: trenddata[informationTypes[5]],
        backgroundColor: color_options[5]
          }
           ,
        {label: informationTypes[6],
            data: trenddata[informationTypes[6]],
        backgroundColor: color_options[6]
          }
           ,
        {label: informationTypes[7],
            data: trenddata[informationTypes[7]],
        backgroundColor: color_options[7]
          }
           ,
        {label: informationTypes[8],
            data: trenddata[informationTypes[8]],
        backgroundColor: color_options[8]
          }
           ,
        {label: informationTypes[9],
            data: trenddata[informationTypes[9]],
        backgroundColor: color_options[9]
          }
           ,
        {label: informationTypes[10],
            data: trenddata[informationTypes[10]],
        backgroundColor: color_options[10]
          }
           ,
        {label: informationTypes[11],
            data: trenddata[informationTypes[11]],
        backgroundColor: color_options[11]
          }
           ,
        {label: informationTypes[12],
            data: trenddata[informationTypes[12]],
        backgroundColor: color_options[12]
          }

    ]
    },
    options: {
    aspectRatio:0.5,
              plugins: {
        legend: {    
        position:'bottom',
            display: false,//showLegend,
              }
              }
    }

    });
}


function drawPie(showLegend,personalizeInfoTypes,chartType) {
    console.log(showLegend)
    console.log(personalizeInfoTypes)
    console.log(chartType)
    pieCanvas.height += (20 * Math.ceil(14))
    let chartStatus = Chart.getChart(pieCanvas); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();

    }
    

    const chart = new Chart(pieCanvas, {

    data: {
    datasets: [{
      backgroundColor: color_options,
      data: infocounts,
      label: 'informationTypes',
    }],
    labels: informationTypes,

    },
    
        

    options: {
         aspectRatio:0.8,
scales:{
            x: {
                display: false
            },
            y: {
                display:chartType=='pie'?false:true,
                ticks:
                {
                    display: false
                }
                
            }
        },
    plugins: {
        legend: {    
        position:'bottom',
        display: showLegend,
            
        labels: { 
                usePointStyle: true,
                boxWidth: 6,
                font: {size: 10},

    generateLabels: function (chart) {
        var newLegends = [];

            
            var sumCount=infocounts.reduce((a, b) => a + b, 0)
            chart.data.labels.forEach(function (label, index) {
                if (chart.data.datasets[0].data[index] == 0) //zero values
                    return;
                if(personalizeInfoTypes[index]==false) return
                
                var legend = {
                    text: `${chart.data.labels[index]} ${(infocounts[index]/sumCount*100).toFixed(1)}%`,
                    fillStyle: chart.data.datasets[0].backgroundColor[index],datasetIndex:index
                };
                newLegends.push(legend)
            });
    
    return newLegends;
          }
        }
      },
    },
    },
    type: chartType,

    })
    for( let i=0;i< personalizeInfoTypes.length;i++){
        if(personalizeInfoTypes[i]==false)
        {
            chart.toggleDataVisibility(i)
        }
    } chart.update()

    pieCanvas.onclick = (e) => {
    const slice = chart.getElementsAtEventForMode(e, 'nearest', {intersect: true}, true)[0]
    let ind=informationTypes[slice.index]
    //$('p').html(ind);
    if(Issue_page){
    var pNodes = document.getElementsByTagName('p');
    for (var i=0, length=pNodes.length; i < length; i++) {
            pNodes[i].innerHTML = pNodes[i].innerHTML.replaceAll('<span style="background-color:#FFCCCB">','');
            pNodes[i].innerHTML = pNodes[i].innerHTML.replaceAll('<\span>','');
          }

    let summaryHeaderHolder = document.getElementById('summaryHeader')
    summaryHeaderHolder.innerHTML='Summary - '+ind

    let textareaholder = document.getElementById('Summary')
    textareaholder.innerHTML=''
    for (let sent in Summary[ind]){
        textareaholder.innerHTML+=Summary[ind][sent]+'\n\n';}
        
    textareaholder.style.width='300px'
    textareaholder.style.height = '0';
    textareaholder.style.height= textareaholder.scrollHeight + "px";
    //console.log( textareaholder.style.height)
    Types.findIndex((value, index) => {

      if (value == ind) {
        //console.log(SenList[index])
        let sen=SenList[index]

        sen=sen.replaceAll('\n','<breaka>')
        sen=sen.replaceAll('\r','<breaka>')
        sen=sen.replaceAll('**','')
        sen=sen.replaceAll('```','<breaka>')
        sen=sen.replaceAll('`','<breaka>')

        var regexForPeriod =   /\.\s/g;       //regex to find period
        var regexForQuestion = /\?\s/g;     //regex to find question mark
        var regexForWonder =   /\!\s/g; 
          
        sen=sen.replaceAll(regexForPeriod,'<breaka>')
        sen=sen.replaceAll(regexForQuestion,'<breaka>')
        sen=sen.replaceAll(regexForWonder,'<breaka>')

        sen=sen.replace(/@\S+/g, '<breaka>')
          
          
        if(sen.indexOf('[')!=-1 &&  sen.indexOf('](')!=-1 && sen.indexOf(')')!=-1)
        {
            let st=sen.indexOf('](')
            let end=sen.indexOf(')')
                  
            sen=sen.slice(0, st) + '<breaka>'+sen.slice(end+1);
            sen=sen.replace('[','<breaka>')


        }
          
        sen = sen.replace(/http[s]?\S+/g, '<breaka>')

        let lista=sen.split('<breaka>')
          
        //v = $(elem).html();

        //v=v.replace(SenList[index],'<span style="background-color:red">'+SenList[index] +'</span>')
    //this.getComments();
          
        for (let i = 0; i < lista.length; i++)
        {
            lista[i]=lista[i].trim() 
            if(lista[i].length<=1) continue
    
            //console.log(lista[i])
            
            var pNodes = document.getElementsByTagName('p');
            for (var p=0, length=pNodes.length; p < length; p++) {
                 
                  if(pNodes[p].innerText.indexOf(lista[i])!=-1)
                  {  
                      pNodes[p].innerHTML = pNodes[p].innerHTML.replace(lista[i],'<span style="background-color:#FFCCCB">'+lista[i] +'</span>');
                  }

          }
        }
        

      }

    })

    }

    }

    // Set up a listener for changes to the `showLegend` key of storage
    chrome.storage.onChanged.addListener((changes, namespace) => {
    if ('showLegend' in changes) {
    // Update the chart to set the legend display to the newValue of the storage
    chart.options.plugins.legend.display = changes.showLegend.newValue
    chart.update()
    }
    
        
        
    })
}


function getResolutionStage()
{ 
    const $discussions = qsa(document, '.js-socket-channel');
    $discussions.forEach(disc => {
           // console.log(disc.innerHTML)
         if(disc.getAttribute("id")=='partial-discussion-sidebar')
             {

                       disc.innerHTML+='<div class="discussion-sidebar-item js-discussion-sidebar-item"> <h6 class=/"discussion-sidebar-heading text-bold/"> Issue Resolution Stage </h6>  <span class="css-truncate sidebar-progress-bar">'+Stage+'</span> </div>'

                      disc.innerHTML+='<div id="timechart"></div>'
             }

    });


}

function getSummary()
{ 

    let  defaultInfoType='Solution Discussion'

    const div = document.createElement('div')
    div.id='summary'
    //div.height=1000
    const header = document.createElement('h4')
    header.id='summaryHeader'
    //const headerText = document.createTextNode('Summary')
    
    header.innerHTML='Summary - '+defaultInfoType
    //header.appendChild(headerText)

    const textareaholder = document.createElement('TEXTAREA')
    textareaholder.id='Summary'
    textareaholder.setAttribute("readonly", "readonly");
    
    for (let sent in Summary[defaultInfoType]){
        textareaholder.innerHTML+=Summary[defaultInfoType][sent]+'\n\n';}
    

    div.classList.add('color-border-secondary', 'pt-3', 'mt-3', 'clearfix', 'hide-sm', 'hide-md')
    header.classList.add('mb-2', 'h4')
    div.appendChild(header)
    div.appendChild(textareaholder)

    // Append the container to the parent
    sidebar_parent.appendChild(div)
    
    
    chrome.storage.sync.get(['defaultInfoType'], (result) => {
       defaultInfoType = result.defaultInfoType
        let textareaholder = document.getElementById('Summary')
        textareaholder.innerHTML=''
        
        if(!(defaultInfoType in Object.keys(Summary)) && Object.keys(Summary).length!=0)
            {
                defaultInfoType=Object.keys(Summary)[0]
            }
    
        let summaryHeaderHolder = document.getElementById('summaryHeader')
        summaryHeaderHolder.innerHTML='Summary - '+defaultInfoType
        for (let sent in Summary[defaultInfoType]){
            textareaholder.innerHTML+=Summary[defaultInfoType][sent]+'\n\n';}

        textareaholder.style.width='300px'
        textareaholder.style.height= textareaholder.scrollHeight + "px";
                })
    

}


function checkURL()
{
    let curUrl=document.URL
    if (curUrl.indexOf('github.com')!=-1 && curUrl.indexOf('/issues/')!=-1)
    {
    return true
    }
    return false

}

function valuecount(arr) {
    return arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
}


function main()
{

    chrome.runtime.sendMessage(
    {topic: [token,document.URL]},
    function(response) {

    let result = response.farewell;

    let issue_page=result.issue_page
    if(issue_page=='No data found')
    {
        return
    }

    let types=JSON.parse(result.summary)

    Types=types
    Issue_page=issue_page


    if(issue_page)
    {   
        let senlist=JSON.parse(result.raw)
        SenList=senlist
        let stage=result.stage
        Stage=stage
        //console.log(Stage)
        
        let summary=JSON.parse(result.summaryDict)
        Summary=summary
        //console.log(summary)
    }         
    else
    {
        let types=JSON.parse(result.summary)
        TypesAll=types
        let typesClosed=JSON.parse(result.summaryClosed)
        TypesClosed=typesClosed
        //console.log(TypesClosed)
        let typesOpen=JSON.parse(result.summaryOpen)
        TypesOpen=typesOpen

        let trendall=JSON.parse(result.raw)
        trenddataAll=trendall
        let trendClosed=JSON.parse(result.rawClosed)
        trenddataClosed=trendClosed
        let trendOpen=JSON.parse(result.rawOpen)
        trenddataOpen=trendOpen

        Types=TypesAll
        trenddata=trenddataAll

        //console.log(Types)
        //console.log(trenddata)
    }


    infocounts=new Array(13).fill(0);
    let valCountDict=valuecount(Types)

    for (let key in valCountDict) {
            infocounts[informationTypesDict[key]]=valCountDict[key]
        }
        //console.log(valCountDict)
        
        createElement()

    //let lngclass=new LanguageDisplay(profileName)

    });

}


chrome.storage.sync.get(['personalAccessToken'], (result) => {
    token = result.personalAccessToken || ''
    if(token!='') 
    {
        main()
    }
})
