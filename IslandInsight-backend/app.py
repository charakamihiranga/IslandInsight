from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask,jsonify
import Scrape
import sys
import io

from util import AppUtil

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

app = Flask(__name__)

@app.route('/getnewsdetails', defaults={'newsId': 0}, methods=['GET'])
@app.route('/getnewsdetails/<int:newsId>')
def getNewsDetails(newsId):
    # Construct the URL for the specific news article
    news_url = f'https://esana.com.lk/news/{newsId}'
    try:
        # Fetch the news details
        news_details = Scrape.scrapeNewsDetails(news_url)
        return jsonify(news_details)
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Return an error message if something goes wrong

if __name__ == '__main__':
    #start the scheduler
    AppUtil.schedule_scrape()
    app.run(debug=True)

