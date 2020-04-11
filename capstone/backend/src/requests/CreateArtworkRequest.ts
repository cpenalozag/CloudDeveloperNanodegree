/**
 * Fields in a request to create a single artwork item.
 */
export interface CreateArtworkRequest {
  name: string
  description?: string
  forSale: boolean
  attachmentUrl: string
}
