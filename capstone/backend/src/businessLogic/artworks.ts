import * as uuid from 'uuid'

import { ArtworkItem } from '../models/ArtworkItem'
import { ArtworkAccess } from '../dataLayer/artworkAccess'
import { CreateArtworkRequest } from '../requests/CreateArtworkRequest'
import { UpdateArtworkRequest } from '../requests/UpdateArtworkRequest'
import { parseUserId } from '../auth/utils'

const artworkAccess = new ArtworkAccess()

export async function getArtworkById(artworkId: String): Promise<ArtworkItem> {
  return artworkAccess.getArtworkById(artworkId)
}

export async function getAllArtworks(): Promise<ArtworkItem[]> {
  return await artworkAccess.getAllArtworks()
}

export async function getUserArtworks(userId: string): Promise<ArtworkItem[]> {
  return await artworkAccess.getUserArtworks(userId)
}

export async function deleteArtworks(artworkId: String): Promise<ArtworkItem> {
  let artwork = await getArtworkById(artworkId)
  return await artworkAccess.deleteArtwork(artwork)
}

export async function updateArtwork(
  artworkId: String,
  updateArtworkRequest: UpdateArtworkRequest
): Promise<ArtworkItem> {
  let artwork = await getArtworkById(artworkId)
  for (let property in updateArtworkRequest) {
    if (updateArtworkRequest.hasOwnProperty(property)) {
      artwork[property] = updateArtworkRequest[property]
    }
  }

  return await artworkAccess.updateArtwork(artwork)
}

export async function createArtwork(
  createArtworkRequest: CreateArtworkRequest,
  jwtToken: string
): Promise<ArtworkItem> {

  const artworkId = uuid.v4()
  const userId = parseUserId(jwtToken)

  let newArtwork = {
    artworkId: artworkId,
    userId: userId,
    createdAt: new Date().toISOString(),
  }

  for (let property in createArtworkRequest) {
    if (createArtworkRequest.hasOwnProperty(property)) {
      newArtwork[property] = createArtworkRequest[property]
    }
  }

  return await artworkAccess.createArtwork(newArtwork as ArtworkItem)
}

export async function generateUploadUrl(artworkId: string) {
  return await artworkAccess.generateUploadUrl(artworkId)
}