from flask import Blueprint, request, jsonify, send_file
from app.utils.pdf_generator import generate_facture_pdf

pdf_routes = Blueprint("generate-facture", __name__)
@pdf_routes.route("/generate-facture", methods=["POST"])
def generate_facture():
    data = request.get_json()

    print("### REQUETE RECUE ###")
    print(data)

    if not data or "commande" not in data:
        return jsonify({"error": "Commande invalide"}), 400

    try:
        buffer, filename = generate_facture_pdf(data["commande"])
        return send_file(
            buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500