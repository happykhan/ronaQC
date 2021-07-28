
 
export function maxChar(str) {
    const charMap = {};
    let max = 0;
    let maxChar = '';
  
    // create character map
    for (let char of str) {
      if (char.match("[ATGC]")){
      if (charMap[char]) {
        // increment the character's value if the character existed in the map
        charMap[char]++;
      } else {
        // Otherwise, the value of the character will be increamented by 1
        charMap[char] = 1;
      }
    }
    }

    // find the most commonly used character
    for (let char in charMap) {
      if (charMap[char] > max) {
        max = charMap[char];
        maxChar = char;
      }
    }
  
    return maxChar;
    }
  
export function makeConsensus(consensus, covCutOff = 10){ 
      let cons = Array.from('N'.repeat(29903)) 
      console.log('Calculating consensus...');
      const pileup = consensus.split("\n"); 
      let calledBases = 0; 
      for(var i = 0;i < pileup.length;i++){
          const cov = +pileup[i].split('\t')[3]; 
          const pos = +pileup[i].split('\t')[1] -1 ; // one-based index. to zero-based index. 
          const bases = pileup[i].split('\t')[4]; 
          if (cov >= covCutOff ){
            if ([1870, 2879, 9833].includes(pos)) {
                debugger; 

            } 
            cons[pos] = maxChar(bases.toUpperCase()); 
            calledBases = calledBases + 1 ; 
          }
      }
      console.log('Calculated consensus.');
      console.log(calledBases);
      return cons; 
  }

export function snpCount(consensus, refArray){

  let snpCount = 0; 
  for(var i = 0;i < consensus.length;i++){
    if (consensus[i] !== 'N'){
      if (consensus[i] !== refArray[i]) {
        snpCount = snpCount + 1 ; 
        console.log("SNP found");
        console.log(consensus[i]);
        console.log(refArray[i]);
        console.log(i);
      }
    }
  }
  return snpCount;   

}