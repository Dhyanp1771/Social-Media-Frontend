// components/ImageCropModal.jsx
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { Slider } from '@mui/material';

const ImageCropModal = ({ image, onCancel, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    onCropDone(croppedImage);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded max-w-md w-full">
        <div className="relative w-full h-64 bg-black">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-4">
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, zoom) => setZoom(zoom)}
          />
        </div>

        <div className="flex justify-end mt-4 gap-3">
          <button onClick={onCancel} className="bg-gray-300 px-4 py-1 rounded">Cancel</button>
          <button onClick={handleDone} className="bg-blue-600 text-white px-4 py-1 rounded">Crop</button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
