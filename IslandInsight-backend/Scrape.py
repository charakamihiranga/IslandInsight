from datetime import datetime

import requests
from bs4 import BeautifulSoup
from flask import Flask
from sqlalchemy import func

from model.NewsModel import NewsModel
from util import AppUtil

app = Flask(__name__)
def scrapeTrendingNews():
    URL = 'https://esana.com.lk/news'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(URL, headers=headers)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx and 5xx)
    except requests.RequestException as e:
        return {'error': f"Failed to retrieve the webpage. Error: {e}"}

    soup = BeautifulSoup(response.content, 'html.parser')
    news_items = []

    # Adjust the class names and HTML structure based on the provided sample
    articles = soup.find_all('div', class_='col-lg-6')

    for article in articles:
        img_tag = article.find('img')
        imgLink = img_tag['src'] if img_tag else "No image"

        title_tag = article.find('h3').find('a')
        title = title_tag.text.strip() if title_tag else "No title"
        link = title_tag['href'] if title_tag else "No link"

        date_tag = article.find('ul', class_='list-inline').find('a')
        time = date_tag.text.strip() if date_tag else "No date"

        news_items.append({
            'id': AppUtil.splitId(link),
            'title': title,
            'link': link,
            'imgLink': imgLink,
            'date': datetime.now().isoformat(),
            'time': time
        })

    NewsModel.saveScrapedEsanaNews(news_items)


def scrapeNewsDetails(url):
    # Fetch the HTML content from the URL
    response = requests.get(url)
    response.raise_for_status() # Raise an exception for bad responses

    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract details
    headline = soup.find('h2', class_='m-t-xs-20 m-b-xs-0 axil-post-title hover-line').text.strip()
    posted_time = soup.find('div', class_='post-metas banner-post-metas m-t-xs-20').text.strip()
    image_link = soup.find('img', class_='img-fluid')['src']

    # Extract the post content
    content_div = soup.find('div', class_='single-blog-wrapper')
    if content_div:
        # Extract the text content and clean it up
        paragraphs = content_div.find_all('p')
        post_content = '\n'.join(paragraph.get_text(strip=True) for paragraph in paragraphs)
    else:
        post_content = 'Content not available'

    # Return details
    return {
        'headline': headline,
        'posted_time': posted_time,
        'image_link': image_link,
        'post_content': post_content
    }



