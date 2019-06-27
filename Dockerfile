# Set default python image to 3.7 version
FROM python:3.7 


ENV PYTHONUNBUFFERED 1 
# docker 내에서 /app 라는 이름의 폴더 생성
RUN mkdir /app
# Setup my working directory 
WORKDIR /app

# Install "pipenv"
RUN pip install pipenv

# In a similar fashion as before if the "Pipfile.lock" doesn't change, the
# image layer is going to be cached.
COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock
RUN pipenv install --deploy --system

ADD . /app
RUN pip install .

