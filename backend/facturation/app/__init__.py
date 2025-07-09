from flask import Flask
from .routes import pdf_routes

def create_app():
    app = Flask(__name__)
    app.register_blueprint(pdf_routes)
    return app