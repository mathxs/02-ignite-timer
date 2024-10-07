import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { Cycle, CyclesReducer } from '../reducer/cycles/reducer'
import {
  createNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentAsFinishedAction,
} from '../reducer/cycles/actions'
import { differenceInSeconds } from 'date-fns'

interface CreateNewCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextData {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number

  markCurrentAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateNewCycleData) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextData)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const [cyclesState, dispatch] = useReducer(
    CyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const stateJson = localStorage.getItem('@ignite-timer:cyclesState-1.0.0')
      if (!stateJson) {
        return {
          cycles: [],
          activeCycleId: null,
        }
      }
      return JSON.parse(stateJson)
    },
  )
  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    const secondsDifference = differenceInSeconds(
      new Date(),
      cyclesState.cycles.find((cycle) => cycle.id === cyclesState.activeCycleId)
        ?.startDate ?? new Date(),
    )
    if (secondsDifference >= 0) {
      return secondsDifference
    }
    return 0
  })

  useEffect(() => {
    const stateJson = JSON.stringify(cyclesState)
    localStorage.setItem('@ignite-timer:cyclesState-1.0.0', stateJson)
  }, [cyclesState])

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentAsFinished() {
    dispatch(markCurrentAsFinishedAction())
  }

  function createNewCycle(data: CreateNewCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    dispatch(createNewCycleAction(newCycle))
    // setActiveCycleId(newCycle.id)
    setAmountSecondsPassed(0)
    // reset()
  }

  function interruptCurrentCycle() {
    // setActiveCycleId(null)
    dispatch(interruptCurrentCycleAction())
    setAmountSecondsPassed(0)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
