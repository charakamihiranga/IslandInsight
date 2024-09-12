from entity.News import SessionLocal, News
import firebase_admin
from firebase_admin import credentials, db as firebase_db

from util import AppUtil

# Initialize Firebase Admin SDK
cred = credentials.Certificate('static/serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'firebase realtime database url'
})


class NewsModel():
    @staticmethod
    def saveScrapedEsanaNews(news_items):
        # Save the scraped news items to the database
        db = SessionLocal()  # SQLAlchemy session
        try:
            for item in news_items:
                # Check if the news item already exists in the database
                existing_news = db.query(News).filter_by(id=item['id']).first()
                if not existing_news:
                    news_entry = News(
                        id=item['id'],
                        title=item['title'],
                        link=item['link'],
                        imgLink=item['imgLink'],
                        date=item['date'],
                        time=item['time']
                    )
                    db.add(news_entry)
            db.commit()

            # After committing to the local DB, update Firebase
            NewsModel.updateFirebaseDB(news_items,"esana")

        except Exception as e:
            print(f"Failed to save news. Rolling back. Error: {e}")
            db.rollback()

        finally:
            db.close()

    @staticmethod
    def allNews():
        # Fetch all news items from the local database
        db = SessionLocal()
        try:
            news = db.query(News).all()
            return news

        finally:
            db.close()

    @staticmethod
    def updateFirebaseDB(news_items, agency):
        # Update Firebase Realtime Database with the latest news items
        try:
            # Reference to the 'news' node in Firebase Realtime Database
            ref = firebase_db.reference('news')

            for item in news_items:
                # Use the news ID as the key for each news entry
                ref.child(str(item['id'])).set({
                    'title': item['title'],
                    'link': item['link'],
                    'imgLink': item['imgLink'],
                    'date': item['date'],
                    'time': item['time'],
                    'agency': agency,
                    'agencyLogo': AppUtil.getAgencyLogo(agency)
                })

            print("Firebase database updated successfully.")


        except Exception as e:
            print(f"Failed to update Firebase database. Error: {e}")
