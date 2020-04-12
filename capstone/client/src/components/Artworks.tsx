import { History } from 'history'
import update from 'immutability-helper'
import { parseUserId } from '../auth/utils'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createArtwork, deleteArtwork, getArtworks, patchArtwork } from '../api/artwork-api'
import Auth from '../auth/Auth'
import { Artwork } from '../types/Artwork'

interface ArtworksProps {
  auth: Auth
  history: History
}

interface ArtworksState {
  artworks: Artwork[]
  newArtworkName: string
  loadingArtworks: boolean
  userId: string
}

export class Artworks extends React.PureComponent<ArtworksProps, ArtworksState> {
  state: ArtworksState = {
    artworks: [],
    newArtworkName: '',
    loadingArtworks: true,
    userId: ''
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newArtworkName: event.target.value })
  }

  onEditButtonClick = (artworkId: string) => {
    this.props.history.push(`/artworks/${artworkId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newArtwork = await createArtwork(this.props.auth.getIdToken(), {
        name: this.state.newArtworkName,
        forSale: false
      })
      this.props.history.push(`/artworks/${newArtwork.artworkId}/edit`)
    } catch(err) {
      alert('Artwork creation failed')
    }
  }

  onArtworkDelete = async (artworkId: string) => {
    try {
      await deleteArtwork(this.props.auth.getIdToken(), artworkId)
      this.setState({
        artworks: this.state.artworks.filter(todo => todo.artworkId != artworkId)
      })
    } catch {
      alert('Artwork deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const artworks = await getArtworks(this.props.auth.idToken)
      this.setState({
        artworks,
        loadingArtworks: false,
        userId: parseUserId(this.props.auth.idToken)
      })
    } catch (e) {
      alert(`Failed to fetch artworks: ${e.message}`)
    }
  }


  render() {
    return (
      <div>
        <Header as="h1">Gallery</Header>

        {this.renderCreateTodoInput()}

        {this.renderArtworks()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New artwork',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Artwork title"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderArtworks() {
    if (this.state.loadingArtworks) {
      return this.renderLoading()
    }

    return this.renderArtworksList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading artworks
        </Loader>
      </Grid.Row>
    )
  }

  renderArtworksList() {
    return (
      <Grid padded>
        {this.state.artworks.map((artwork, pos) => {
          return (
            <Grid.Column width={8} key={artwork.artworkId}>
              <Grid.Row >
              <Grid.Column width={1} verticalAlign="middle">
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {artwork.name}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
              {this.state.userId === artwork.userId &&
              <Button
              icon
              color="blue"
              onClick={() => this.onEditButtonClick(artwork.artworkId)}
            >
              <Icon name="pencil" />
            </Button>
              }
                
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                {this.state.userId === artwork.userId &&
                <Button
                icon
                color="red"
                onClick={() => this.onArtworkDelete(artwork.artworkId)}
              >
                <Icon name="delete" />
              </Button>}
              </Grid.Column>
              {artwork.attachmentUrl && (
                <Image src={artwork.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          
            </Grid.Column>
            )
        })}
      </Grid>
    )
  }
}
