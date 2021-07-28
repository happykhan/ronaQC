  
const columns = [ 
    {
    Header: "Filename", accessor: "name",
    },
    {
    Header: "N50", accessor: "n50",
    },
    {
    Header: "Number of contigs", accessor: "noContigs",
    },
    {
      Header: "Total assembled bases", accessor: "totalBases",
      },
    {
      Header: "Rank", accessor: "rank",
      },      
      {
        Header: "Taxon", accessor: "taxon",
        },              
        {
          Header: "Status", accessor: "status",
          },                      
]; 

export default columns;