import re
from datetime import timedelta, datetime

from apscheduler.schedulers.background import BackgroundScheduler

import Scrape


def splitId(id):
    return id.split('/')[1] # Split the id and return the second part

def schedule_scrape():
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=Scrape.schedule_scrape(), trigger="interval", minutes=2)
    scheduler.start()


