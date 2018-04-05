import {
  createAsyncActions,
  runAsyncWorkflow
} from '../lib/reduxHelpers';
import { createActions } from "redux-actions";
import { Home } from '../api';

export const POPUP_OPENED = 'POPUP_OPENED'
export const BOOK_READ = 'BOOK_READ'
export const CATEGORY_CARD_OPENED = 'CATEGORY_CARD_OPENED'

export const [
  fetchHome,
  receiveHome,
  fetchHomeError
] = createAsyncActions(
  'HOME',
  () => {},
  ({ ok, data }) => ({ ok, data })
);

export const fetchHomeWorkflow = () => {
  const fetchPromise = Home.fetch();
  
  return runAsyncWorkflow({
    fetch: fetchHome,
    receive: receiveHome,
    error: fetchHomeError
  }, fetchPromise);
};

export const [
  fetchRecommendations,
  receiveRecommendations,
  fetchRecommendationsError
] = createAsyncActions(
  'RECOMMENDATIONS',
  () => {},
  ({ ok, data }) => ({ ok, data })
);

export const fetchRecommendationsWorkflow = () => {
  const fetchPromise = Home.fetchRecommendations();

  return runAsyncWorkflow({
    fetch: fetchRecommendations,
    receive: receiveRecommendations,
    error: fetchRecommendationsError
  }, fetchPromise)
};

export const [
  fetchCategories,
  receiveCategories,
  fetchCategoriesError
] = createAsyncActions(
  'CATEGORY',
  () => {},
  ({ data }) => ({  categories: data })
);

export const fetchCategoriesWorkflow = () => {
  const fetchPromise = Home.fetchCategories();

  return runAsyncWorkflow({
    fetch: fetchCategories,
    receive: receiveCategories,
    error: fetchCategoriesError
  }, fetchPromise);
}

export const [
  fetchBannerImages,
  receiveBannerImages,
  fetchBannerImagesError
] = createAsyncActions(
  'BANNER_IMAGES',
  () => {},
  ({ data }) => ({  data })
);

export const fetchBannerImagesWorkflow = () => {
  const fetchPromise = Home.fetchBannerImages();

  return runAsyncWorkflow({
    fetch: fetchBannerImages,
    receive: receiveBannerImages,
    error: fetchBannerImagesError
  }, fetchPromise);
}

export const [
  fetchStoryNotice,
  receiveStoryNotice,
  fetchStoryNoticeError
] = createAsyncActions(
  'StoryNotice',
  () => {},
  () => {}
);

export const submitStoryNotice = () => {
  const fetchPromise = Home.updateSubmitStoryNotice();
  
  return runAsyncWorkflow({
    fetch: fetchStoryNotice,
    receive: receiveStoryNotice,
    error: fetchStoryNoticeError
  }, fetchPromise);
}

export const { popupOpened } = createActions('POPUP_OPENED');
export const { bookRead } = createActions('BOOK_READ');
