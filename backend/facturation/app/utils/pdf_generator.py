from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

def generate_facture_pdf(commande):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    y = height - 50
    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, y, f"Facture n° {commande.get('_id', 'Inconnue')}")
    y -= 30

    p.setFont("Helvetica", 12)
    p.drawString(50, y, f"Utilisateur : {commande.get('user_id', 'Inconnu')}")
    y -= 20
    p.drawString(50, y, f"Statut : {commande.get('status', 'Inconnu')}")
    y -= 30

    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, y, "Articles :")
    y -= 20

    articles = commande.get("articles", [])
    if articles:
        p.setFont("Helvetica", 12)
        for article in articles:
            nom = article.get("nom") or article.get("name") or "Inconnu"
            quantite = article.get("quantite") or article.get("quantity") or 1
            prix_unitaire = article.get("prix_unitaire") or article.get("price") or 0

            p.drawString(50, y, f"{nom}")
            p.drawString(300, y, f"{quantite}")
            p.drawString(400, y, f"{prix_unitaire:.2f} €")
            y -= 20
    else:
        p.setFont("Helvetica", 12)
        p.drawString(50, y, "Aucun article.")
        y -= 20

    y -= 20
    total_ht = commande.get("total_ht") or 0
    tva = commande.get("tva") or 0
    total_ttc = commande.get("total_ttc") or 0

    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, y, f"Total HT : {total_ht:.2f} €")
    y -= 20
    p.drawString(50, y, f"TVA : {tva:.2f} €")
    y -= 20
    p.drawString(50, y, f"Total TTC : {total_ttc:.2f} €")

    p.showPage()
    p.save()
    buffer.seek(0)

    filename = f"facture_{commande.get('_id', 'Inconnue')}.pdf"

    return buffer, filename
