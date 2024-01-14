import { useState } from "react";
import { ImageResponse } from "./types";
import OpenAI from "openai";
import { Loader } from "./components/Loader";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openAi = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [images, setImages] = useState<ImageResponse>();
  const [inputImage, setInputImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchImages = async () => {
    setIsLoading(true);
    setImages(undefined);
    if (inputImage && inputImage.trim().length > 0) {
      try {
        const response = (await openAi.images.generate({
          model: "dall-e-2",
          prompt: inputImage,
          n: 4,
          size: "512x512",
        })) as ImageResponse;
        setImages(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <img src="background.svg" className="absolute" />
      <div className="relative w-screen h-screen flex justify-center items-start mt-12">
        <div className="w-1/2 h-2/3 flex flex-col">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <input
              className="outline-none border-pink-500 border rounded-md w-full p-3 mb-2"
              type="text"
              placeholder="Type something to generate images:"
              onChange={(event) => setInputImage(event.target.value)}
              value={inputImage}
            />
            <button
              className="p-2 ml-2 bg-pink-700 hover:bg-pink-500 w-full text-white rounded-md"
              onClick={fetchImages}
            >
              Generate Images
            </button>
          </div>
          <div className="h-full w-full flex justify-center items-center mt-14">
            {isLoading && <Loader />}
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-1">
            {images &&
              images.data &&
              images?.data.map((image) => (
                <div key={image.url}>
                  <img src={image.url} className="w-[512px] rounded-md" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
