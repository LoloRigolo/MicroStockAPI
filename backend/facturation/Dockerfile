FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    libjpeg-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/facture-app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 3022

CMD ["python", "run.py"]
