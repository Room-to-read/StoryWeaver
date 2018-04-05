import { createActions } from "redux-actions";
import {
  createAsyncActions,
  runAsyncWorkflow
} from "../lib/reduxHelpers";

import { Translation } from "../api";
import { pagination } from "../lib/constants";

export const [
  fetchFilters,
  receiveFilters,
  fetchFiltersError
] = createAsyncActions(
  'FILTERS_FOR_TRANSLATE',
  () => {},
  ({ ok, data, sortOptions }) => ({ data, sortOptions })
);

export const fetchFiltersWorkflow = () => {
  const fetchPromise = Translation.fetchFilters();

  return runAsyncWorkflow(
    {
      fetch: fetchFilters,
      receive: receiveFilters,
      error: fetchFiltersError
    },
    fetchPromise
  );
};

export const [
  fetchBooks,
  receiveBooks,
  fetchBooksError
] = createAsyncActions(
  'BOOKS_FOR_TRANSLATE',
  (sourceLanguage, targetLanguage) => ({ sourceLanguage, targetLanguage }),
  ({ data, metadata }) => ({ data, metadata })
);

export const fetchBooksWorkflow = (sourceLanguage, targetLanguage, filters, page, perPage = pagination.bookTranslations) => {
  const fetchPromise = Translation.fetchBooks(sourceLanguage, targetLanguage, filters, page, perPage);

  return runAsyncWorkflow(
    {
      fetch: fetchBooks,
      receive: receiveBooks,
      error: fetchBooksWorkflow
    },
    fetchPromise,
    {
      sourceLanguage,
      targetLanguage
    }
  );
};

export const { changeSourceLanguage, changeTargetLanguage } = createActions({
  'CHANGE_SOURCE_LANGUAGE': language => ({ language }),
  'CHANGE_TARGET_LANGUAGE': language => ({ language })
})

export const [
  fetchMore,
  receiveMore,
  fetchMoreError
] = createAsyncActions(
  'MORE_BOOKS_FOR_TRANSLATE',
  ({ page }) => ({ page }),
  ({ data, metadata }) => ({ data, metadata })
);

export const loadMoreWorkflow = (sourceLanguage, targetLanguage, filters, page, perPage = pagination.bookTranslations) => {
  const fetchPromise = Translation.fetchBooks(sourceLanguage, targetLanguage, filters, page, perPage);

  return runAsyncWorkflow(
    {
      fetch: fetchMore,
      receive: receiveMore,
      error: fetchMoreError
    },
    fetchPromise,
    {
      sourceLanguage,
      targetLanguage,
      page
    }
  );
}

export const { applyFilter, removeFilter } = createActions({
  'APPLY_FILTER': (type, filter) => ({ type, filter }),
  'REMOVE_FILTER': (type, filter) => ({ type, filter })
})
