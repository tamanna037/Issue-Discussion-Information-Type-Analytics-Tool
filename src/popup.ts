interface ISyncData {
  showLegend : boolean
  personalAccessToken : string
  defaultInfoType : string
  personalizeInfoTypes:boolean[]
  chartType: string
}

chrome.storage.sync.get(['showLegend','personalAccessToken','defaultInfoType','personalizeInfoTypes','chartType'], (result: ISyncData) => {
  setup(result)
})



async function setup(result: ISyncData) {
    
  //load HTML Elements
  const chartLegendCheck : HTMLInputElement = document.getElementById('show-legend') as HTMLInputElement
  const personalTokenInput : HTMLInputElement = document.getElementById('personal-access-token') as HTMLInputElement
  const defaultInfoTypeValue : HTMLInputElement = document.getElementById('default-info-types') as HTMLInputElement
  const personalizedInfoTypeInputList : NodeListOf<HTMLInputElement>  = document.getElementsByName('personalized-info-types') as NodeListOf<HTMLInputElement>
  const chartTypeButton : NodeListOf<HTMLInputElement> = document.getElementsByName('chartType') as NodeListOf<HTMLInputElement>
 
  //Saved Values of HTML Element
  const showLegend = result.showLegend!=null ? result.showLegend : true
  const personalAccessToken : string = result.personalAccessToken || ''
  const defaultInfoType = result.defaultInfoType  || 'Solution Discussion'
  const personalizeInfoTypes=result.personalizeInfoTypes
  const chartType=result.chartType || 'pie'

  //Update HTML element with save values    
  chartLegendCheck.checked = showLegend
  defaultInfoTypeValue.value=defaultInfoType 
  personalTokenInput.value = personalAccessToken
    
  //console.log(personalizeInfoTypes)
  if(personalizeInfoTypes!=null)
  {
    for (let i = 0; i < personalizedInfoTypeInputList.length; i++) {
        personalizedInfoTypeInputList[i].checked=personalizeInfoTypes[i]          
    }
  }
  else
  {
    for (let i = 0; i < personalizedInfoTypeInputList.length; i++) {
        personalizedInfoTypeInputList[i].checked=true        
    } 
  }


    
  if(chartType=='pie') {
        chartTypeButton[0].checked=true
        chartTypeButton[1].checked=false 
    }
  else if(chartType=='bar')
    {
        chartTypeButton[0].checked=false
        chartTypeButton[1].checked=true 
    }

    
        
  if(result.showLegend==undefined)
  {
       chrome.storage.sync.set({showLegend: chartLegendCheck.checked})   
  }
    
  if(result.defaultInfoType==undefined)
  {
       chrome.storage.sync.set({defaultInfoType: defaultInfoTypeValue.value})   
  }
  if(result.chartType==undefined)
  {
       chrome.storage.sync.set({chartType: chartType})   
  }
  if(result.personalizeInfoTypes==undefined)
  {
       chrome.storage.sync.set({personalizeInfoTypes: [true,true,true,true,true,true,true,true,true,true,true,true,true]})   
  }
  if(result.personalAccessToken==undefined)
  {
    chrome.storage.sync.set({personalAccessToken: ''})
  }


    
    
  // Add event listeners to get the values when they change
  chartLegendCheck.addEventListener('click', () => {
    chrome.storage.sync.set({showLegend: chartLegendCheck.checked})
  }, false)
    

  
  defaultInfoTypeValue.addEventListener('change', () => {
        chrome.storage.sync.set({defaultInfoType: defaultInfoTypeValue.value})
  }, false)
    
        
  Array.from(chartTypeButton).forEach(el=>el.addEventListener('change', () => {
    let ctype='pie'
    if(chartTypeButton[0].checked)
    {
        ctype='pie'
    }
    else if(chartTypeButton[1].checked)
    {
        ctype='bar'
    }
    console.log(ctype)
    chrome.storage.sync.set({chartType: ctype})
   }, false))
    
  
        
   Array.from(personalizedInfoTypeInputList).forEach(el=>el.addEventListener('change', () => {
        let templist=[]
        for (let i = 0; i < personalizedInfoTypeInputList.length; i++) {
        templist.push(personalizedInfoTypeInputList[i].checked)        
        }
        chrome.storage.sync.set({personalizeInfoTypes: templist})
    }, false))    
    
    personalTokenInput.addEventListener('change', async () => {
        const token = personalTokenInput.value
        const storedData = {personalAccessToken: token}
        chrome.storage.sync.set(storedData)
    }, false)




  // Now enable the inputs for user input
  //chartLegendCheck.disabled = false
  //personalTokenInput.disabled = false
  //defaultInfoTypeValue.disabled = false
}

// Set up a listener for a click on the link to open a tab to generate a token
const tokenUrl = 'https://github.com/settings/tokens/new?description=GitHub%20User%20Languages&scopes=repo'
document.getElementById('get-token').addEventListener('click', () => {
  chrome.tabs.create({ url: tokenUrl })
}, false)
