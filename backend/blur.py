from PIL import Image as img

class Im:
    def __init__(self, pixels, width, height, path):
        self.pixels = pixels
        self.width = width
        self.height = height
        self.path = path

# returns pixels of the image in the 
#  format => [[(R,G,B), (R,G,B)], [(R,G,B), (R,G,B)]] through an Im object
def imageToPixels(image_path: str):
    myImage = img.open(image_path, 'r')
    old_pixels = list(myImage.getdata())

    width, height = myImage.size
    pixels = []

    for row in range(height):
        pixel_row = []
        
        for pixel in range(width):
            pixel_row.append(old_pixels[row * width + pixel][0:3])
        
        pixels.append(pixel_row)

    return Im(pixels, width, height, image_path[0:-4])


# blur the actual image 
def blur(image: Im, blur_level):

    for row in range(blur_level, image.height - blur_level):
        for pixel in range(blur_level, image.width - blur_level):

            r = 0
            g = 0
            b = 0

            for i in range(-blur_level, blur_level + 1):
                for j in range(-blur_level, blur_level + 1):
                    r+= image.pixels[row + i][pixel + j][0]
                    g+= image.pixels[row + i][pixel + j][1]
                    b+= image.pixels[row + i][pixel + j][2]
                    

            image.pixels[row][pixel] = tuple(map((lambda num: num // ((2 * blur_level) + 1) ** 2), (r, g, b)))

    return image

            
#save the image rendered
def render_blur(image: Im):
    flattened_pixels = [x for rows in image.pixels for x in rows]

    myImage = img.new('RGB', (image.width, image.height))
    myImage.putdata(flattened_pixels)

    myImage.save("/tmp/" + image.path + '_blurred.png')

    return "/tmp/" + image.path + '_blurred.png'

