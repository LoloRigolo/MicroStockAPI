from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib import colors
from datetime import datetime
from io import BytesIO
import os

def generate_facture_pdf(commande):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    logo_path = os.path.join(os.path.dirname(__file__), '..', 'static', 'logo.png')
    if os.path.exists(logo_path):
        logo = ImageReader(logo_path)
        p.drawImage(logo, width - 170, height - 80, width=120, height=50)

    p.setFont("Helvetica-Bold", 20)
    p.drawString(50, height - 50, "FACTURE")

    p.setFont("Helvetica", 10)
    p.drawString(50, height - 80, f"Commande ID : {commande.get('_id')}")
    p.drawString(50, height - 95, f"Utilisateur : {commande.get('user_id')}")
    p.drawString(50, height - 110, f"Date : {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    p.drawString(50, height - 125, f"Statut : {commande.get('status')}")

    y = height - 160
    p.setFont("Helvetica-Bold", 11)
    p.drawString(50, y, "Article ID")
    p.drawString(180, y, "Quantité")
    p.drawString(260, y, "Prix Unitaire (€)")
    p.drawString(380, y, "Total HT (€)")
    y -= 15
    p.setFont("Helvetica", 10)

    for article in commande.get("articles", []):
        p.drawString(50, y, article["article_id"])
        p.drawString(190, y, str(article["quantite"]))
        p.drawString(270, y, f"{article['prix_unitaire']:.2f}")
        p.drawString(400, y, f"{article['total_ht']:.2f}")
        y -= 15

        if y < 100:
            p.showPage()
            y = height - 50
            p.setFont("Helvetica", 10)

    y -= 20
    p.setFont("Helvetica-Bold", 11)
    p.drawString(50, y, f"Total HT : {commande.get('total_ht'):.2f} €")
    y -= 15
    p.drawString(50, y, f"TVA (20%) : {commande.get('tva'):.2f} €")
    y -= 15
    p.drawString(50, y, f"Total TTC : {commande.get('total_ttc'):.2f} €")

    p.showPage()
    p.save()
    buffer.seek(0)

    filename = f"facture_{commande.get('_id')}.pdf"
    return buffer, filename
