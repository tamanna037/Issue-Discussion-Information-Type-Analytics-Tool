from django.shortcuts import render
import json
from django.contrib.auth.models import User #####
from django.http import JsonResponse , HttpResponse ####
import lightgbm as lgb
import os
import requests
import numpy as np
from sklearn import preprocessing

import requests
import os
import csv
import pandas as pd
import datetime
import spacy
import nltk
import re

from nltk.corpus import stopwords
from spacy.language import Language
from string import punctuation
from nltk.corpus import stopwords
from spacy.lang.en import English
from github import Github
from .models import SentenceTable
from gensim.models import Word2Vec
from scipy import spatial
import networkx as nx


curToken=''
#global variable 
categ = ['aa','begauth','has_code','first_turn','last_turn']
le = preprocessing.LabelEncoder()
    
labels=['Action on Issue','Bug Reproduction','Contribution and Commitment','Expected Behaviour', 'Investigation and Exploration','Motivation','Observed Bug Behaviour','Potential New Issues and Requests','Social Conversation','Solution Discussion','Task Progress','Usage','Workarounds']

isClosed=False
total=0
sentDictList = []

def index(request):
    return HttpResponse("Hello, world. ")


def getUrlInfo(curUrl):
    #githuburl='^(?:https?://)?(?:www[.])?github[.]com/[\w-]+/?''
    
    if('github.com' in curUrl):
        curUrl=curUrl[curUrl.index('github.com/')+len('github.com/'):]
        print(curUrl)
    
    urlinfolist=curUrl.split('/')
    listlen=len(urlinfolist)
    print(urlinfolist)
    if(listlen==2):
        return urlinfolist[0],urlinfolist[1],0
    elif(listlen==4):
        return urlinfolist[listlen-4],urlinfolist[listlen-3],urlinfolist[listlen-1]

    

def getallissuecomments(rep,proj):  
    global sentDictList
    global sentList
    global isClosed
    
    token = Github(curToken)
    repository = token.get_repo(rep+'/'+proj)
    
    '''if(st=='all'):
        issues = repository.get_issues()
    else: issues = repository.get_issues(state=st)'''
    
    #print(issues.totalCount)
    for st in ['open','closed']:  #,'    
        issues = repository.get_issues(state=st)
        c=0
        for issue in issues:
            sentDictList=[]
            sentList=[]
            #print(issue.number)
            if(issue.number in [196,144,68,65,42,140,47,40]):
                continue
            #if(issue.number > 40):
            #    continue
            #if(issue.number in [8068,14412, 13504,12812,11935,10949,10275,8068,16527,12220]):
            #    continue


            if(checkComments(rep,proj,issue.number)):
                continue
            print('issueno: ' + str(c) +'-> '+ str(issue.number))
            c=c+1

            getIssuePost2(rep,proj,issue.number) 
            test_df=getIssueComment2(rep,proj,issue.number)

            #print(len(sentDictList))
            #test_df = pd.DataFrame.from_records(sentDictList)
            test_df[categ] = test_df[categ].apply(le.fit_transform)
            #print(test_df)

            X_test = test_df[['len','tloc','cloc','tpos1','tpos2','clen','tlen','ppau','npau','aa','begauth','has_code','first_turn','last_turn']] 
            #print(X_test)

            clf =lgb.Booster(model_file=os.getcwd()+"/mysite/infotypedetectionlgbmodel.txt")
            #print(bst)
            y_pred=clf.predict(X_test)

            #y_pred=clf.predict([[32.0,0.5,0.002293577982,0.0,1.0,1.0,0.05555555556,0.0,0.0004647668033,3.0,1.0,0.0,1.0,0.0]])
            predict_class = np.argmax(y_pred, axis=1)
            predict_class = predict_class.tolist()

            le.fit(labels)

            predict_class = le.inverse_transform(predict_class)
            #print(predict_class)
            #print(predict_class)
            i=0
            if(isClosed):
                print('dsfjkhdskfjlhalksdjhfksjdhfkjashfkahsdk')
            for sen in sentDictList:
                #print('his')
                #print(sen)
                b=SentenceTable.objects.create(repo=rep,project=proj,issue_number=sen['issue_number'],originaltext=sen['Original Text'],processedtext=sen['Processed Text'], full_length=sen['Full Length'],length=sen['len'], tloc=sen['tloc'], cloc=sen['cloc'], tpos1=sen['tpos1'], tpos2=sen['tpos2'], clen=sen['clen'], tlen=sen['tlen'], ppau=sen['ppau'], npau=sen['npau'],begauth=sen['begauth'], has_code=sen['has_code'], first_turn=sen['first_turn'], last_turn=sen['last_turn'], aa=sen['aa'],isclosed=isClosed,code=predict_class[i], created_at=sen['created_at'])
                b.save()
                i=i+1
            
            

    #b.save()
    
    #issue = repo.get_issue(number=7684)
    #print(issue.get_comments().totalCount)
    #issues=issues[:100]
    #for issue in issues:
    #    print(issue.url)
    #[[ch for ch in word] for word in ("apple", "banana", "pear", "the", "hello")]
    #d=[[comment.created_at for comment in issue.get_comments()] 
    #d = [comment.created_at for comment in issues[0].get_comments()]
    #print(d)
    
