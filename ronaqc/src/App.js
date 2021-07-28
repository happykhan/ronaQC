import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { Spinner, Table,  Container, Navbar }  from 'react-bootstrap';
import { Aioli } from '@biowasm/aioli';
import React, { useState } from 'react';
import Covplot from './Covplot'
import ref from './ref.array'
import primers from './nCov-2019.insert.bed'
import { getSnpBadge, getBaseBadge, getAmpBadge, getReadBadge } from  './BadgeValue.js'
import { makeConsensus, snpCount, updateMainState }  from './Helper'
import Summary from './Summary'
import columns from './SummaryColumns'

let samtools = new Aioli("samtools/1.10");
let bedtools2 = new Aioli("bedtools2/2.29.2");

samtools
  .init()
  .then(() => samtools.exec("--version"))
  .then(d => console.log(d.stdout));

bedtools2
  .init()
  .then(() => bedtools2.exec("--version"))
  .then(d => console.log(d.stdout));  

function App() {
  const [state, setState] = useState({ coverage: [], negativeSnp: -1, negativeGenomeRecovery: -1, negativeFullReads: -1, negativeAmplicons: -1, negativeTotalReads: -1, records: [] });

  const addSampleBamFiles = (event) => {
    for(var k = 0; k < event.target.files.length; k++){
      let currentFile = event.target.files[k]
      Aioli
      .mount(currentFile)
      .then(f => {
        // Fetch the missing amplicons

        samtools.exec(`depth -a ${f.path}`).then(d =>  {
          if (d.stderr !== ""){
            console.log('DEPTH STDERR: ' + d.stderr)
          }
          const coverageArray = d.stdout.split("\n").map(v => Number.isNaN(+v.split('\t')[2]) ? 0: +v.split('\t')[2] ); 
          fetch(primers).then(response => response.text()).then(amp => {
            // Fetch amplicon coverage 
            const bedFile = amp.split('\n');
            let ampList = [] ;
            for(var j = 0;j< bedFile.length;j++){
              let start = +bedFile[j].split("\t")[1];
              let stop = +bedFile[j].split("\t")[2];
              let idname = +bedFile[j].split("\t")[3];
              let covAmp = 0; 
              for(var k = start; k < stop; k++){
                if(coverageArray[k] > 9){
                  covAmp = covAmp + 1; 
                }
              }
              if (covAmp / (stop - start) < 0.4){ 
                ampList.push(idname); 
              }
            }
            let genomeRecovery = Number(Math.round(coverageArray.filter(v => v >= 10 ).length))
            const newStats = {name: f.name, missingAmplicons: ampList.join(', '), genomeRecovery: genomeRecovery}; 
            setState(prevState=> ({...prevState, records: updateMainState(state.records, newStats) }));
          });          

        });
      });
    }
  }

  const addBamFile = (event) => {
    setState(prevState => ({...prevState, negativeGenomeRecovery: -2, negativeSnp: -2, negativeAmplicons: -2,  negativeFullReads: -2 }));

    Aioli
        .mount(event.target.files[0])
        .then(f => {
          // Fetch the coverage depth 
          samtools.exec(`depth -a ${f.path}`).then(d =>  {
            if (d.stderr !== ""){
              console.log('DEPTH STDERR: ' + d.stderr)
            }

            const blankCoverageArray = d.stdout.split("\n").map(v => Number.isNaN(+v.split('\t')[2]) ? 0: +v.split('\t')[2] ); 
            setState(prevState=> ({...prevState, coverage: blankCoverageArray, 
                negativeGenomeRecovery:Number(Math.round(blankCoverageArray.filter(v => v >= 10 ).length))})); // / blankCoverageArray.length * 100 + 'e2' ) + 'e-2' )}))            
            fetch(primers).then(response => response.text()).then(amp => {
              // Fetch amplicon coverage 
              const bedFile = amp.split('\n');
              console.log(blankCoverageArray);
              let ampList = [] ;
              for(var j = 0;j< bedFile.length;j++){
                let start = +bedFile[j].split("\t")[1];
                let stop = +bedFile[j].split("\t")[2];
                let idname = +bedFile[j].split("\t")[3];
                let covAmp = 0; 
                for(var k = start; k < stop; k++){
                  if(blankCoverageArray[k] > 9){
                    covAmp = covAmp + 1; 
                  }
                }
                if (covAmp / (stop - start) > 0.4){ 
                  console.log(idname);
                  ampList.push(idname); 
                }
              }
              setState(prevState=> ({...prevState, negativeAmplicons: ampList.join(', ')}))                          
            });

          });
          
          samtools.exec(`flagstat ${f.path}`).then(d =>  {
            if (d.stderr !== ""){
              console.log('FLAGSTAT STDERR: ' + d.stderr)
            }            
            const properReads = +d.stdout.split('\n')[8].split(" ")[0];
              setState(prevState=> ({...prevState, negativeTotalReads: properReads}))
          });          
          // Fetch the "good" mapped read
          // samtools view /data/322537-PC_S1084.mapped.bam -F 4 -m 148 -c -q 60 
          samtools.exec(`view -F 4 -m 148 -c -q 60 ${f.path}`).then(d =>  {
            if (d.stderr !== ""){
              console.log('VIEW STDERR: ' + d.stderr)
            }            
            const onefoureight = +d.stdout.split('\n')[0];
            setState(prevState=> ({...prevState, negativeFullReads: onefoureight}))
          });


          // Calculate the SNPs 
          fetch(ref).then(response => response.text()).then(x => Array.from(x))
          .then(refArray => {
          // You can't seem to have multiple padding spaces i.e. no '  ' only ' ' 
            samtools.exec(`mpileup -d 200 -q 20 ${f.path}`).then(d => {
              if (d.stderr !== ""){
                console.log('MPILEUP STDERR: ' + d.stderr)
              }
              const consensus = makeConsensus(d.stdout) ;  
              console.log(consensus);
              const snpCounter = snpCount(consensus, refArray)
              setState(prevState=> ({...prevState, negativeSnp: snpCounter}))

            }); 
          }); 

        });
  }

  return (
    <div className="App">
      <Navbar.Brand href="#">RonaQC</Navbar.Brand>
      <Container>
        <Form>
          <Form.File  onChange={(e) => addBamFile(e) }  label="Choose SARS-CoV2 sorted BAM (Negative control)"/>
        </Form>      
      </Container>
      <br></br>
      <Container>
        <b>Key Metrics - Negative control</b>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
                 <th>SNPs</th> 
                 <th>Called bases</th>
                 <th>Best mapped reads / Well mapped reads</th>
                 <th>Detected amplicons</th>
            </tr>                 
          </thead>
          <tbody>
            <tr>
              <td>{(state.negativeSnp === -1) ? 'Waiting for user' : (state.negativeSnp === -2) ? <Spinner animation="border" /> : state.negativeSnp} {getSnpBadge(state.negativeSnp)}</td>
              <td>{(state.negativeGenomeRecovery === -1) ? 'Waiting for user' :  (state.negativeGenomeRecovery === -2) ? <Spinner animation="border" /> : state.negativeGenomeRecovery } {getBaseBadge(state.negativeGenomeRecovery)}</td>
              <td>{(state.negativeFullReads === -1) ? 'Waiting for user' : (state.negativeFullReads === -2) ? <Spinner animation="border" /> :  state.negativeFullReads + " / " + state.negativeTotalReads} {getReadBadge(state.negativeFullReads)}</td>
              <td>{(state.negativeAmplicons === -1) ? 'Waiting for user' : (state.negativeAmplicons === -2) ? <Spinner animation="border" /> :  (state.negativeAmplicons.length === 0) ? 'None' : state.negativeAmplicons} {getAmpBadge(state.negativeAmplicons.length)}</td>
            </tr>
          </tbody>
        </Table>
      </Container>
      <Container>
      {(state.negativeGenomeRecovery === -1) ? 
          <Alert variant='info'>Load a BAM file from a negative control to get started</Alert>:  (state.negativeGenomeRecovery === -2) ? 
          <Spinner animation="grow" />: <Covplot coverage={state.coverage} />}
      </Container>
      <Container>
        <Form>
          <Form.File  onChange={(e) => addSampleBamFiles(e) }  label="Choose SARS-CoV2 sorted BAMs"  />
        </Form>      
      </Container>
      <Container>
        {(state.records.length > 0)
          ? <Summary columns={columns} data={state.records} />
          : <Alert variant='info'>Load a BAM file from a sample to get started</Alert>
    }   
      </Container>
    </div>
  );
}

export default App;
