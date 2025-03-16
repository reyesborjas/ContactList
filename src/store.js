export const initialStore = () => {
  return {
    contacts: [],
    agendas: [],
    selectedAgenda: null,
    error: null
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type) {
    case 'SET_CONTACTS':
      return {
        ...store,
        contacts: action.payload
      };
    case 'SET_AGENDAS':
      return {
        ...store,
        agendas: action.payload
      };
    case 'SET_SELECTED_AGENDA':
      return {
        ...store,
        selectedAgenda: action.payload
      };
    case 'ADD_CONTACT':
      return {
        ...store,
        contacts: [...store.contacts, action.payload]
      };
    case 'UPDATE_CONTACT':
      return {
        ...store,
        contacts: store.contacts.map(contact => 
          contact.id === action.payload.id ? action.payload : contact
        )
      };
    case 'DELETE_CONTACT':
      return {
        ...store,
        contacts: store.contacts.filter(contact => contact.id !== action.payload)
      };
    case 'SET_ERROR':
      return {
        ...store,
        error: action.payload
      };
    default:
      return store;
  }
}