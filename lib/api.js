/*─────────────────────────────────────────
  lib/api.js – ayanaMD by KennDev
  Helper untuk memanggil API alfisy
─────────────────────────────────────────*/

import axios from 'axios';
import FormData from 'form-data';

const BASE_URL = 'https://api.alfisy.my.id';

/**
 * Memanggil API alfisy (GET)
 * @param {string} endpoint - Path endpoint (misal: '/api/download/ytmp4')
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Response JSON
 */
export async function alfisy(endpoint, params = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const { data } = await axios.get(url, { params, timeout: 30000 });
    return data;
  } catch (e) {
    throw new Error(`API Error: ${e.message}`);
  }
}

/**
 * Memanggil API alfisy (POST dengan FormData)
 * @param {string} endpoint - Path endpoint (misal: '/api/ai/editimage')
 * @param {Object} formData - Form data (bisa include file buffer + fields)
 * @returns {Promise<Object>} - Response JSON
 */
export async function alfisyPost(endpoint, formData = {}) {
  try {
    const form = new FormData();
    
    for (const [key, value] of Object.entries(formData)) {
      if (Buffer.isBuffer(value)) {
        form.append(key, value, { filename: `${key}.jpg` });
      } else {
        form.append(key, value);
      }
    }

    const url = `${BASE_URL}${endpoint}`;
    const { data } = await axios.post(url, form, {
      headers: form.getHeaders(),
      timeout: 60000,
    });
    return data;
  } catch (e) {
    throw new Error(`API Error: ${e.message}`);
  }
}

/**
 * Download file dari URL dan return buffer
 * @param {string} url - URL file
 * @returns {Promise<Buffer>} - Buffer file
 */
export async function downloadFile(url) {
  try {
    const { data } = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 60000,
    });
    return Buffer.from(data);
  } catch (e) {
    throw new Error(`Download Error: ${e.message}`);
  }
}

/**
 * Upload buffer image ke Alfis CDN
 * @param {Buffer} buffer - Image buffer
 * @param {string} mime - MIME type (e.g., 'image/jpeg')
 * @returns {Promise<string>} - Direct URL
 */
export async function uploadToAlfis(buffer, mime) {
  const ext = mime?.split('/')[1] || 'bin';
  const fileName = `upload.${ext}`;

  const form = new FormData();
  form.append('file', buffer, { filename: fileName, contentType: mime });

  const response = await axios.post('https://api.alfisy.my.id/api/tools/upload', form, {
    headers: form.getHeaders(),
    timeout: 60000,
  });

  const res = response.data;
  if (!res?.status) throw new Error(res?.message || 'Upload gagal ke CDN');
  return res.urls.direct;
}

export default { alfisy, alfisyPost, downloadFile, uploadToAlfis };
