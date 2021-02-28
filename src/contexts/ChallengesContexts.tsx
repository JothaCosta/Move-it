import {createContext, useState, ReactNode, useEffect} from 'react'
import challengs from '../../challenges.json'

import Cookies from 'js-cookie'
import { LevelUpModal } from '../components/LevelUpModal'

interface Challenge{
  type:'body' | 'eye';
  description:string;
  amount: number
}

interface ChallengesProviderProps{
  children: ReactNode
  level:number;
  currentExperience:number;
  challengesCompleted:number;
}

interface ChallengeContextsData{
  level:number;
  currentExperience:number;
  challengesCompleted:number;
  activeChallenge:Challenge;
  experienceToNextLevel: number;
  levelUp:() => void;
  startNewChallenge:() => void;
  resetChallenge:() => void; 
  completeChallenge:() => void;
  closeLevelUpModal:() => void
}

export const ChallengesContexts  = createContext({} as ChallengeContextsData)

export function ChallengesProvider({
  children,  
  ...rest
}:ChallengesProviderProps){

  const [level, setLevel] = useState(rest.level ?? 1)
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0)
  const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0)

  const [activeChallenge, setActiveChallenge] = useState(null)
  const[isLevelUpModalOpen, setisLevelUpModalOpen] =useState(false)

  const experienceToNextLevel = Math.pow((level + 1) * 4,2)

  useEffect(() => {
    Notification.requestPermission();
  },[])

  useEffect(() => {
    Cookies.set('level', String(level));
    Cookies.set('currentExperience', String(currentExperience));
    Cookies.set('challengesCompleted', String(challengesCompleted));
  },[level, currentExperience, challengesCompleted])

  function levelUp(){
    setLevel(level + 1)
    setisLevelUpModalOpen(true)
  }

  function closeLevelUpModal(){
    setisLevelUpModalOpen(false)
  }

  function startNewChallenge(){
    const randomChallengeIndex = Math.floor(Math.random() * challengs.length)

    const challenge = challengs[randomChallengeIndex]

    setActiveChallenge(challenge)

    new Audio('/notification.mp3').play()

    if(Notification.permission === 'granted') {
      new Notification('Novo Desafio',{
        body: `Valendo ${challenge.amount} xp!`
      })
    }
  }

  function resetChallenge(){
    setActiveChallenge(null)
  }

  function completeChallenge(){
    if(!activeChallenge){
      return;
    }

    const {amount} = activeChallenge

    let finalExperiece = currentExperience + amount

    if(finalExperiece >= experienceToNextLevel) {
      finalExperiece = finalExperiece - experienceToNextLevel      
      levelUp()
    }

    setCurrentExperience(finalExperiece)
    setActiveChallenge(null)
    setChallengesCompleted(challengesCompleted + 1)
  }

  return(
    <ChallengesContexts.Provider 
      value={{
        level, 
        currentExperience,
        challengesCompleted,
        activeChallenge,
        experienceToNextLevel,
        levelUp,
        startNewChallenge,
        resetChallenge,
        completeChallenge,
        closeLevelUpModal
      }}
    >   
        {children}

        {isLevelUpModalOpen && <LevelUpModal/>}
    </ChallengesContexts.Provider>
  )
}
