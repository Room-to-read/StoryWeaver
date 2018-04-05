import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './translateActions';

const initialState = {
  isFetchingBooks: false,
  isFetchingMore: false,
  isFetchingFilters: false,
  filters: {},
  appliedFilters: {
    level: [],
    category: [],
    publisher: []
  },
  books: [],
  metadata: {},
  sourceLanguage: 'English',
  targetLanguage: ''
};

export default handleActions({
  [actions.fetchBooks]: (state, action) => u({
    isFetchingBooks: true,
    books: []
  }, state),

  [actions.receiveBooks]: (state, action) => u({
    isFetchingBooks: false,
    books: action.payload.data,
    metadata: action.payload.metadata
  }, state),

  [actions.changeSourceLanguage]: (state, action) => u({
    sourceLanguage: action.payload.language
  }, state),

  [actions.changeTargetLanguage]: (state, action) => u({
    targetLanguage: action.payload.language
  }, state),

  [actions.fetchMore]: (state, action) => u({
    isFetchingMore: true
  }, state),

  [actions.receiveMore]: (state, action) => {
    const books = state.books.concat(action.payload.data)
    return u({
      isFetchingMore: false,
      books: books,
      metadata: action.payload.metadata
    }, state)
  },

  [actions.fetchFilters]: (state, action) => u({
    isFetchingFilters: true
  }, state),

  [actions.receiveFilters]: (state, action) => u({
    isFetchingFilters: false,
    filters: action.payload.data
  }, state),

  [actions.applyFilter]: (state, action) => {
    const newFilters = state.appliedFilters[action.payload.type].concat(action.payload.filter)
    return u({
      appliedFilters: {
        [action.payload.type]: newFilters
      }
    }, state)
  },

  [actions.removeFilter]: (state, action) => u({
    appliedFilters: {
      [action.payload.type]: u.reject(value => action.payload.filter === value)
    }
  }, state)

}, initialState);