# https://pypi.org/project/wikipedia/#description
#https://github.com/eclipse-openj9/openj9/issues/16649
def gettrendinfo(codelist):
    df=pd.DataFrame()
    df['code'] = [item[0] for item in codelist]
    df['year'] = [item[1] for item in codelist]
    #print(df)
    
    yeardf=pd.DataFrame(df.groupby(['year'])['code'].value_counts().reset_index(name='counts'))
    pivoted = yeardf.pivot(index='year', columns='code', values='counts')\
            .reset_index()
    pivoted.columns.name=None
    yearlist=pivoted.year
    for i in range(0,len(yearlist)):
      totalcount=pivoted.loc[i][1:14].sum()
      #print(totalcount)
      pivoted.loc[i]=pivoted.loc[i][1:14]/totalcount*100
      #print(pivoted.loc[i][1:14]/total)
    #pivoted.year=[2021,2022,2023]
    pivoted.year=yearlist

    return pivoted

def readfromsentencetable(rep,proj,state):
    sentlist=SentenceTable.objects.all()
    allCodelist=[(sen.code,datetime.datetime.fromtimestamp(sen.created_at).year) for sen in sentlist if sen.repo==rep and sen.project==proj] 
    closedCodelist=[(sen.code,datetime.datetime.fromtimestamp(sen.created_at).year) for sen in sentlist if sen.repo==rep and sen.project==proj and sen.isclosed==1] 
    openCodelist=[(sen.code,datetime.datetime.fromtimestamp(sen.created_at).year) for sen in sentlist if sen.repo==rep and sen.project==proj and sen.isclosed==0] 


    return [item[0] for item in allCodelist],[item[0] for item in closedCodelist],[item[0] for item in openCodelist],gettrendinfo(allCodelist),gettrendinfo(closedCodelist),gettrendinfo(openCodelist)
    
issue_page=False
 

def get_issue_info(request):

    global curToken
    global sentDictList
    global sentList
    global isClosed
    
    #get token and curURL
    msg = request.GET.get('topic', None)
    print(msg)
    curToken,curUrl=msg.split(',',1)
    rep,proj,issue_number=getUrlInfo(curUrl) 


    #getIssuePost2(rep,proj,issue_number) 
    #getIssueComment2(rep,proj,issue_number)
    #issue_number=1
    #repo='codenameone'
    #project='CodenameOne'
    #state='all'
    print(issue_number)
    
    if(issue_number!=0):
        issue_page=True
        sentDictList=[]
        sentList=[]
        stage=''
        token = Github(curToken)
        repository = token.get_repo(rep+'/'+proj)
        issue=repository.get_issue((int)(issue_number))

        if(issue.comments==0):
            stage='initialized'
        
        getIssuePost2(rep,proj,issue_number) 
        test_df=getIssueComment2(rep,proj,issue_number)
        #if(test_df==None):
        #    return
        #need to handle none
        

        test_df[categ] = test_df[categ].apply(le.fit_transform)
        X_test = test_df[['len','tloc','cloc','tpos1','tpos2','clen','tlen','ppau','npau','aa','begauth','has_code','first_turn','last_turn']] 
        #print(X_test)
        clf =lgb.Booster(model_file=os. getcwd()+"/mysite/infotypedetectionlgbmodel.txt")
        #print(bst)
        
        y_pred=clf.predict(X_test)
        
        predict_class = np.argmax(y_pred, axis=1)
        predict_class = predict_class.tolist()
        le.fit(labels)
        predict_class = le.inverse_transform(predict_class)
        #print(predict_class)
        print('isclose')
        print(isClosed)
        #labels=['Action on Issue','Bug Reproduction','Contribution and Commitment','Expected Behaviour', 'Investigation and Exploration','Motivation','Observed Bug Behaviour','Potential New Issues and Requests','Social Conversation','Solution Discussion','Task Progress','Usage','Workarounds']
        if(isClosed):
            stage='Fixed'
        else:        
            for pred in reversed(predict_class):
                if(pred=='Solution Discussion' or pred=='Workarounds' or pred=='Usage'):
                    stage='Fixing'
                    break
                elif(pred=='Investigation and Exploration' or pred=='Bug Reproduction' or pred=='Observed Bug Behaviour'):
                    stage='Investigating'
                    break
                elif(pred=='Expected Behaviour' or pred=='Motivation'):
                    stage='Initialized'

            if(stage==''):
                stage='Initialized'
            
        print(stage)
        
        test_df['code']=predict_class
        
        topDict={}
        for label in labels:
            sentences=test_df[test_df['code']==label]['Original Text'].tolist()
            print(len(sentences))
            print('------'+label+'------')
            if(len(sentences)==0):
                continue
            
            try:
                sentences_clean=[re.sub(r'[^\w\s]','',sentence.lower()) for sentence in sentences]
                stop_words = stopwords.words('english')
                sentence_tokens=[[words for words in sentence.split(' ') if words not in stop_words] for sentence in sentences_clean]
                #print(sentence_tokens)

                w2v=Word2Vec(sentence_tokens,vector_size=1,min_count=1,max_vocab_size=100) #,max_vocab_size=600,epochs=1000
                sentence_embeddings=[[w2v.wv[word][0] for word in words] for words in sentence_tokens]
                max_len=max([len(tokens) for tokens in sentence_tokens])
                sentence_embeddings=[np.pad(embedding,(0,max_len-len(embedding)),'constant') for embedding in sentence_embeddings]

                similarity_matrix = np.zeros([len(sentence_tokens), len(sentence_tokens)])
                for i,row_embedding in enumerate(sentence_embeddings):
                    for j,column_embedding in enumerate(sentence_embeddings):
                        similarity_matrix[i][j]=1-spatial.distance.cosine(row_embedding,column_embedding)

                nx_graph = nx.from_numpy_array(similarity_matrix)

                scores = nx.pagerank(nx_graph,max_iter=1000) #,tol=1e-03,alpha=0.9

                top_sentence={sentence:scores[index] for index,sentence in enumerate(sentences)}
                top=dict(sorted(top_sentence.items(), key=lambda x: x[1], reverse=True)[:5])

                topSenList=[]
                for sent in sentences:
                    if sent in top.keys():
                        topSenList.append(sent)
                        #print(sent) 
                        
                topDict[label]=topSenList
                
            except:
                print('exception')
                topSenList=[]
                c=0
                for sent in sentences:
                    if(c==5):
                        break
                    topSenList.append(sent)
                    c=c+1
                    #print(sent)
                topDict[label]=topSenList
            
       
    
        data = {
            'summary': pd.Series(predict_class).to_json(orient='values'),
            'raw': pd.Series(test_df['Original Text']).to_json(orient='values'),
            'issue_page':issue_page,
            'stage':stage,
            'summaryDict': json.dumps(topDict),
        }
        
    else:
        issue_page=False
        '''repo='codenameone'
        project='CodenameOne'
        state='all' '''
        isDownloaded=SentenceTable.objects.filter(repo=rep,project=proj).exists()
        if(isDownloaded):      
            alllist,closedlist,openlist,trendall,trendclosed,trendopen=readfromsentencetable(rep,proj,1)
            print(closedlist)
            trendall=trendall.fillna(0)
            trendclosed=trendclosed.fillna(0)
            trendopen=trendopen.fillna(0)
            
            
            print('ssd')
            print(closedlist)
            
            data = {
                'summary': pd.Series(alllist).to_json(orient='values'),#wikipedia.summary(topic, sentences=1),
                'raw': json.dumps(trendall.to_dict('list')),
                'summaryClosed': pd.Series(closedlist).to_json(orient='values'),#wikipedia.summary(topic, sentences=1),
                'rawClosed': json.dumps(trendclosed.to_dict('list')),
                'summaryOpen': pd.Series(openlist).to_json(orient='values'),#wikipedia.summary(topic, sentences=1),
                'rawOpen': json.dumps(trendopen.to_dict('list')),
                'issue_page':issue_page,
                
            }
        else:
        #SentenceTable.objects.all().delete()
            getallissuecomments(rep,proj)
            data = {
                                'summary':'No data found',
                                'raw': 'No data found',
                                'issue_page':'No data found',
                            }
        
            
        #
        #print(trend)
        

    return JsonResponse(data)


