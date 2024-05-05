from blur import imageToPixels, blur, render_blur
from flask import Flask, request, send_file
from PIL import Image
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

@app.route("/", methods=["GET", "POST"])
def blur_image():
    file = request.files.get("file")
    blurLevel = request.form.get('blurLevel')

    if file is None or blurLevel is None:
        return "<h1>No file has been found to blur<h1>", 400

    file.save(file.filename)

    blurred_img_path = render_blur(blur(imageToPixels(file.filename), int(blurLevel)))

    blurred_img = Image.open(blurred_img_path)

    img_bytes = BytesIO()
    blurred_img.save(img_bytes, format='PNG')
    img_bytes.seek(0)

    return send_file(img_bytes, mimetype='image/png')


if __name__ == "__main__":
    app.run(debug=True)
