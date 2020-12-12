import logo from './logo.svg';
import './App.css';
import { Container, Grid, Header, Button, Icon, Image} from "semantic-ui-react";

import testImage from "./Wilson-04-14-2020.jpg";

function App() {
  return (
    <Container>
      <Grid celled padded style ={{height: "100vh"}}>
        <Grid.Row verticalAlign = 'top'>
          <Grid.Column width = {4}>
            <Button icon floated = 'left'>
              <Icon name = 'share'/>
            </Button>
          </Grid.Column>
          <Grid.Column textAlign = 'center' width = {8}>
            <Header>
              NuggetLovesYou
            </Header>
          </Grid.Column>
          <Grid.Column width = {4}>
            <Button icon floated = 'right'>
              <Icon name = 'info circle'/>
            </Button>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row centered style = {{height: "60%"}} verticalAlign = "middle">
          <Grid.Column width = {12}>
            <Image centered src = {testImage}/>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row verticalAlign = "bottom">
          <Grid.Column width = {2}>
            <Button icon floated = 'left'>
              <Icon name = 'share'/>
            </Button>
          </Grid.Column>
          <Grid.Column textAlign = 'center' width = {12}>
            <Header>
              blank void
            </Header>
          </Grid.Column>
          <Grid.Column width = {2}>
            <Button icon floated = 'right'>
              <Icon name = 'info circle'/>
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default App;