#region gloabl variable

#nltk.download('stopwords')
#stopwords = set(stopwords.words("english"))

nlp = spacy.load("en_core_web_sm") 

codes = "([\u0060]{3}([\s\S]*)[\u0060]{3})"
reply = "^[> ]([\s\S]*?)(\r\n)"
mention = "(@[\w_-]+)"

url1 = "https*\S+"
url2 = "http*\S+"



keys = ['issue_number', 'Text Content', 'Code', 'Full Length', 'len', 'tloc', 'cloc', 'tpos1', 'tpos2', 'clen', 'tlen',
        'ppau', 'npau', 'aa', 'begauth', 'has_code', 'first_turn', 'last_turn']

threadSenCnt = 0
maxThreadSenLen = 0

firstTime = 0
lastTime = 0

issuePoster = ''
sentList=[]
issueList=[]


codePattern = "([\u0060]{3}([^\u0060]*)[\u0060]{3})"
codePattern2="([\u0060]{1}([^\u0060]*)[\u0060]{1})"

codeList = []
codeIdx=0

parser = English()
stop_words = list(punctuation) + ["'s","'m","n't","'re","-","'ll",'...'] #+ stopwords.words('english')
word_count = lambda sentence: len([x for x in list(map(str,parser(sentence))) if x not in stop_words])

        
        
bullet = re.compile('^[0-9]$')
whitespace = "^((\\n)|(\\r\\n))+$"
whitespace = "^\\n+$"
#whitespace = "^[\s- \\t]+$"
#00:40:53
#whitespace="^[\\n(\\r)?]+$"

lineCnt=0
@Language.component("component")
def custom_seg(doc):
    prev = doc[0].text
    length = len(doc)
    global lineCnt
    for index, token in enumerate(doc):
        if (token.text == '.' and bullet.match(prev) and index != (length - 1)):
            doc[index + 1].sent_start = False
        elif ((token.text == '-' or token.text == '|' or token.text.endswith('|') or token.text.endswith( '>') or token.text.endswith( '|')
              or token.text.endswith('│'))
              and index != (length - 1)):
            doc[index + 1].sent_start = False
        elif(token.text=='code_placement' or token.text.startswith('.')) :
            doc[index].sent_start=False
        elif (bool(codestacktime.match(token.text)) and index != (length - 1)):
            # print('time: '+token.text)
            doc[index].sent_start = False
        elif len(token.text) < 10 and bool(re.match(whitespace, token.text) and index != (length - 1)):
            lineCnt = lineCnt+1
            doc[index + 1].sent_start = True

        prev = token.text
    return doc
nlp.add_pipe("component", before='parser')



codePattern3 = "([\u0060]{3}([\s\S]*)[\u0060]{3})"
reply="^[> ]([\s\S]*?)(\r\n)"
mention = "(@[\w_-]+)"


url1 = "https*\S+"
url2 = "http*\S+"
dotIdx=0

#endregion

def longest_sentence_length(sentence_list):
    return max([word_count(sentence) for sentence in sentence_list])

