// import logo from './logo.svg';
import './App.css';
import { Card, Container, Grid, Header, Button, Icon, Image} from "semantic-ui-react";
import assets from "./assets.json";

function App() {
  const imageInfo = assets[Math.floor(Math.random() * assets.length)]
  const testRotate = {
    transform: 'rotate(5deg)'
  }
  return (
    <Container>
      <div style={{ display: "flex" }}>
        <button
          style={{ marginLeft: "auto" }}
        >
          Click
        </button>
      </div>
      <Card centered style = {testRotate}>
      <Image src={`${imageInfo.imageSrc}`} alt = {`${imageInfo.imageAlt}`} wrapped ui={false} />
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
          Photo by {`${imageInfo.photographer}`}
        </a>
      </Card.Content>
    </Card>
  </Container>
  )
  /**
   * return (
    <Container>
      <Grid>
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
            <Image centered src = {`${imageInfo.imageSrc}`} alt = {`${imageInfo.imageAlt}`}  className = "center" />
          </Grid.Column>
        </Grid.Row>

      </Grid>
    </Container>
  );
  */
}

export default App;
