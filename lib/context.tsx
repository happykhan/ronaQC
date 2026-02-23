'use client'

import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'
import type {
  NegativeControl,
  NegativeControlAction,
  Sample,
  SampleAction,
} from './types'

// ─── Negative Control Reducer ───

function negativeControlReducer(
  state: NegativeControl,
  action: NegativeControlAction
): NegativeControl {
  switch (action.type) {
    case 'ADD_CONTROL':
      return { file: action.file, name: action.name }
    case 'REMOVE_CONTROL':
      return {}
    case 'ADD_COVERAGE':
      return { ...state, coverage: action.coverage }
    case 'ADD_GEN_RECOVERY':
      return { ...state, genomeRecovery: action.genomeRecovery }
    case 'ADD_SNP_COUNT':
      return { ...state, snpCount: action.snpCount }
    case 'ADD_AMPLICONS':
      return {
        ...state,
        amplicons: action.amplicons,
        ampLabels: action.ampLabels,
        detectedAmplicons: action.detectedAmplicons,
      }
    case 'ADD_PROPER_MAPPED_READS':
      return { ...state, properReads: action.properReads }
    case 'ADD_MAPPED_READS':
      return { ...state, onefoureight: action.onefoureight }
    case 'ADD_TOTAL_READS':
      return { ...state, totalReads: action.totalReads }
    case 'FINISH_NC':
      return { ...state, comments: action.comments }
    default:
      return state
  }
}

// ─── Sample Reducer ───

function sampleReducer(state: Sample[], action: SampleAction): Sample[] {
  switch (action.type) {
    case 'ADD_SAMPLE': {
      const exists = state.findIndex((s) => s.name === action.name)
      if (exists === -1) {
        return [...state, { name: action.name, file: action.file }]
      }
      return state
    }
    case 'REMOVE_SAMPLE':
      return state.filter((s) => s.name !== action.name)
    case 'EDIT_SAMPLE':
      return state.map((s) =>
        s.name === action.name ? { ...s, ...action.updates } : s
      )
    default:
      return state
  }
}

// ─── Contexts ───

interface NegativeControlContextValue {
  negativeControl: NegativeControl
  dispatch: Dispatch<NegativeControlAction>
}

interface SampleContextValue {
  samples: Sample[]
  sampleDispatch: Dispatch<SampleAction>
}

const NegativeControlContext = createContext<NegativeControlContextValue | null>(null)
const SampleContext = createContext<SampleContextValue | null>(null)

// ─── Hooks ───

export function useNegativeControl() {
  const ctx = useContext(NegativeControlContext)
  if (!ctx) throw new Error('useNegativeControl must be used within AppProviders')
  return ctx
}

export function useSamples() {
  const ctx = useContext(SampleContext)
  if (!ctx) throw new Error('useSamples must be used within AppProviders')
  return ctx
}

// ─── Provider ───

export function AppProviders({ children }: { children: ReactNode }) {
  const [negativeControl, dispatch] = useReducer(negativeControlReducer, {})
  const [samples, sampleDispatch] = useReducer(sampleReducer, [])

  return (
    <NegativeControlContext.Provider value={{ negativeControl, dispatch }}>
      <SampleContext.Provider value={{ samples, sampleDispatch }}>
        {children}
      </SampleContext.Provider>
    </NegativeControlContext.Provider>
  )
}

// Export reducers for testing
export { negativeControlReducer, sampleReducer }
