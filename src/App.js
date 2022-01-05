// import logo from './logo.svg';
import './App.css';
import { Card, Container, Grid, Header, Button, Icon, Image} from "semantic-ui-react";
import assets from "./assets.json";
import React from 'react';
import { render } from 'react-dom';
import testImageSrc from "./Wilson-04-14-2020.jpg"



/**
 * NuggetLovesYou 2.0
 * Instead of a static golden frame of Nugget, I want to create a minimalist
 * website that upon clicking on the "Nugget Loves You" button to
 * 1. refresh the background
 * 2. fly in a new card with a new image/description of Nugget.
 * 
 * The actual files themselves are stored in public/assets.
 * 
 */

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      testImage : {
        "imageSrc": testImageSrc,
        "imageAlt": "Nugget in front of Wilson",
        "photographer" : "Keith Upchurch"
      },
      images : new Array(3).fill(null),
      currentObject : -1
    }
  }
  
  render() {
    return (
      <Container>
        <Grid>
          <Grid.Row verticalAlign = 'top'>
            <Grid.Column width = {4}>
              <Button icon floated = 'left'>
                <Icon name = 'music'/>
              </Button>
            </Grid.Column>
            <Grid.Column textAlign = 'center' width = {8}>
              <Button floated = "center">
                Nugget Loves You!
              </Button>
            </Grid.Column>
            <Grid.Column width = {4}>
              <Button icon floated = 'right'>
                <Icon name = 'info circle'/>
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        
        <Card centered>
        <Image src={`${this.state.testImage.imageSrc}`} alt = {`${this.state.testImage.imageAlt}`} wrapped ui={false} />
        <Card.Content>
          <Card.Header>This is Nugget.</Card.Header>
          <Card.Meta>
            <span className='date'>She loves you.</span>
          </Card.Meta>
          <Card.Description>
            You look quite nice today.
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name='camera' />
            Photo by {`${this.state.testImage.photographer}`}
          </a>
        </Card.Content>
      </Card>
    </Container>
    );
  }
}

export default App;

//<Image src={`${images[0].imageSrc}`} alt = {`${images[0].imageAlt}`} wrapped ui={false} />
//Photo by {`${imageInfo.photographer}`}