from flask import Flask

def create_app():
    app = Flask(__name__)
    
    from .routes import pdf_routes
    app.register_blueprint(pdf_routes)

    return app