dotList=[]
def removewhitespacefromcode(line):
    global codeList
    try:
        codes = re.findall(codePattern3, line)
        line = re.sub(codePattern3, 'code_placement', line)
        for i in range(len(codes)):
            codeStr = codes[i]
            codeStrWithoutWhitespace = ' '.join(codeStr[0].split())
            codeList.append(codeStrWithoutWhitespace)
            #print(codeStrWithoutWhitespace)

        codes2 = re.findall(codePattern2, line)
        line = re.sub(codePattern2, 'code_placement', line)
        for i in range(len(codes2)):
            codeStr = codes2[i]
            codeStrWithoutWhitespace = ' '.join(codeStr[0].split())
            codeList.append(codeStrWithoutWhitespace)
            #print(codeStrWithoutWhitespace)
        return line
    except:
        return line


def removeDotURL(line):
    try:
        if('code_placement' in line):
            return line
        global dotList
        for word in line.split():
            if(word.count('.')>1):
                #print('dot -> '+word)
                dotList.append(word)
                line=line.replace(word, "dot_url")
        #print('line->'+ line)
        return line
    except:
        return line

timestampList=[]
codestacktime=re.compile("([0-1]\d|2[0-3])(:([0-5]\d))(:([0-5]\d))")
def removeTimestamp(line):
    global timestampList
    timestamps = re.findall(codestacktime, line)
    if(len(timestamps)>0):
        print(line)
    line = re.sub(codestacktime, 'CODE_TIME_STAMP', line)
    for i in timestamps:
        print(i[0])
        timestampList.append(i[0])
    return line
def processURL(line):
    pattern = re.compile(
        r'[\[\(]http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+[\]\)]')
    print('URL start')
    line = re.sub(pattern, ' URL ', line)
    print('URL end')
    return line




    
    
def processText(line):
    #print(line)
    pattern = re.compile(
        r'[\[\(]http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+[\]\)]')
    #pattern = re.compile(r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))")
    #print('@@@@@@@@@@@@@@@@@@@@@@@@@')
    #print(line)
    #print('codePattern3 start')
    line = re.sub(codePattern3, 'CODE', line)
    #print('codePattern3 end')
    #print('codePattern2 start')
    line = re.sub(codePattern2, 'CODE', line)
    #print('codePattern2 end')
    #print(line)
    
    #if(line=='[Link to IntrinsicMethodHandle\'s constructor](https://github.com/ibmruntimes/openj9-openjdk-#jdk17/blob/dee9f348efd3bf8b70478a56ae93eea912f23123/src/java.base/share/classes/java/lang/invoke/MethodHandleImpl.java#L1249).' ):
    #    return line
    print('URL start')
    line = re.sub(pattern, ' URL ', line)
    print('URL end')
    #print(line)
    return line

def processReference(line):
    pattern = re.compile(r'(^|\n)>.*')
    line = re.sub(pattern,'\nREFERENCE',line)
    pattern = re.compile(r'On [\d]+ \w+ [\d]+ at [\d]+:[\d]+, \w+ \w+ <.*?> wrote:')
    line = re.sub(pattern,'REFERENCE',line)
    pattern = re.compile(r'On \w+, \w+ \d+, \d+, \d+:\d+ (A|P)M \w+ \w+ .*? wrote:')
    line = re.sub(pattern,'REFERENCE',line)
    pattern = re.compile(r'([\n\t\s]*?REFERENCE)+',re.MULTILINE|re.DOTALL)
    line = re.sub(pattern,'\nREFERENCE',line)
    return line


def preprocess(line):
    ## Replace all code blocks with the token CODE
    pattern = re.compile(r'```[^```]*?(```|$)', re.MULTILINE|re.DOTALL)
    line = re.sub(pattern,'CODE',line)
    pattern = re.compile(r'`[^`]*?`', re.MULTILINE|re.DOTALL)
    line = re.sub(pattern,'CODE',line)
    pattern = re.compile(r'(^|\n)>.*')
    line = re.sub(pattern,'\nREFERENCE',line)
    pattern = re.compile(r'On [\d]+ \w+ [\d]+ at [\d]+:[\d]+, \w+ \w+ <.*?> wrote:')
    line = re.sub(pattern,'REFERENCE',line)
    pattern = re.compile(r'On \w+, \w+ \d+, \d+, \d+:\d+ (A|P)M \w+ \w+ .*? wrote:')
    line = re.sub(pattern,'REFERENCE',line)
    pattern = re.compile(r'([\n\t\s]*?REFERENCE)+',re.MULTILINE|re.DOTALL)
    line = re.sub(pattern,'\nREFERENCE',line)
    ## Replace URLs which are surrounded by brackets
    pattern = re.compile(r'[\[\(]http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+[\]\)]')
    line = re.sub(pattern,' URL ',line)
    return line

def checkComments(rep,proj,issue_number):
    token = Github(curToken)
    repository = token.get_repo(rep+'/'+proj)
    issue=repository.get_issue((int)(issue_number))

    if(issue.comments==0 or issue.pull_request!=None):
        return True
    return False

