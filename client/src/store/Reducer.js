const Reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null
      }
    case 'SET_POST_TYPE':
      return {
        ...state,
        postType: action.payload
      }
    default:
      return state
  }
}

export default Reducer;
