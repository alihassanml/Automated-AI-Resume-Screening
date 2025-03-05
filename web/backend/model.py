from sqlalchemy import Boolean,Integer,Column,String,ForeignKey,Float,DateTime, Enum, Text,LargeBinary,JSON
from sqlalchemy.sql import func 
from sqlalchemy.orm import relationship
from database import Base

class ResumeResult(Base):
    __tablename__ = 'result'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    result_json = Column(JSON, nullable=False)
    rank = Column(String)