def getIssuePost2(rep,proj,issue_number):
    global threadSenCnt
    global maxThreadSenLen
    global firstTime
    global issuePoster
    global sentDictList
    global isClosed
    threadSenCnt = 0
    maxThreadSenLen = 0
    #print(len(sentDictList))
    #print('hi')
    token = Github(curToken)
    repository = token.get_repo(rep+'/'+proj)
    issue=repository.get_issue((int)(issue_number))


    title_dict = {}
    title_dict['issue_number'] = issue_number
    title_dict['Original Text']=issue.title
    title_dict['Processed Text']=processText(issue.title)

    title_dict['Full Length'] = len(title_dict['Original Text'])
    title_dict['len'] = len(title_dict['Processed Text'])

    title_dict['aa'] = 'None'
    title_dict['begauth'] = True
    title_dict['has_code'] = False
    title_dict['first_turn'] = True
    title_dict['last_turn'] = False

    
    #d = datetime.datetime.strptime(issue.created_at, "%Y-%m-%dT%H:%M:%SZ")
    firstTime = issue.created_at.timestamp()
    title_dict['created_at'] = firstTime

    num_words=word_count(title_dict['Processed Text'])
    title_dict['clen'] = num_words
    title_dict['tlen'] =num_words

    title_dict['cloc'] = 1

    threadSenCnt = threadSenCnt + 1
    title_dict['tloc'] = threadSenCnt

    title_dict['tpos1'] = firstTime
    title_dict['tpos2'] = firstTime
    title_dict['ppau'] = 0
    title_dict['npau']=firstTime
    print(issue.state)
    if(issue.state=='closed'):
        print('s')
        isClosed=True
        print(isClosed)
    else: 
        isClosed=False
    

    maxThreadSenLen = title_dict['len']
    issuePoster = issue.user.login

    # endregion

    print('poststart')

    newSentList = getSentencesFromCmnt(issue.body)

    #print(newSentList)
    #region add title
    processedNewSentNumWord=[word_count(processText(sent)) for sent in newSentList]
    #print('len'+len(processedNewSentNumWord))
    
    if(len(processedNewSentNumWord)==0):
        longestSenInCmnt=0
    else:
        longestSenInCmnt = max(processedNewSentNumWord)
    
    #print(title_dict['Processed Text'])
    titleNumWord=word_count(title_dict['Processed Text'])
    if(titleNumWord>longestSenInCmnt):
        longestSenInCmnt=titleNumWord
    #print('max'+str((longestSenInCmnt)))
    #print(processedNewSentNumWord)
    #print(title_dict['clen'])
    title_dict['clen']=title_dict['clen']/longestSenInCmnt
    title_dict['cloc'] = title_dict['cloc']  / (1+len(newSentList))
    sentDictList.append(title_dict)
    #title_dict['Original Text']=""
    #title_dict['Processed Text']=""
    #print(title_dict)

    #endregion
    # keys = ['issue_number', 'Original Text','Processed Text', 'Code', 'Full Length', 'len', 'tloc',
    # 'cloc', 'tpos1', 'tpos2', 'clen', 'tlen',
    # 'ppau', 'npau', 'aa', 'begauth', 'has_code', 'first_turn', 'last_turn']
    for sentCnt in range(len(newSentList)):
        sent = newSentList[sentCnt]
        # region post
        post_dict = {}
        post_dict['issue_number'] = issue_number
        post_dict['Original Text'] = sent
        processed_sent = processText(sent)
        
        post_dict['Processed Text'] = processed_sent

        post_dict['Full Length'] = len(sent)
        post_dict['len'] = len(processed_sent)

        post_dict['aa'] = 'None'
        post_dict['begauth'] = True
        if ('CODE' in processed_sent):
            post_dict['has_code'] = True
        else:
            post_dict['has_code'] = False

        post_dict['first_turn'] = True
        post_dict['last_turn'] = False

        post_dict['created_at'] = firstTime

        num_words = word_count(post_dict['Processed Text'])
        post_dict['clen'] = num_words / longestSenInCmnt
        post_dict['tlen'] = num_words
        if (maxThreadSenLen < post_dict['len']):
            maxThreadSenLen = post_dict['len']

        post_dict['cloc'] = (sentCnt+2) / (1+len(newSentList))
        threadSenCnt = threadSenCnt + 1
        post_dict['tloc'] = threadSenCnt

        post_dict['tpos1'] = firstTime
        post_dict['tpos2'] = firstTime
        post_dict['ppau'] = 0
        post_dict['npau'] = firstTime

        sentDictList.append(post_dict)
        #print(sentDictList)
        #post_dict['Original Text'] = ""
        #post_dict['Processed Text'] = ""
        #print(post_dict)

    #print(sentDictList)'''
        # endregion
    print('postend')


