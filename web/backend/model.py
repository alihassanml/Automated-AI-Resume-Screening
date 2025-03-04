from sqlalchemy import Boolean,Integer,Column,String,ForeignKey,Float,DateTime, Enum, Text,LargeBinary
from sqlalchemy.sql import func 
from sqlalchemy.orm import relationship
from database import Base

class Sginup(Base):
    __tablename__ = 'Sginup'
    id = Column(Integer,primary_key=True,index=True)
    organization = Column(String,index=True)
    password = Column(String,index=True)
    is_active = Column(Boolean, default=True)
    
    todos = relationship('Project',back_populates='owner')