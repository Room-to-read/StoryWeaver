import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist'
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { Route, Switch } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import { Redirect } from 'react-router-dom'
import { I18n } from 'react-polyglot';

import locales from './i18n';
import { profileTypes, userAuthStages } from './lib/constants';
import { setupLoggly } from './lib/loggly';
import googleAnalyticsMiddleware from './redux/googleAnalyticsMiddleware';
import initGoogleAnalytics from './lib/googleAnalytics';

// Reducers
import allFiltersReducer from './redux/allFiltersReducer'
import profileReducer from './redux/profileReducer';
import viewportReducer from './redux/viewportReducer';
import userReducer from './redux/userReducer';
import newsletterReducer from './redux/newsletterReducer';
import readingListsReducer from './redux/readingListsReducer';
import translateReducer from './redux/translateReducer';
import notificationReducer from './redux/notificationReducer';
import bookReducer from './redux/bookReducer';
import offlineBooksReducer from './redux/offlineBooksReducer';
import homeReducer from './redux/homeReducer';
import allBooksReducer from './redux/allBooksReducer';
import networkReducer from './redux/networkReducer';
import allListsReducer from './redux/allListsReducer';
import allIllustrationsReducer from './redux/allIllustrationsReducer';
import illustrationReducer from './redux/illustrationReducer';
import imagesSearchReducer from './redux/imagesSearchReducer';
import listsSearchReducer from './redux/readingListsSearchReducer';
import peopleSearchReducer from './redux/peopleSearchReducer';
import offlineBookModalReducer from './redux/offlineBookModalReducer';
import userFeedbackModalReducer from './redux/userFeedbackModalReducer';

import { openAuthModal } from './redux/userActions'

// Containers for the routes
import ProfileContainer from './components/ProfileContainer';
import ReadingListContainer from './components/ReadingListContainer';
import TranslateContainer from './components/TranslateContainer';
import AllTranslateListingContainer from './components/AllTranslateListingContainer';
import BookContainer from './components/BookContainer';
import OfflineBooksContainer from './components/OfflineBooksContainer';
import MyListsContainer from './components/MyListsContainer';
import HomeContainer from './components/HomeContainer';
import AllBooksContainer from './components/AllBooksContainer';
import AllImagesContainer from './components/AllImagesContainer';
import AllListsContainer from './components/AllListsContainer';
import IllustrationContainer from './components/IllustrationContainer';
import EmailConfirmationContainer from './components/EmailConfirmationContainer';

// Main App component
import AppContainer from './components/AppContainer';

// Set up our redux store.
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const history = createHistory();

history.listen(location => window.scrollTo(0, 0))

const middleware = [thunk, routerMiddleware(history)];

// Load Google Analytics
if (process.env.REACT_APP_GA_PROPERTY_ID) {
  initGoogleAnalytics(process.env.REACT_APP_GA_PROPERTY_ID);
  middleware.push(googleAnalyticsMiddleware);
}

const store = createStore(
  combineReducers({
    router: routerReducer,
    viewport: viewportReducer,
    profile: profileReducer,
    user: userReducer,
    newsletter: newsletterReducer,
    readingLists: readingListsReducer,
    translate: translateReducer,
    notification: notificationReducer,
    book: bookReducer,
    offlineBooks: offlineBooksReducer,
    offlineBookModal: offlineBookModalReducer,
    home: homeReducer,
    allBooks: allBooksReducer,
    allFilters: allFiltersReducer,
    network: networkReducer,
    allLists: allListsReducer,
    images: imagesSearchReducer,
    listsSearch: listsSearchReducer,
    people: peopleSearchReducer,
    allImages: allIllustrationsReducer,
    illustration: illustrationReducer,
    userFeedbackModal: userFeedbackModalReducer
  }),
  composeEnhancers(
    applyMiddleware(...middleware),
    autoRehydrate()
  )
);

persistStore(store, {
  whitelist: ['offlineBooks', 'userFeedbackModal']
})

// Set up Loggly for development mode.
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_LOGGLY_KEY) {
  setupLoggly(process.env.REACT_APP_LOGGLY_KEY);
}

const RouteWithOfflineRedirect = ({ component: Component, render, ...rest }) => (
  <Route
    {...rest}
    render={
      window.navigator.onLine
        ? render ? render : props => <Component {...props} />
        : prop => <Redirect to="/offline" />
    }
  />
)


@connect(null, { openAuthModal })
class ResetPasswordRoute extends Component {
  componentDidMount() {
    const { match } = this.props
    this.props.openAuthModal({
      stage: userAuthStages.newPassword,
      resetPasswordToken: match.params.token
    })
  }
  render() {
    return <HomeContainer />
  }
}

// Set up locale
let ConnectedI18n = ({ children }) => {
  const locale = localStorage.getItem('locale') || 'en'
  const messages = locales[locale]
  return (
    <I18n locale={locale} messages={messages}>
      {children}
    </I18n>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedI18n>
      <ConnectedRouter history={history}>
        <Switch>
          <AppContainer>
            <RouteWithOfflineRedirect exact path="/" component={HomeContainer} />
            <RouteWithOfflineRedirect exact path="/users/:slug" render={props => <ProfileContainer {...props} profileType={profileTypes.USER} />} />
            <RouteWithOfflineRedirect exact path="/organisations/:slug" render={props =>  <ProfileContainer {...props} profileType={profileTypes.ORGANISATION} />} />
            <RouteWithOfflineRedirect exact path="/publishers/:slug" render={props => <ProfileContainer {...props} profileType={profileTypes.PUBLISHER} />} />
            <RouteWithOfflineRedirect exact path="/lists/:slug" component={ReadingListContainer} />
            <RouteWithOfflineRedirect exact path="/translate" component={TranslateContainer} />
            <RouteWithOfflineRedirect exact path="/translate/all" component={AllTranslateListingContainer} />
            <RouteWithOfflineRedirect exact path="/stories" component={AllBooksContainer} />
            <RouteWithOfflineRedirect exact path="/search" render={props => <AllBooksContainer {...props} isSearchVariant />} />
            <Route exact path="/stories/:slug" component={BookContainer} />
            <Route exact path="/offline" component={OfflineBooksContainer} />
            <Route exact path="/reset-password/:token" component={ResetPasswordRoute} />
            <Route exact path="/email-confirmation/:token" render={props => <EmailConfirmationContainer {...props}/>}/>
            <RouteWithOfflineRedirect exact path="/me/lists" component={MyListsContainer} />
            <RouteWithOfflineRedirect exact path="/illustrations" component={AllImagesContainer} />
            <RouteWithOfflineRedirect exact path="/illustrations/:slug" component={IllustrationContainer} />
            <RouteWithOfflineRedirect exact path="/lists" component={AllListsContainer} />
          </AppContainer>
        </Switch>
      </ConnectedRouter>
    </ConnectedI18n>
  </Provider>,
  document.getElementById('root')
);

if (('serviceWorker' in navigator) && process.env.REACT_APP_FEATURE_OFFLINE) {
  navigator.serviceWorker.register('/service-worker.js')
}
