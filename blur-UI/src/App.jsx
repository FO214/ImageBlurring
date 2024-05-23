import {
  ChakraProvider,
  Heading,
  Container,
  Text,
  Input,
  Button,
  Wrap,
  Stack,
  Image,
  Link,
  SkeletonCircle,
  SkeletonText,
  Spinner
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

const App = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [blurredImage, setBlurredImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (buttonText) => {
    setSelectedButton(buttonText);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setUploadedImage(URL.createObjectURL(file));
  };

  const handleDownload = (blurredImageUrl) => {
    const link = document.createElement('a');
    link.href = blurredImageUrl;
    link.download = 'blurred_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const blurImage = async () => {
    try {
      let blurLevel;
      const blur = {'Barely Blurry': 2, 'A Bit Blurry': 4, 'Kinda Blurry': 6, 'Pretty Blurry': 8, 'VERY BLURRY': 10}
        setLoading(true);
        const formData = new FormData();
        const fileInput = document.querySelector('input[type="file"]');
        formData.append("file", fileInput.files[0]); // Use the selected file, not the URL

        if (selectedButton) {
          blurLevel = blur[selectedButton];
        } else {
          blurLevel = 5;
        }

        formData.append("blurLevel", blurLevel)
  
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            responseType: "arraybuffer",
        };

        const response = await axios.post("http://127.0.0.1:5000", formData, config);

        // Convert the binary data received from the server to a blob and create a URL for the blurred image
        console.log(response.data)
        const blob = new Blob([response.data], { type: "image/png" });
        setBlurredImage(URL.createObjectURL(blob));
    } catch (error) {
        console.error("Error blurring image:", error);
    } finally {
        setLoading(false);
    }
  };



  return (
    <ChakraProvider>
      <Container >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Heading>Image Blurring 🚀</Heading>
        </div>
        
        <Text marginBottom={"10px"}>
          This is a small React app that is able to blur any uploaded image you give it!
        </Text>

        <Wrap marginBottom={"10px"}>
          <Input type="file" onChange={handleImageUpload}></Input>
          <Text>Choose the level of blur you would like, the bigger the picture, the higher level you should choose!</Text>
          <Stack spacing={3} direction='row' align='center'>
            <Button
              colorScheme={selectedButton === 'Barely Blurry' ? 'teal' : 'gray'}
              size='sm'
              onClick={() => handleButtonClick('Barely Blurry')}
            >
              Barely Blurry
            </Button>

            <Button
              colorScheme={selectedButton === 'A Bit Blurry' ? 'teal' : 'gray'}
              size='sm'
              onClick={() => handleButtonClick('A Bit Blurry')}
            >
              A Bit Blurry
            </Button>

            <Button
              colorScheme={selectedButton === 'Kinda Blurry' ? 'teal' : 'gray'}
              size='sm'
              onClick={() => handleButtonClick('Kinda Blurry')}
            >
              Kinda Blurry
            </Button>

            <Button
              colorScheme={selectedButton === 'Pretty Blurry' ? 'teal' : 'gray'}
              size='sm'
              onClick={() => handleButtonClick('Pretty Blurry')}
            >
              Pretty Blurry
            </Button>

            <Button
              colorScheme={selectedButton === 'VERY BLURRY' ? 'teal' : 'gray'}
              size='sm'
              onClick={() => handleButtonClick('VERY BLURRY')}
            >
              VERY BLURRY
            </Button>

          </Stack>
          </Wrap>
          <Button onClick={blurImage} colorScheme={"yellow"} marginBottom={"10px"}>
            Blur
          </Button>

        {loading ? (
          <Stack>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Spinner size='xl' />
            </div>
          </Stack>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {uploadedImage && (
              <div>
                <p>Your Image</p>
                <Image src={uploadedImage} boxShadow="lg" />
              </div>
            )}
        
            {blurredImage && (
              <div>
                <p>Your Blurred Image</p>
                <Image id="blurry" src={blurredImage} boxShadow="lg" marginBottom={"10px"}/>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                  <Button onClick={() => handleDownload(blurredImage)} colorScheme="teal" >Download it!</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </ChakraProvider>
  );
};

export default App;
