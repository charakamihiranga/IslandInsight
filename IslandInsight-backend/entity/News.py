from sqlalchemy import create_engine, Column, String, DateTime, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database connection URL
DATABASE_URL = 'mysql+pymysql://root:1234@localhost/islandinsight'

# Create engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define News model
class News(Base):
    __tablename__ = 'esanaNews'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    link = Column(String(255))
    imgLink = Column(String(255))
    date = Column(DateTime)
    time = Column(String(255))
    agency = Column(String(255))
    agencyLogoLink = Column(String(255))
    postContent = Column(Text())

# Create tables
Base.metadata.create_all(bind=engine)
