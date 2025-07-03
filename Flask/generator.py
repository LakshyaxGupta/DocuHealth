# from dotenv import load_dotenv
# load_dotenv()


# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# import qrcode
# import os
# import re
# from appwrite.client import Client
# from appwrite.services.storage import Storage
# from io import BytesIO

# client = Client()

# client.set_endpoint(os.environ["VITE_APPWRITE_ENDPOINT"])  # Replace with your Appwrite endpoint
# client.set_project(os.environ["VITE_APPWRITE_PROJECT_ID"])  # Replace with your Project ID
# client.set_key(os.environ["VITE_APPWRITE_API_KEY"])         # Replace with your secret API key

# storage = Storage(client)

# # Base URL for Google Form
# base_url = "https://docs.google.com/forms/d/e/1FAIpQLSfZtumeav3JdAN_488eiX1ksf2UNKPtyWHygQnpoilmn6pEGA/viewform?usp=pp_url"

# # Initialize Flask app
# app = Flask(__name__)

# # Enable CORS for React app running on port 5173
# CORS(app)

# # QR code save directory
# qr_folder = r"D:\WebD\PROJECT\DocuHealth\DocuHealth\Resources\QRs"

# # Ensure the folder exists
# os.makedirs(qr_folder, exist_ok=True)

# # Handle OPTIONS request for CORS preflight
# @app.route('/submit', methods=['OPTIONS'])
# def handle_options():
#     response = jsonify({})
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
#     return response

# # Handle POST request to generate QR code
# @app.route('/submit', methods=['POST'])
# def handle_form():
#     try:
#         data = request.get_json()
#         url = data.get("url")

#         if not url:
#             return jsonify({"error": "No URL provided"}), 400

#         sanitized_name = re.sub(r'[\\/*?:"<>|]', "_", url.split('=')[1])
#         qr_filename = f"{sanitized_name}_qr.png"

#         # Generate QR code as bytes
#         qr_io = BytesIO()
#         qr = qrcode.make(url)
#         qr.save(qr_io, format='PNG')
#         qr_io.seek(0)

#         # Upload to Appwrite
#         from appwrite.id import ID
#         result = storage.create_file(
#             bucket_id=os.environ["VITE_APPWRITE_BUCKET_ID"],
#             file_id=ID.unique(),
#             file=qr_io
#         )

#         file_id = result['$id']
#         file_url = f"{os.environ['VITE_APPWRITE_ENDPOINT']}/storage/buckets/{os.environ['VITE_APPWRITE_BUCKET_ID']}/files/{file_id}/view?project={os.environ['VITE_APPWRITE_PROJECT_ID']}"

#         return jsonify({"message": "QR code uploaded!", "qr_url": file_url}), 200

#     except Exception as e:
#         import traceback
#         traceback.print_exc()  # <-- Print the full error to terminal
#         return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

# # Route to serve the QR code image
# @app.route('/qrs/<filename>')
# def serve_qr(filename):
#     directory = r"D:\WebD\PROJECT\DocuHealth\DocuHealth\Resources\QRs"
#     return send_from_directory(directory, filename)

# # Run the Flask app
# if __name__ == '__main__':
#     app.run(debug=True, port=5000)


from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
import qrcode
import os
import re
from io import BytesIO
from appwrite.client import Client
from appwrite.services.storage import Storage
from appwrite.id import ID
from appwrite.permission import Permission
from appwrite.role import Role
from appwrite.input_file import InputFile
# Initialize Appwrite client
client = Client()
client.set_endpoint(os.environ["VITE_APPWRITE_ENDPOINT"])         # e.g. http://localhost/v1
client.set_project(os.environ["VITE_APPWRITE_PROJECT_ID"])        # Appwrite project ID
client.set_key(os.environ["VITE_APPWRITE_API_KEY"])               # Appwrite API key

storage = Storage(client)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests (React dev server)

# Handle CORS preflight requests
@app.route('/submit', methods=['OPTIONS'])
def handle_options():
    response = jsonify({})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

# Handle POST request to generate and upload QR code
from io import BytesIO
import qrcode

@app.route('/submit', methods=['POST'])
def handle_form():
    try:
        data = request.get_json()
        url = data.get("url")

        if not url:
            return jsonify({"error": "No URL provided"}), 400

        sanitized_name = re.sub(r'[\\/*?:"<>|]', "_", url.split('=')[1])
        qr_filename = f"{sanitized_name}_qr.png"

        # Generate QR code in memory
        qr_io = BytesIO()
        qr = qrcode.make(url)
        qr.save(qr_io, format='PNG')
        qr_io.seek(0)  # Move back to the start of the BytesIO object

        # Save to local disk if needed
        qr_folder = r"D:\WebD\PROJECT\DocuHealth\DocuHealth\Resources\QRs"
        os.makedirs(qr_folder, exist_ok=True)
        qr_path = os.path.join(qr_folder, qr_filename)
        with open(qr_path, 'wb') as f:
            f.write(qr_io.getbuffer())

        # Upload to Appwrite Storage - pass a file object opened from disk
        from appwrite.id import ID
        with open(qr_path, 'rb') as f:
            input_file = InputFile.from_path(qr_path)
            result = storage.create_file(
                bucket_id=os.environ["VITE_APPWRITE_BUCKET_ID"],
                file_id=ID.unique(),
                file=input_file
            )

        file_id = result['$id']
        file_url = f"{os.environ['VITE_APPWRITE_ENDPOINT']}/storage/buckets/{os.environ['VITE_APPWRITE_BUCKET_ID']}/files/{file_id}/view?project={os.environ['VITE_APPWRITE_PROJECT_ID']}"

        return jsonify({ "message": "QR code uploaded!", "qr_url": file_url, "qr_filename": qr_filename}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500


# Run Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
