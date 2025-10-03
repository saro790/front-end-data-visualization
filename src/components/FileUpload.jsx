import React, { useState } from 'react';
import axios from 'axios';

export default function FileUpload() {
  const [file, setFile] = useState(null);  // User selected file
  const [msg, setMsg] = useState('');      // Success / error message

  // ---------- Submit function ----------
  const submit = async (e) => {
    e.preventDefault();  // Prevent page reload

    if (!file) {
      setMsg('Please choose a file');
      return;
    }

    const fd = new FormData();  // Create FormData object
    fd.append('file', file);    // Append file to key 'file'

    try {
      // Axios POST request to Django backend
      const res = await axios.post(
        'http://127.0.0.1:8000/api/upload-pdf/', // Backend URL
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data',  // Required for file upload
          },
        }
      );

      // Success message
      setMsg('Uploaded successfully: ' + JSON.stringify(res.data));
    } catch (err) {
      // Error message
      setMsg('Error: ' + (err.response?.data?.error || err.message));
    }
  };

 
}
