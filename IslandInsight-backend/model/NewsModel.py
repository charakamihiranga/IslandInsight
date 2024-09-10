from entity.News import SessionLocal, News
import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate('static/serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'add your firebase database url here'
})

class NewsModel():
    @staticmethod #this annotation used to make the method static
    def saveScrapedEsanaNews(news_items):
        # Save the scraped news items to the database
        db =SessionLocal()
        try:
            for item in news_items:
                existing_news = db.query(News).filter_by(id=item['id']).first()
                if not existing_news:
                    news_entry = News(
                        id = item['id'],
                        title = item['title'],
                        link = item['link'],
                        imgLink = item['imgLink'],
                        date = item['date'],
                        time = item['time']
                        )
                    db.add(news_entry)
                    NewsModel.updateFirebaseDB(news_entry)
            db.commit()

        except Exception as e:
            db.rollback()
        finally:
            db.close()

    @staticmethod
    def AllNews(self):
        # Fetch all news items from the database
        db = SessionLocal()
        try:
            news = db.query(News).all()
            return news
        finally:
            db.close()

    @staticmethod
    def updateFirebaseDB(news_items):
        # Update the Firebase database with the latest news items
        try:
            # Reference to the news node in your Firebase Realtime Database
            ref = db.reference('news')
            for item in news_items:
                #Use the news ID as the key for each news
                ref.child(item['id']).set({
                    'title': item['title'],
                    'link': item['link'],
                    'imgLink': item['imgLink'],
                    'date': item['date'],
                    'time': item['time']
                })
        except Exception as e:
            print(f"Failed to update Firebase database. Error: {e}")