import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { Aioli } from '@biowasm/aioli';
import React, { useState } from 'react';
import Covplot from './Covplot'


let samtools = new Aioli("samtools/1.10");
samtools
  .init()
  .then(() => samtools.exec("--version"))
  .then(d => console.log(d.stdout));

function App() {
  console.log("RonaQC started");
  const [state, setState] = useState({coverage: [] });

  const  addBamFile = (event) => {
    Aioli
        .mount(event.target.files[0])
        .then(f => samtools.exec(`depth -a ${f.path}`))
        .then(d => {
          if (d.stderr !== ""){
            console.log('STDERR: ' + d.stderr)
          }
          console.log(d.stdout.split("\n").map(v => +v.split('\t')[2]));
          setState({coverage: d.stdout.split("\n").map(v => +v.split('\t')[2])});
          }
        );        
  };
  
  return (
    <div className="App">
      <Container>
        <h1>RonaQC</h1>
        <Form>
          <Form.File  onChange={(e) => addBamFile(e) }  label="Choose SARS-CoV2 sorted BAM"/>
        </Form>      
        {(state.coverage.length > 0 )
        ? <Covplot coverage={state.coverage} />
        : <Alert variant='info'>Load a BAM file to get started</Alert>
        }
      </Container>
    </div>
  );
}

export default App;
