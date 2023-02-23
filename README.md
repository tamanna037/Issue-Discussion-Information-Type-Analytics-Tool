# Issue Discussion Information Type Detection Tool

### Liscence
The project is liscensed under MIT License, Copyright 2022 Tamanna. Get to know about the [liscense](https://github.com/tamanna037/InformationTypesDetectionNLP/blob/main/LICENSE) from here.

### Goal
Issue Information Type Detector(ITTD) Tool detects the information types each sentence of a comment/post of a github issue is providng in order to support various software engineering activities.  The following 13 information types will be detected. Detailed information on information type can be found [here](https://uofc-my.sharepoint.com/:b:/g/personal/gias_uddin_ucalgary_ca/ESoFon0fZptLsMOZTT5bKTYBzqqC7G3W6-jt04HgYzzvtQ). 
1. Action on Issue
2. Bug Reproduction
3. Contribution and Commitment 
4. Expected Behaviour
5. Investigation and Exploration
6. Motivation 
7. Observed Bug Behaviour
8. Potential New Issues and Requests
9. Social Conversation 
10. Solution Discussion
11. Task Progress
14. Usage 
15. Workarounds


### How to run 
1. Clone the repository of the project and go tho folder of the repository.
2. In terminal, run the following commands:
   ```
    npm install
    pip3 install virtualenv
    virtualenv newenv
    source newenv/bin/activate
    pip3 install -r requirements.txt
    python -m spacy download en_core_web_sm
    python mysite/manage.py runserver
    
   ``` 
 3. Visit chrome://extensions in your browser , Turn on Developer Mode,  Click Load Unpacked and Open the dist folder in the prompt that is displayed
 4. Click on the extension button on your browser, select this extension and Input your github token. ![.](https://github.com/tamanna037/Issue-Discussion-Information-Type-Analytics-Tool/blob/main/img/token.png)
5. Go to any repository or issue page to get the information type distribution. 
