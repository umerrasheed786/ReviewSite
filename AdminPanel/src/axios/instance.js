import axios from 'axios';
// import crypto from 'crypto';

// Encryption and decryption functions
const encryptPayload = (payload) => {
  // Use your encryption algorithm and key to encrypt the payload
  const algorithm = 'aes-256-cbc';
  const key = 'your-encryption-key'; // Replace with your encryption key
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
  };
};

const decryptPayload = (encryptedData, iv) => {
  // Use your encryption algorithm and key to decrypt the payload
  const algorithm = 'aes-256-cbc';
  const key = 'your-encryption-key'; // Replace with your encryption key
  
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return JSON.parse(decrypted);
};

const instance = axios.create({
  baseURL: 'http://localhost:8082/', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json', // Adjust the content type based on your API requirements
  },
});

// Add interceptors for request and response
instance.interceptors.request.use(
  (config) => {
    // Encrypt the request payload before sending
    // if (config.data) {
    //   const encryptedPayload = encryptPayload(config.data);
    //   config.data = encryptedPayload;
    // }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    // Decrypt the response payload before returning
    // if (response.data) {
    //   const decryptedPayload = decryptPayload(response.data.encryptedData, response.data.iv);
    //   response.data = decryptedPayload;
    // }
    return response;
  },
  (error) => {
    // Handle response errors
    return Promise.reject(error);
  }
);

export default instance;
