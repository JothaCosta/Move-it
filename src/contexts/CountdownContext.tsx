import {createContext, ReactNode, useContext, useEffect, useState} from 'react' 
import { ChallengesContexts } from './ChallengesContexts'


interface CountdownContextData{
  minutes: number;
  seconds:number;
  hasFinished: boolean;
  isActive: boolean;
  resetCountdown:() => void;
  startCountdown:() => void;
}


interface CountdownProviderProps{
  children:ReactNode
}

export const CountdownContext = createContext({} as CountdownContextData)

let countdownTimeout: NodeJS.Timeout;

export function CountdownProvider({children}: CountdownProviderProps){

    
  const {startNewChallenge} = useContext(ChallengesContexts)

  const [time, setTime] = useState(25*60)
  const [isActive, setIsActive] = useState(false)
  const [hasFinished, setHasFinished] = useState(false)

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  function resetCountdown(){
    clearTimeout(countdownTimeout)
    setIsActive(false)
    setTime(25 * 60)
    setHasFinished(false)
  }

  function startCountdown(){
    setIsActive(true)
  }

  useEffect(() => {
    if(isActive && time > 0){
      countdownTimeout = setTimeout(() =>{
          setTime(time - 1)
      },1000) 
    } else if (isActive && time === 0){
      setHasFinished(true)
      setIsActive(false)
      startNewChallenge()
    }
  },[isActive ,time])

  return (
    <CountdownContext.Provider
      value={{
        minutes,
        seconds,
        hasFinished,
        isActive,
        resetCountdown,
        startCountdown,
      }}
      >
        {children}
    </CountdownContext.Provider>
  )
}