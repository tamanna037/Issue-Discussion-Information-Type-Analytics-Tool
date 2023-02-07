from django_cron import CronJobBase, Schedule
import requests
from .models import SentenceTable

class MyCronJob(CronJobBase):
    RUN_EVERY_MINS =1 # every 5 minutes
    #RETRY_AFTER_FAILURE_MINS = 1
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS) #, retry_after_failure_mins=RETRY_AFTER_FAILURE_MINS
    code = 'wiki.my_cron_job'    # a unique code

    def do(self):

        b=SentenceTable.objects.create(repo='eclipse-openj9',project='openj9',originaltext='thanks',processedtext='thanks',issue_number=122, full_length=32,length=32, tloc=0.5, cloc=0.002294, tpos1=0.0, tpos2=1, clen=1.0, tlen=0.05556, ppau=0.0, npau=0.000465,begauth=True, has_code=False, first_turn=True, last_turn=False, aa='NONE',isclosed=True,code='Social Conversation',created_at=12121212)
    
        
        b.save()
        print('hi')
        

    
def my_scheduled_job():
    
        b=SentenceTable.objects.create(repo='eclipse-openj9',project='openj9',originaltext='thanks',processedtext='thanks',issue_number=122, full_length=32,length=32, tloc=0.5, cloc=0.002294, tpos1=0.0, tpos2=1, clen=1.0, tlen=0.05556, ppau=0.0, npau=0.000465,begauth=True, has_code=False, first_turn=True, last_turn=False, aa='NONE',isclosed=True,code='Social Conversation',created_at=12121212)
    
        
        b.save()
        print('hello')
        