def getIssuePost(repo,project,issue_number):

    
    global threadSenCnt
    global maxThreadSenLen
    global firstTime
    global issuePoster
    global sentDictList
    threadSenCnt = 0
    maxThreadSenLen = 0
    #print(len(sentDictList))
    #print('hi')
    query_url = f"https://api.github.com/repos/{repo}/{project}/issues/{issue_number}"
    token = os.getenv('GITHUB_TOKEN', curToken)
    headers = {'Authorization': f'token {token}'}
    r = requests.get(query_url, headers=headers)
    
    temp_list = r.json()  # list of dictionary
    #print(temp_list)
    #  region Title
    title_dict = {}
    title_dict['issue_number'] = issue_number
    title_dict['Original Text']=temp_list['title']
    title_dict['Processed Text']=processText((temp_list['title']))

    title_dict['Full Length'] = len(title_dict['Original Text'])
    title_dict['len'] = len(title_dict['Processed Text'])

    title_dict['aa'] = temp_list['author_association']
    title_dict['begauth'] = True
    title_dict['has_code'] = False
    title_dict['first_turn'] = True
    title_dict['last_turn'] = False

    d = datetime.datetime.strptime(temp_list['created_at'], "%Y-%m-%dT%H:%M:%SZ")
    firstTime = d.timestamp()
    title_dict['created_at'] = firstTime

    num_words=word_count(title_dict['Processed Text'])
    title_dict['clen'] = num_words
    title_dict['tlen'] =num_words

    title_dict['cloc'] = 1

    threadSenCnt = threadSenCnt + 1
    title_dict['tloc'] = threadSenCnt

    title_dict['tpos1'] = firstTime
    title_dict['tpos2'] = firstTime
    title_dict['ppau'] = 0
    title_dict['npau']=firstTime
    if(temp_list['state']=='closed'): isClosed=True
    else: isClosed=False
    

    maxThreadSenLen = title_dict['len']
    issuePoster = temp_list['user']['login']


    # endregion


    newSentList = getSentencesFromCmnt(temp_list['body'])

    #region add title
    processedNewSentNumWord=[word_count(processText(sent)) for sent in newSentList]
    if(len(processedNewSentNumWord)==0):
        longestSenInCmnt=0
    else:
        longestSenInCmnt = max(processedNewSentNumWord)
    #print(title_dict['Processed Text'])
    titleNumWord=word_count(title_dict['Processed Text'])
    if(titleNumWord>longestSenInCmnt):
        longestSenInCmnt=titleNumWord
    #print('max'+str((longestSenInCmnt)))
    #print(processedNewSentNumWord)
    #print(title_dict['clen'])
    title_dict['clen']=title_dict['clen']/longestSenInCmnt
    title_dict['cloc'] = title_dict['cloc']  / (1+len(newSentList))
    sentDictList.append(title_dict)
    #title_dict['Original Text']=""
    #title_dict['Processed Text']=""
    #print(title_dict)

    #endregion
    # keys = ['issue_number', 'Original Text','Processed Text', 'Code', 'Full Length', 'len', 'tloc',
    # 'cloc', 'tpos1', 'tpos2', 'clen', 'tlen',
    # 'ppau', 'npau', 'aa', 'begauth', 'has_code', 'first_turn', 'last_turn']
    for sentCnt in range(len(newSentList)):
        sent = newSentList[sentCnt]
        # region post
        post_dict = {}
        post_dict['issue_number'] = issue_number
        post_dict['Original Text'] = sent
        processed_sent = processText(sent)
        post_dict['Processed Text'] = processed_sent

        post_dict['Full Length'] = len(sent)
        post_dict['len'] = len(processed_sent)

        post_dict['aa'] = temp_list['author_association']
        post_dict['begauth'] = True
        if ('CODE' in processed_sent):
            post_dict['has_code'] = True
        else:
            post_dict['has_code'] = False

        post_dict['first_turn'] = True
        post_dict['last_turn'] = False

        post_dict['created_at'] = firstTime

        num_words = word_count(post_dict['Processed Text'])
        post_dict['clen'] = num_words / longestSenInCmnt
        post_dict['tlen'] = num_words
        if (maxThreadSenLen < post_dict['len']):
            maxThreadSenLen = post_dict['len']

        post_dict['cloc'] = (sentCnt+2) / (1+len(newSentList))
        threadSenCnt = threadSenCnt + 1
        post_dict['tloc'] = threadSenCnt

        post_dict['tpos1'] = firstTime
        post_dict['tpos2'] = firstTime
        post_dict['ppau'] = 0
        post_dict['npau'] = firstTime

        sentDictList.append(post_dict)
        
        #print(sentDictList)
        #post_dict['Original Text'] = ""
        #post_dict['Processed Text'] = ""
        #print(post_dict)

    #print(sentDictList)
        # endregion


def getSentencesFromCmnt(cmnt):
    global codeIdx
    global dotIdx
    '''cmnt = cmnt.encode('ascii', 'ignore').decode()
    cmnt = re.sub(codes, "CODE_REPLACEMENT", cmnt)
    cmnt = re.sub(reply, "", cmnt)
    cmnt = re.sub(url1, "URL", cmnt)
    cmnt = re.sub(url2, "URL", cmnt)
    cmnt = re.sub(mention, "SCREEN_NAME", cmnt)'''
    #print('*****************')
    #print(cmnt)
    if(cmnt==None):
        return []
    #print('##############')
    #print(cmnt)
    cmnt = removewhitespacefromcode(cmnt)
    #print('####### Changed #######')
    #print(cmnt)
    cmnt= removeDotURL(cmnt)
    #cmnt=processReference(cmnt)

    #print('----------------------')
    #print(cmnt)
    try:
        tokens = nlp(cmnt)
    except:
        tokens=cmnt
    global sentList

    newSentList = []
    s=0
    for sent in tokens.sents:
        sentF = sent.text
        #print('Before')
        #print(sentF)
        sentF = sentF.strip()

        if (len(sentF) > 0):
            #print(sentF)
            if (sentF[0] == ">"):
                #print('reply')
                sentF=sentF.replace(sentF[:1], '')
                #sentF = sentF[1:]
                sentF = sentF.strip()

            #print('before')
            #print(sentF)
            while ("code_placement" in sentF):

                #print(codeList[codeIdx])
                sentF = sentF.replace("code_placement", codeList[codeIdx],1)
                codeIdx = codeIdx + 1


            while("dot_url" in sentF):
                sentF = sentF.replace("dot_url", dotList[dotIdx],1)
                dotIdx = dotIdx + 1

            if(sentF not in sentList):
                newSentList.append(sentF)
                sentList.append(sentF)
                s=s+1
                #print(s)
                #print(sentF)

    return newSentList

