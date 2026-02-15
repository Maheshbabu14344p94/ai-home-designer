import API from './api';

export const uploadDesign = async (formData) => {
  try {
    const response = await API.post('/designs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllDesigns = async (filters = {}) => {
  try {
    const response = await API.get('/designs', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDesignById = async (id) => {
  try {
    const response = await API.get(`/designs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getArchitectDesigns = async () => {
  try {
    const response = await API.get('/designs/architect/my-designs');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateDesign = async (id, formDataOrUpdates, imageFile = null) => {
  try {
    let data;
    
    // If it's already FormData, use it directly
    if (formDataOrUpdates instanceof FormData) {
      data = formDataOrUpdates;
    } else {
      // If it's a plain object, convert to FormData
      data = new FormData();
      Object.keys(formDataOrUpdates).forEach((key) => {
        data.append(key, formDataOrUpdates[key]);
      });
      if (imageFile) {
        data.append('image', imageFile);
      }
    }

    const response = await API.put(`/designs/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteDesign = async (id) => {
  try {
    const response = await API.delete(`/designs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};