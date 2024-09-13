import datetime
import firebase_admin
from  firebase_admin import credentials, db as firebase_db
import Scrape
from entity.News import SessionLocal, News
from util import AppUtil

# Initialize Firebase Admin SDK
cred = credentials.Certificate('static/serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://se10login-default-rtdb.firebaseio.com/'
})

class NewsModel:
    @staticmethod
    def saveScrapedEsanaNews(news_items):
        db = SessionLocal()  # SQLAlchemy session
        try:
            for item in news_items:
                existing_news = db.query(News).filter_by(id=item['id']).first()
                if not existing_news:
                    post_content = getNewsContent(item['id'])

                    # Create a new news entry
                    news_entry = News(
                        id=item['id'],
                        title=item['title'],
                        link=item['link'],
                        imgLink=item['imgLink'],
                        date=item['date'],
                        time=item['time'],
                        agency='esana',
                        agencyLogoLink=AppUtil.getAgencyLogo('esana'),
                        postContent=post_content
                    )
                    db.add(news_entry)
            db.commit()

            # Update Firebase after committing to the local DB
            NewsModel.updateFirebaseDB()

        except Exception as e:
            print(f"Failed to save news. Rolling back. Error: {e}")
            db.rollback()

        finally:
            db.close()

    @staticmethod
    def updateFirebaseDB():
        try:
            ref = firebase_db.reference('news')
            news_items = NewsModel.getAllEsanaNews()
            for item in news_items:
                # Convert date to string format
                date_str = item['date'].strftime('%Y-%m-%d %H:%M:%S') if isinstance(item['date'], datetime.datetime) else item['date']

                # Update Firebase db with the news item
                ref.child(str(item['id'])).set({
                    'title': item['title'],
                    'link': item['link'],
                    'imgLink': item['imgLink'],
                    'date': date_str,
                    'time': item['time'],
                    'agency': item['agency'],
                    'agencyLogo': item['agencyLogo'],
                    'postContent': item.get('postContent')
                })

            print("Firebase database updated successfully.")
        except Exception as e:
            print(f"Failed to update Firebase database. Error: {e}")

    @staticmethod
    def getAllEsanaNews():
        db = SessionLocal()
        try:
            news_items = db.query(News).filter_by(agency='esana').all()
            news_list = [
                {
                    'id': news.id,
                    'title': news.title,
                    'link': news.link,
                    'imgLink': news.imgLink,
                    'date': news.date,
                    'time': news.time,
                    'agency': news.agency,
                    'agencyLogo': news.agencyLogoLink,
                    'postContent': news.postContent
                }
                for news in news_items
            ]
            return news_list
        except Exception as e:
            print(f"Failed to fetch news from DB. Error: {e}")
        finally:
            db.close()

def getNewsContent(news_id):
    news_url = f'https://esana.com.lk/news/{news_id}'
    news_details = Scrape.scrapeNewsDetails(news_url)
    if news_details and 'post_content' in news_details:
        return news_details['post_content']
    else:
        return "No content"
