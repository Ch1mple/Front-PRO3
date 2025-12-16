import axios from 'axios'
import { API_BASE_URL } from '../config.js'
// llamadas a los servicios de la api
export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events`)
    return response.data
  } catch (error) { 
    throw new Error(error.message)
  }
}

export const postEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/event`, eventData)
    return response.data
  }
  catch (error) {
    throw new Error(error.message)
  } 
}

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`)
    return response.data
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getAllMovies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies`)
    return response.data
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getSearchMovies = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/search/${searchTerm}`)
    return response.data
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getSeachUserByUsername = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/search/${searchTerm}`)
    return response.data
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getSearchEventByTitle = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events/search/${searchTerm}`)
    return response.data
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getUserByUserUid = async (userUid) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userUid}`)
    return response.data
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getEventsByUserUid = async (userUid) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events/${userUid}`)
    return response.data
  } catch (error) {
    throw new Error(error.message)
  } 
}

export const getEventById = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events/id/${eventId}`)
    return response.data
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getUserLinksByUserUid = async (userUid) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user_links/${userUid}`)
    return response.data
  } catch (error) {
    throw new Error(error.message)
  } 
}

export const getUserLinksById = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user_links/id/${eventId}`)
    return response.data
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getUserEventsByUserUid = async (userUid) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user_events/${userUid}`)
    return response.data
  } catch (error) {
    throw new Error(error.message)
  }
}
export const getUserEventsById = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user_events/event_id/${eventId}`)
    return response.data
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getEuroCoins = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/euro-coins`)
    return response.data
  } catch (error) {
    throw new Error(error.message)
  }
}

export const removeMovie = async (userUid, movieId) => {
  try {
    await axios.post(`${API_BASE_URL}/users/remove-movie`, {
      user_uid: userUid,
      movie_id: movieId
    })
  } catch (e) {
    alert('Failed to remove movie: ' + (e.response?.data?.message || e.message))
  }
}

export const toggleWatched = async (userUid, movieId) => {
  try {
    await axios.post(`${API_BASE_URL}/users/toggle-movie-watched`, {
      user_uid: userUid,
      movie_id: movieId
    })
  } catch (e) {
    alert('Failed to toggle watched: ' + (e.response?.data?.message || e.message))
  }
}

export const addMovie = async (userUid, movieId) => {
  try {
    await axios.post(`${API_BASE_URL}/users/add-movie`, {
      user_uid: userUid,
      movie_id: movieId,
      watched: 0
    })
    alert('Movie added to your list!')
  } catch (e) {
    alert('Failed to add movie: ' + (e.response?.data?.message || e.message))
  }
}