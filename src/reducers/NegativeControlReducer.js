const negativeControlReducer = (state, action) => {
  switch (action.type) {
    case "ADD_CONTROL":
      return { file: action.file, name: action.name };
    case "REMOVE_CONTROL":
      return {};
    case "ADD_COVERAGE":
      return { ...state, coverage: action.coverage };
    case "ADD_GEN_RECOVERY":
      return { ...state, genomeRecovery: action.genomeRecovery };
    case "ADD_SNP_COUNT":
      return { ...state, snpCount: action.snpCount };
    case "ADD_AMPLICONS":
      return { ...state, amplicons: action.amplicons };
    case "ADD_PROPER_MAPPED_READS":
      return { ...state, properReads: action.properReads };
    case "ADD_MAPPED_READS":
      return { ...state, onefoureight: action.onefoureight };
    default:
      return state;
  }
};

export { negativeControlReducer as default };
