from apscheduler.schedulers.background import BackgroundScheduler

import Scrape

def splitId(id):
    return id.split('/')[1] # Split the id and return the second part

def schedule_scrape():
    scheduler = BackgroundScheduler()
    try:
        # Schedule the scrapeTrendingNews function to run every 1 minute
        scheduler.add_job(Scrape.scrapeTrendingNews, 'interval', minutes=1)
        scheduler.start()
        print("Scheduler started successfully")
    except Exception as e:
        print(f"Failed to start scheduler. Error: {e}")


