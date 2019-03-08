/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export {default as Navbar} from './navbar'
export {Login, Signup} from './auth-form'
export {ReCaptchaComponent} from './ReCaptcha'
export {default as SetCockatriceName} from './SetCockatriceName'
export {default as ErrorList} from './ErrorList'
export {default as NavFormats} from './NavFormats'
export {default as FormatSelect} from './FormatSelect'
export {default as ConfirmAction} from './ConfirmAction'
export {default as HomePage} from './HomePage'
export {default as ProfileAnchor} from './ProfileAnchor'

export {default as AdminTools} from './AdminComponents/AdminTools'
export {default as EditUserRoles} from './AdminComponents/EditUserRoles'

export {default as UserPage} from './ProfileComponents/UserPage'
export {default as MiniHistory} from './ProfileComponents/MiniHistory'
export {default as ClosedMiniView} from './ProfileComponents/ClosedMiniView'

export {default as DecksMenu} from './DeckComponents/DecksMenu'
export {default as SingleDeckView} from './DeckComponents/SingleDeckView'
export {AddDeckForm, EditDeckForm} from './DeckComponents/DeckForms'
export {default as DecksList} from './DeckComponents/DecksList'
export {default as DeckItem} from './DeckComponents/DeckItem'
export {default as DecksList_SingleDeck} from './DeckComponents/DeckItem'
export {default as DeleteDeck} from './DeckComponents/DeleteDeck'
export {default as DeckPreview} from './DeckComponents/DeckPreview'

export {default as LobbyMenu} from './LobbyComponents/LobbyMenu'
export {default as NewMiniForm} from './LobbyComponents/NewMiniForm'
export {default as MiniWindowView} from './LobbyComponents/MiniWindowView'
export {default as MiniList} from './LobbyComponents/MiniList'
export {default as LobbyJudgePanel} from './LobbyComponents/LobbyJudgePanel'
export {default as MiniJudgePanel} from './LobbyComponents/MiniJudgePanel'
export {default as SingleMiniView} from './LobbyComponents/SingleMiniView'
export {default as JoinMiniForm} from './LobbyComponents/JoinMiniForm'
export {default as MatchResultForm} from './LobbyComponents/MatchResultForm'
export {default as PairingsList} from './LobbyComponents/PairingsList'
export {default as PairingItem} from './LobbyComponents/PairingItem'
export {default as JudgeResultForm} from './LobbyComponents/JudgeResultForm'
