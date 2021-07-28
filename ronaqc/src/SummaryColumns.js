  
const columns = [ 
    {
    Header: "Filename", accessor: "name",
    },
    {
        Header: "Called bases", accessor: "genomeRecovery",
    },
    {
    Header: "Low coverage amplicons", accessor: "missingAmplicons",
    }

]; 

export default columns;