def getCmntInfo(temp_list,issue_number):
    global sentList
    global threadSenCnt
    global maxThreadSenLen
    global lastTime
    global sentDictList

    d = datetime.datetime.strptime(temp_list[len(temp_list)-1]['created_at'], "%Y-%m-%dT%H:%M:%SZ")
    lastTime = d.timestamp()

    prevTime=firstTime

    for cmntCnt in range(len(temp_list)):
        if(cmntCnt==len(temp_list)-1):
            nextTime=0
        else:
            d = datetime.datetime.strptime(temp_list[cmntCnt+1]['created_at'], "%Y-%m-%dT%H:%M:%SZ")
            nextTime = d.timestamp()
        #if(cmntCnt!=5):
            #continue
        dict=temp_list[cmntCnt]
        cmnt = dict['body']
        #print(cmnt)
        newSentList = getSentencesFromCmnt(cmnt)
        #maxSenInCmnt=max(newSentList, key=len)
        

        processedNewSentNumWord = [word_count(processText(sent)) for sent in newSentList]
        if(len(processedNewSentNumWord)==0):
            longestSenInCmnt=0
        else:
            longestSenInCmnt = max(processedNewSentNumWord)
        curTime = d.timestamp()
        for sentCnt in range(len(newSentList)):
            sent=newSentList[sentCnt]
            sent_dict={}
            # region cmnt
            sent_dict['issue_number'] = issue_number
            sent_dict['Original Text'] = sent
            processed_sent = processText(sent)
            sent_dict['Processed Text'] = processed_sent

            sent_dict['Full Length'] = len(sent)
            sent_dict['len'] = len(processed_sent)

            sent_dict['aa'] = dict['author_association']
            if (dict['user']['login'] == issuePoster):
                sent_dict['begauth'] = True
            else:
                sent_dict['begauth'] = False

            if ('CODE' in processed_sent):
                sent_dict['has_code'] = True
            else:
                sent_dict['has_code'] = False

            d = datetime.datetime.strptime(dict['created_at'], "%Y-%m-%dT%H:%M:%SZ")
            curTime = d.timestamp()
            sent_dict['first_turn'] = False
            if(cmntCnt==len(temp_list)-1):
                sent_dict['last_turn'] = True
            else:
                sent_dict['last_turn'] = False

            sent_dict['created_at'] = curTime

            num_word=word_count(sent_dict['Processed Text'])
            sent_dict['clen']=num_word/longestSenInCmnt
            sent_dict['tlen']=num_word
            if (maxThreadSenLen < sent_dict['len']):
                maxThreadSenLen = sent_dict['len']


            sent_dict['cloc'] = (sentCnt+1)/len(newSentList)
            threadSenCnt = threadSenCnt + 1
            sent_dict['tloc'] = threadSenCnt

            sent_dict['tpos1'] = curTime
            sent_dict['tpos2'] = curTime
            sent_dict['ppau'] = curTime-prevTime
            if(nextTime==0):
                sent_dict['npau']=nextTime
            else:
                sent_dict['npau'] = nextTime-curTime
            
            sentDictList.append(sent_dict)

            #sent_dict['Original Text'] = ""
            #sent_dict['Processed Text'] = ""
            #print(sent_dict)
            # endregion
        prevTime = curTime


        

        
        
        
def getCmntInfo2(temp_list,issue_number):
    print('g')
    global sentList
    global threadSenCnt
    global maxThreadSenLen
    global lastTime
    global sentDictList

    #d = datetime.datetime.strptime(temp_list[len(temp_list)-1]['created_at'], "%Y-%m-%dT%H:%M:%SZ")
    lastTime = temp_list[temp_list.totalCount-1].created_at.timestamp()

    prevTime=firstTime

    for cmntCnt in range(temp_list.totalCount):
        if(cmntCnt==temp_list.totalCount-1):
            nextTime=0
        else:
            #d = datetime.datetime.strptime(temp_list[cmntCnt+1]['created_at'], "%Y-%m-%dT%H:%M:%SZ")
            nextTime = temp_list[cmntCnt+1].created_at.timestamp()
        #if(cmntCnt!=5):
            #continue
        dict=temp_list[cmntCnt]
        cmnt = dict.body
        #print(cmnt)
        print(cmntCnt)
        newSentList = getSentencesFromCmnt(cmnt)
        
        #maxSenInCmnt=max(newSentList, key=len)
        

        processedNewSentNumWord = [word_count(processText(sent)) for sent in newSentList]
        #print('len'+len(processedNewSentNumWord))
        if(len(processedNewSentNumWord)==0):
            longestSenInCmnt=0
        else:
            longestSenInCmnt = max(processedNewSentNumWord)
        
        
        #curTime = dict.created_at.timestamp()
        for sentCnt in range(len(newSentList)):
            sent=newSentList[sentCnt]
            sent_dict={}
            # region cmnt
            sent_dict['issue_number'] = issue_number
            sent_dict['Original Text'] = sent
            print(sent)
            processed_sent = processText(sent)
            sent_dict['Processed Text'] = processed_sent
            print(processed_sent)
            sent_dict['Full Length'] = len(sent)
            sent_dict['len'] = len(processed_sent)

            sent_dict['aa'] = 'None'#dict['author_association']
            if (dict.user.login == issuePoster):
                sent_dict['begauth'] = True
            else:
                sent_dict['begauth'] = False

            if ('CODE' in processed_sent):
                sent_dict['has_code'] = True
            else:
                sent_dict['has_code'] = False

            #d = datetime.datetime.strptime(dict['created_at'], "%Y-%m-%dT%H:%M:%SZ")
            curTime = dict.created_at.timestamp()
            sent_dict['first_turn'] = False
            if(cmntCnt==temp_list.totalCount-1):
                sent_dict['last_turn'] = True
            else:
                sent_dict['last_turn'] = False

            sent_dict['created_at'] = curTime

            num_word=word_count(sent_dict['Processed Text'])
            sent_dict['clen']=num_word/longestSenInCmnt
            sent_dict['tlen']=num_word
            if (maxThreadSenLen < sent_dict['len']):
                maxThreadSenLen = sent_dict['len']


            sent_dict['cloc'] = (sentCnt+1)/len(newSentList)
            threadSenCnt = threadSenCnt + 1
            sent_dict['tloc'] = threadSenCnt

            sent_dict['tpos1'] = curTime
            sent_dict['tpos2'] = curTime
            sent_dict['ppau'] = curTime-prevTime
            if(nextTime==0):
                sent_dict['npau']=nextTime
            else:
                sent_dict['npau'] = nextTime-curTime
            
            sentDictList.append(sent_dict)
            
            #sent_dict['Original Text'] = ""
            #sent_dict['Processed Text'] = ""
            #print(sent_dict)
            # endregion
        prevTime = curTime


        
