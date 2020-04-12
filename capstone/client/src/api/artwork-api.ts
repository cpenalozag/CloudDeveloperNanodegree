import { apiEndpoint } from '../config'
import { Artwork } from '../types/Artwork';
import { CreateArtworkRequest } from '../types/CreateArtworkRequest';
import { UpdateArtworkRequest } from '../types/UpdateArtworkRequest';
import Axios from 'axios'

export async function getArtworks(idToken: string): Promise<Artwork[]> {
  console.log('Fetching artworks')

  const response = await Axios.get(`${apiEndpoint}/artworks`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Artworks:', response.data)
  return response.data.items
}

export async function getUserArtworks(userId: String): Promise<Artwork[]> {
  console.log('Fetching artworks of user with id', userId)

  const response = await Axios.get(`${apiEndpoint}/artworks`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log('Artworks:', response.data)
  return response.data.items
}

export async function createArtwork(
  idToken: string,
  newArtwork: CreateArtworkRequest
): Promise<Artwork> {
  const response = await Axios.post(`${apiEndpoint}/artworks`,  JSON.stringify(newArtwork), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchArtwork(
  idToken: string,
  artworkId: string,
  updatedArtwork: UpdateArtworkRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/artworks/${artworkId}`, JSON.stringify(updatedArtwork), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteArtwork(
  idToken: string,
  artworkId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/artworks/${artworkId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  artworkId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/artworks/${artworkId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
