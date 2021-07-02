import { Badge } from 'react-bootstrap';

export function getSnpBadge(count){ 
    if (count > 0){
      return  <Badge variant="danger">Fail</Badge>;
    }
    if (count === 0){
      return  <Badge variant="success">Pass</Badge>;
    }
    return '';
  }
  
  export function getBaseBadge(count){ 
    if (count >= 1000){
      return  <Badge variant="danger">Fail</Badge>;
    }
    if (count >= 600 && count < 1000) {
      return  <Badge variant="warning">Warn</Badge>;
    }
    if (count >= 0 && count < 600) {
      return  <Badge variant="success">Pass</Badge>;
    }  
    return '';
  
  }
  
  export function getReadBadge(count){ 
    if (count > 500){
      return  <Badge variant="danger">Fail</Badge>;
    }
    if (count >= 50 && count <= 500) {
      return  <Badge variant="warning">Warn</Badge>;
    }
    if (count >= 0 && count <= 50) {
      return  <Badge variant="warning">Warn</Badge>;
    }    
    return '';
  }
  
  export function getAmpBadge(count){ 
    if (count > 2){
      return  <Badge variant="danger">Fail</Badge>;
    }
    if (count <= 2 && count > 0) {
      return  <Badge variant="warning">Warn</Badge>;
    }  
    if (count === 0){
      return  <Badge variant="success">Pass</Badge>;
    }
    return '';
  }