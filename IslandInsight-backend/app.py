from flask import Flask, jsonify
import Scrape
from util import AppUtil

app = Flask(__name__)

@app.route('/startfetching', methods=['GET'])
def startFetching():
    Scrape.scrapeTrendingNews()  # Start fetching the news
    AppUtil.schedule_scrape()  # Reschedule the scraping job
    return jsonify({'message': 'Fetching started'})

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


# Call the scrapeTrendingNews when the application starts
if __name__ == '__main__':
    print("Starting the Flask app and scraping trending news")
    app.run(debug=True)
