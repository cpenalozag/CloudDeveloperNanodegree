/**
 * Fields in a request to update a single artwork item.
 */
export interface UpdateArtworkRequest {
  name?: string
  description?: string
  forSale?: boolean
  attachmentUrl?: string
}