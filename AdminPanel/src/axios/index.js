import Axios from './instance';

let abortController = new AbortController();

export function getHttpRequest(url, config = {}) {
  const requestConfig = {
    signal: abortController.signal,
    ...config,
  };

  return Axios.get(url, requestConfig)
    .then(response => response.data)
    .catch(error => {
      if (error.name === 'AbortError') {
        // Request was aborted
        return Promise.reject(new Error('Request aborted'));
      }
      // Handle other errors
      return Promise.reject(error);
    });
}

export function postHttpRequest(url, data, config = {}) {
  const requestConfig = {
    signal: abortController.signal,
    ...config,
  };

  return Axios.post(url, data, requestConfig)
    .then(response => response.data)
    .catch(error => {
      if (error.name === 'AbortError') {
        // Request was aborted
        return Promise.reject(new Error('Request aborted'));
      }
      // Handle other errors
      return Promise.reject(error);
    });
}

export function putHttpRequest(url, data, config = {}) {
  const requestConfig = {
    signal: abortController.signal,
    ...config,
  };

  return Axios.put(url, data, requestConfig)
    .then(response => response.data)
    .catch(error => {
      if (error.name === 'AbortError') {
        // Request was aborted
        return Promise.reject(new Error('Request aborted'));
      }
      // Handle other errors
      return Promise.reject(error);
    });
}

export function cancelOngoingHttpRequest() {
  abortController.abort();

  // Generate a new AbortController instance
  abortController = new AbortController();
}
