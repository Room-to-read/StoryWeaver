import {
  createAsyncActions,
  runAsyncWorkflow
} from '../lib/reduxHelpers';

import { Illustration } from '../api';

export const [
  fetchIllustration,
  receiveIllustration,
  fetchIllustrationError
] = createAsyncActions(
  'ILLUSTRATION',
  slug => ({ slug }),
  ({ data }) => ({ illustration: data })
);

export const fetchIllustrationWorkflow = slug => {
  const fetchPromise = Illustration.fetch(slug);

  return runAsyncWorkflow({
    fetch: fetchIllustration,
    receive: receiveIllustration,
    error: fetchIllustrationError
  }, fetchPromise);
};

export const [
  likeIllustration,
  receiveLikeIllustration,
  likeIllustrationError
] = createAsyncActions(
  'LIKE_ILLUSTRATION',
  ({ slug }) => ({ slug })
);

export const likeIllustrationWorkflow = (slug) => {
  const likeIllustrationPromise = Illustration.like(slug);

  return runAsyncWorkflow(
    {
      fetch: likeIllustration,
      receive: receiveLikeIllustration,
      error: likeIllustrationError
    },
    likeIllustrationPromise
  );
};


export const [
  postFlagIllustration,
  receivePostFlagIllustration,
  postFlagIllustrationError
] = createAsyncActions(
  'FLAG_ILLUSTRATION',
  ({ slug, reasons }) => ({ slug, reasons })
);

export const postFlagIllustrationWorkflow = (slug, reasons) => {
  const fetchPromise = Illustration.flag(slug, reasons);

  return runAsyncWorkflow(
    {
      fetch: postFlagIllustration,
      receive: receivePostFlagIllustration,
      error: postFlagIllustrationError
    },
    fetchPromise,
    { slug, reasons }
  );
};

export const [
  fetchIllustrationFormData,
  receiveIllustrationFormData,
  fetchIllustrationFormDataError
] = createAsyncActions(
  'NEW_ILLUSTRATION_FORM_DATA',
  () => {},
  ({ data }) => ({ data })
);

export const fetchNewIllustrationFormDataWorkflow = () => {
  const fetchPromise = Illustration.fetchNewFormData();

  return runAsyncWorkflow({
    fetch: fetchIllustrationFormData,
    receive: receiveIllustrationFormData,
    error: fetchIllustrationFormDataError
  }, fetchPromise);
};

export const [
  uploadIllustration,
  receiveUploadIllustration,
  uploadIllustrationError
] = createAsyncActions(
  'UPLOAD_ILLUSTRATION',
  ({formData }) => ({ formData })
);

export const uploadIllustrationWorkflow = (formData) => {
  const fetchPromise = Illustration.upload(formData);

  return runAsyncWorkflow(
    {
      fetch: uploadIllustration,
      receive: receiveUploadIllustration,
      error: uploadIllustrationError
    },
    fetchPromise,
    { formData }
  );
};

export const [
  fetchAutoCompleteTag,
  receiveAutoCompleteTag,
  fetchAutoCompleteTagError
] = createAsyncActions(
  'AUTOCOMPLETE_TAG',
  () => {},
  ({ data }) => ({ data: data })
);

export const autocompleteTagsWorkflow = (searchValue) => {
  const fetchPromise = Illustration.tagsAutocomplete(searchValue)

  return runAsyncWorkflow({
    fetch: fetchAutoCompleteTag,
    receive: receiveAutoCompleteTag,
    error: fetchAutoCompleteTagError
  }, fetchPromise)
}


export const [
  fetchAutoCompleteIllustrators,
  receiveAutoCompleteIllustrators,
  fetchAutoCompleteIllustratorsError
] = createAsyncActions(
  'AUTOCOMPLETE_ILLUSTRATORS',
  () => {},
  ({ data }) => ({ data: data })
);

export const autocompleteIllustratorsWorkflow = (searchValue) => {
  const fetchPromise = Illustration.illustratorsAutocomplete(searchValue)

  return runAsyncWorkflow({
    fetch: fetchAutoCompleteIllustrators,
    receive: receiveAutoCompleteIllustrators,
    error: fetchAutoCompleteIllustratorsError
  }, fetchPromise)
}