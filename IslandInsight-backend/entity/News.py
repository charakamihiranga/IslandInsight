from sqlalchemy import create_engine, Column, String, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = 'mysql+pymysql://root:1234@localhost/islandinsight'
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class News(Base):
    __tablename__ = 'esanaNews'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    link = Column(String(255))
    imgLink = Column(String(255))
    date = Column(DateTime)
    time = Column(String(255))

# Create tables
Base.metadata.create_all(bind=engine)
