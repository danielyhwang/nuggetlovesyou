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
      images : [
        null,
        {
          "imageSrc": require("/Wilson-04-14-2020.jpg"),
          "imageAlt": "This is Nugget.",
          "date" : "She loves you.",
          "photographer" : "Keith Upchurch"
        },
        null
      ],
      messages : [
        null,
        "Click on the Nugget Loves You button for more Nugget!",
        null
      ],
      currentCard: 1,
      backgroundStyle: {
        backgroundColor: "#FFFFFF",
        height: '100vh'
      }
    }
  }

  handleClick() {
    const test = [1, 2, 3]
    test.splice(this.state.currentCard)
    const newCard = test[Math.floor(Math.random() * 2)]
    
    this.setState({
      backgroundStyle: {
        backgroundColor: "#" + Math.floor(0xFFFFFF * Math.random()).toString(16),
        height: '100vh' 
      }
    })
    console.log(this.state.currentCard);
  }
  
  render() {
    return (
      <Container fluid style = {this.state.backgroundStyle}>
        <Grid>
          <Grid.Row verticalAlign = 'top'>
            <Grid.Column width = {4}>
              <Button icon floated = 'left'>
                <Icon name = 'music'/>
              </Button>
            </Grid.Column>
            <Grid.Column textAlign = 'center' width = {8}>
              <Button onClick = {() => this.handleClick()}>
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

        <Grid.Column>
          <Card centered>
            <Image src={`${this.state.images[1].imageSrc}`} alt = {`${this.state.images[1].imageAlt}`} wrapped ui={false} />
            <Card.Content>
              <Card.Header>{this.state.images[1].imageAlt}</Card.Header>
              <Card.Meta>
                <span className='date'>{this.state.images[1].date}</span>
              </Card.Meta>
              <Card.Description>
                {this.state.messages[1]}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name='camera' />
                Photo by {this.state.images[1].photographer}
              </a>
            </Card.Content>
          </Card>
        </Grid.Column>

    </Container>
    );
  }
}

export default App;

//<Image src={`${images[0].imageSrc}`} alt = {`${images[0].imageAlt}`} wrapped ui={false} />
//Photo by {`${imageInfo.photographer}`}