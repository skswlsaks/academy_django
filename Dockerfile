# Set default python image to 3.7 version
FROM python:3.7 


ENV PYTHONUNBUFFERED 1 

# docker 내에서 /app 라는 이름의 폴더 생성
RUN mkdir /app
# Setup my working directory 
WORKDIR /app

COPY requirements.txt /app/
RUN pip3 install -r requirements.txt 

# Collect static files django
# RUN python manage.py collectstatic --noinput

COPY . /app/
