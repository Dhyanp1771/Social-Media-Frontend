import { useState } from "react";
import { uploadToCloudinary } from "../utils/uploadTocloudinary";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/getCroppedImage";
import axios from "axios";

const CreatePostModal = () => {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setSelectedImage({ file, preview });
      setCropModalOpen(true);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && images.length === 0) return;

    setLoading(true);
    try {
      const uploadedImages = [];

      for (const img of images) {
        const result = await uploadToCloudinary(img);
        uploadedImages.push(result.url);
      }

      const payload = {
        content: text,
        images: uploadedImages,
      };
const token = localStorage.getItem("token");

const { data } = await axios.post("http://localhost:5000/api/posts", payload, {
  headers: {
    Authorization: `Bearer ${token}`, 
  },
});

       if (typeof onPostCreated === "function") {
      onPostCreated(data); // inform ProfilePage to reload
    }


      // TODO: Send payload to backend POST API
      console.log("Post Payload:", payload);
      alert("Post created successfully");
      setText("");
      setImages([]);
      setPreviews([]);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto bg-white p-4 rounded shadow">
        <textarea
          placeholder="Write your post..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded p-2 mb-3"
          rows={4}
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />
        <div className="flex gap-2 mt-2 flex-wrap">
          {previews.map((src, idx) => (
            <img key={idx} src={src} alt="preview" className="w-24 h-24 object-cover rounded" />
          ))}
        </div>

        <button
          disabled={loading || (!text && images.length === 0)}
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {cropModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-[90%] max-w-md">
            <h3 className="mb-2 font-semibold">Crop Image</h3>
            <div className="relative w-full h-64 bg-gray-100">
              <Cropper
                image={selectedImage.preview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
              />
            </div>
            <div className="flex justify-end mt-3 gap-2">
              <button
                onClick={() => {
                  setCropModalOpen(false);
                  setSelectedImage(null);
                }}
                className="text-gray-500"
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-1 rounded"
                onClick={async () => {
                  const cropped = await getCroppedImg(selectedImage.preview, croppedAreaPixels);
                  setImages((prev) => [...prev, cropped]);
                  setPreviews((prev) => [...prev, URL.createObjectURL(cropped)]);
                  setCropModalOpen(false);
                  setSelectedImage(null);
                }}
              >
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePostModal;