def getIssueComment2(rep,proj,issue_number):
    global sentDictList
    
    token = Github(curToken)
    repository = token.get_repo(rep+'/'+proj)
    issue=repository.get_issue((int)(issue_number))
    

    if(issue.comments==0):
        return
    temp_list=issue.get_comments()
    #d = datetime.datetime.strptime(temp_list[0].created_at, "%Y-%m-%dT%H:%M:%SZ")
    nextTime = temp_list[0].created_at.timestamp()
    #print(nextTime)
    for item in sentDictList:
        item['npau']=nextTime-item['npau']

    print('cmntstart')
    getCmntInfo2(temp_list,issue_number)
    print('cmntend')
    #for item in sentDictList:
    #    issueList.append(item)

    df = pd.DataFrame.from_records(sentDictList)
    df.tlen=df.tlen/df.tlen.max()
    df.tloc=df.tloc/df.iloc[len(df)-1].tloc
    total_time_diff=lastTime-firstTime
    df.tpos1=(df.tpos1-firstTime)/total_time_diff
    df.tpos2=(lastTime-df.tpos2)/total_time_diff
    #print(df.ppau.max())
    df.ppau=(df.ppau/df.ppau.max())
    df.npau = (df.npau / df.npau.max())
    #print('cmntend')
    return df


def getIssueComment(repo,project,issue_number):
    global sentDictList
    query_url = f"https://api.github.com/repos/{repo}/{project}/issues/{issue_number}/comments"  
    
    params = {
            "per_page": 100,
    }
    token = os.getenv('GITHUB_TOKEN', curToken)
    headers = {'Authorization': f'token {token}'}
    r = requests.get(query_url, headers=headers, params=params)
    temp_list = r.json()  
    if(len(temp_list)==0):
        return
    d = datetime.datetime.strptime(temp_list[0]['created_at'], "%Y-%m-%dT%H:%M:%SZ")
    nextTime = d.timestamp()
    #print(nextTime)
    for item in sentDictList:
        item['npau']=nextTime-item['npau']

    getCmntInfo(temp_list,issue_number)
    #for item in sentDictList:
    #    issueList.append(item)

    df = pd.DataFrame.from_records(sentDictList)
    df.tlen=df.tlen/df.tlen.max()
    df.tloc=df.tloc/df.iloc[len(df)-1].tloc
    total_time_diff=lastTime-firstTime
    df.tpos1=(df.tpos1-firstTime)/total_time_diff
    df.tpos2=(lastTime-df.tpos2)/total_time_diff
    #print(df.ppau.max())
    df.ppau=(df.ppau/df.ppau.max())
    df.npau = (df.npau / df.npau.max())
    return df
    #df.to_csv(str(issue_number)+'.csv')
    #print(len(df))
    #print(df)
    #total=total+len(df)

#df_append = pd.DataFrame()


#for file in issue_number_list:
#            df_temp = pd.read_csv(str(file)+'.csv')
#            df_append = df_append.append(df_temp, ignore_index=True)
#print(len(df_append))
#df_append.to_csv('all_issue.csv')

#print(lineCnt)


'''for issue_number in issue_number_list:
    print(issue_number)
    sentDictList=[]
    sentList=[]

    getIssuePost(issue_number)

    if(issue_number in [7684,5074,5918]):
        mergelist=[]
        pg=1
        while(pg<3):
            params = {
                "page": pg,
                "per_page": 100
            }
            pg=pg+1
            query_url = f"https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}/comments"
            r = requests.get(query_url, headers=headers, params=params)
            temp_list = r.json()
            for item in temp_list:
                mergelist.append(item)
        temp_list=mergelist

    else:
        query_url = f"https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}/comments"
        params = {
            "per_page": 100,
        }
        r = requests.get(query_url, headers=headers, params=params)
        temp_list = r.json()  

    d = datetime.datetime.strptime(temp_list[0]['created_at'], "%Y-%m-%dT%H:%M:%SZ")
    nextTime = d.timestamp()
    #print(nextTime)
    for item in sentDictList:
        item['npau']=nextTime-item['npau']

    getCmntInfo(temp_list)
    for item in sentDictList:
        issueList.append(item)

    df = pd.DataFrame.from_records(sentDictList)
    df.tlen=df.tlen/df.tlen.max()
    df.tloc=df.tloc/df.iloc[len(df)-1].tloc
    total_time_diff=lastTime-firstTime
    df.tpos1=(df.tpos1-firstTime)/total_time_diff
    df.tpos2=(lastTime-df.tpos2)/total_time_diff
    #print(df.ppau.max())
    df.ppau=(df.ppau/df.ppau.max())
    df.npau = (df.npau / df.npau.max())
    df.to_csv(str(issue_number)+'.csv')
    print(len(df))
    total=total+len(df)

df_append = pd.DataFrame()

for file in issue_number_list:
            df_temp = pd.read_csv(str(file)+'.csv')
            df_append = df_append.append(df_temp, ignore_index=True)
print(len(df_append))
df_append.to_csv('all_issue.csv')

print(lineCnt)'''
