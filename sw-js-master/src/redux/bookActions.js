import { createAction } from 'redux-actions';
import {
  createAsyncActions,
  runAsyncWorkflow
} from '../lib/reduxHelpers';

import { Book } from '../api';


export const [
  fetchBook,
  receiveBook,
  fetchBookError
] = createAsyncActions(
  'BOOK',
  slug => ({ slug }),
  ({ data }) => ({ book: data })
);

export const fetchBookWorkflow = slug => {
  const fetchPromise = Book.fetch(slug);

  return runAsyncWorkflow({
    fetch: fetchBook,
    receive: receiveBook,
    error: fetchBookError
  }, fetchPromise);
};


export const [
  addToList,
  receiveAddToList,
  addToListError
] = createAsyncActions(
  'ADD_BOOK_TO_LIST',
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug }),
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug })
);

export const addBookToListWorkflow = (bookSlug, listSlug) => {
  const fetchPromise = Book.addToList(bookSlug, listSlug);

  return runAsyncWorkflow(
    {
      fetch: addToList,
      receive: receiveAddToList,
      error: addToListError
    },
    fetchPromise,
    { bookSlug, listSlug }
  );
};

export const [
  addToBookshelf,
  receiveAddToBookshelf,
  addToBookshelfError
] = createAsyncActions(
  'ADD_BOOK_TO_BOOKSHELF',
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug }),
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug })
);

export const addBookToBookshelfWorkflow = (bookSlug, listSlug) => {
  const fetchPromise = Book.addToList(bookSlug, listSlug);

  return runAsyncWorkflow(
    {
      fetch: addToBookshelf,
      receive: receiveAddToBookshelf,
      error: addToBookshelfError
    },
    fetchPromise,
    { bookSlug, listSlug }
  );
};


export const [
  removeFromList,
  receiveRemoveFromList,
  removeFromListError
] = createAsyncActions(
  'REMOVE_BOOK_FROM_LIST',
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug }),
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug })
);

export const removeBookFromListWorkflow = (bookSlug, listSlug) => {
  const fetchPromise = Book.removeFromList(bookSlug, listSlug);

  return runAsyncWorkflow(
    {
      fetch: removeFromList,
      receive: receiveRemoveFromList,
      error: removeFromListError
    },
    fetchPromise,
    { bookSlug, listSlug }
  );
};


export const [
  removeFromBookshelf,
  receiveRemoveFromBookshelf,
  removeFromBookshelfError
] = createAsyncActions(
  'REMOVE_BOOK_FROM_BOOKSHELF',
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug }),
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug })
);

export const removeBookFromBookshelfWorkflow = (bookSlug, listSlug) => {
  const fetchPromise = Book.removeFromList(bookSlug, listSlug);

  return runAsyncWorkflow(
    {
      fetch: removeFromBookshelf,
      receive: receiveRemoveFromBookshelf,
      error: removeFromBookshelfError
    },
    fetchPromise,
    { bookSlug, listSlug }
  );
};


export const [
  postFlagBook,
  receivePostFlagBook,
  postFlagBookError
] = createAsyncActions(
  'FLAG_BOOK',
  ({ bookSlug, reasons }) => ({ bookSlug, reasons }),
  ({ bookSlug }) => ({ bookSlug })
);

export const postFlagBookWorkflow = (bookSlug, reasons) => {
  const fetchPromise = Book.flag(bookSlug, reasons);

  return runAsyncWorkflow(
    {
      fetch: postFlagBook,
      receive: receivePostFlagBook,
      error: postFlagBookError
    },
    fetchPromise,
    { bookSlug, reasons }
  );
};


export const [
  postRelevel,
  receivePostRelevel,
  postRelevelError
] = createAsyncActions(
  'RELEVEL',
  ({ bookSlug, newLevel }) => ({ bookSlug, newLevel })
);

export const postRelevelWorkflow = (bookSlug, newLevel) => {
  const fetchPromise = Book.relevel(bookSlug, newLevel);

  return runAsyncWorkflow(
    {
      fetch: postRelevel,
      receive: receivePostRelevel,
      error: postRelevelError
    },
    fetchPromise,
    { bookSlug, newLevel }
  );
};


export const [
  fetchBookAssets,
  receiveBookAssets,
  receiveBookAssetsError
] = createAsyncActions(
  'BOOK_ASSETS',
  ({ slug }) => ({ slug }),
  ({ data }) => ({ assets: data })
);

export const fetchBookAssetsWorkflow = slug => {
  const fetchPromise = Book.fetchAssets(slug);

  return runAsyncWorkflow(
    {
      fetch: fetchBookAssets,
      receive: receiveBookAssets,
      error: fetchBookError
    },
    fetchPromise,
    { slug }
  );
};


export const [
  addToEditorsPicks,
  receiveAddToEditorsPicks,
  addToEditorsPicksError
] = createAsyncActions(
  'ADD_TO_EDITORS_PICKS',
  ({ slug }) => ({ slug })
);

export const addToEditorsPicksWorkflow = (slug) => {
  const addToEditorsPicksPromise = Book.addToEditorsPicks(slug);

  return runAsyncWorkflow(
    {
      fetch: addToEditorsPicks,
      receive: receiveAddToEditorsPicks,
      error: addToEditorsPicksError
    },
    addToEditorsPicksPromise
  );
};


export const [
  removeFromEditorsPicks,
  receiveRemoveFromEditorsPicks,
  removeFromEditorsPicksError
] = createAsyncActions(
  'REMOVE_FROM_EDITORS_PICKS',
  ({ slug }) => ({ slug })
);

export const removeFromEditorsPicksWorkflow = (slug) => {
  const removeFromEditorsPicksPromise = Book.removeFromEditorsPicks(slug);

  return runAsyncWorkflow(
    {
      fetch: removeFromEditorsPicks,
      receive: receiveRemoveFromEditorsPicks,
      error: removeFromEditorsPicksError
    },
    removeFromEditorsPicksPromise
  );
};


export const [
  likeBook,
  receiveLikeBook,
  likeBookError
] = createAsyncActions(
  'LIKE_BOOK',
  ({ slug }) => ({ slug })
);

export const likeBookWorkflow = (slug) => {
  const likeBookPromise = Book.like(slug);

  return runAsyncWorkflow(
    {
      fetch: likeBook,
      receive: receiveLikeBook,
      error: likeBookError
    },
    likeBookPromise
  );
};


export const openGlobalBookReader = createAction('sw/OPEN_GLOBAL_BOOK_READER');
export const closeGlobalBookReader = createAction('sw/CLOSE_GLOBAL_BOOK_READER');
export const openGlobalQuickView = createAction(
  'sw/OPEN_GLOBAL_QUICK_VIEW',
  book => ({ book })
);
export const closeGlobalQuickView = createAction('sw/CLOSE_GLOBAL_QUICK_VIEW');
