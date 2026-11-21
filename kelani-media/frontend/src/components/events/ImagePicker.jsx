import React, { useState } from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { resizeImage } from '../../utils/imageUtils.js';

// Lets the user upload a photo from their computer and shows a preview.
// "value" is the image text and "onChange" gets the new image text.
// shape: 'circle' (profile photo), 'cover' (wide cover photo) or 'square' (post / item photo)
const ImagePicker = ({ value, onChange, shape = 'square', maxWidth = 1200 }) => {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const image = await resizeImage(file, maxWidth);
      onChange(image);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      e.target.value = ''; // so the same file can be picked again
    }
  };

  const previewSize = {
    circle: 'w-32 h-32 rounded-full',
    cover: 'w-full h-44 rounded-2xl',
    square: 'w-full h-56 rounded-2xl'
  }[shape];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${previewSize} flex items-center justify-center overflow-hidden border border-gray-200 bg-gray-100`}>
        {value ? (
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <HiOutlinePhotograph className="h-10 w-10 text-gray-400" />
        )}
      </div>

      <div className="flex gap-2">
        <label className="cursor-pointer rounded-xl bg-[#800000]/10 px-4 py-2 text-xs font-semibold text-[#800000] hover:bg-[#800000] hover:text-white">
          {loading ? 'Loading...' : value ? 'Change photo' : 'Upload photo'}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default ImagePicker;
