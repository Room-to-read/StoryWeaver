import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Frame from 'react-frame-component';

import { keyCodes, fontUrls } from '../../lib/constants';
import ModalControlButton from '../ModalControlButton';

import './BookReader.scss';

class BookReader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
      cssBlob: ''
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);

    const iframeEl = ReactDOM.findDOMNode(this.iframeWrapperEl).querySelector('iframe');

    // Shitty cross-browser way of adding a keydown listener to an iframe's
    // document. On Firefox, you can't add the event until the iframe's "load"
    // event has fired, so you need to add the event inside the handler for the "load"
    // event. But, on IE and Safari you can't hook into the "load" event at all, so
    // now you have to do long polling on the iframe's document's readyState.
    const pollingTimeMs = 300;
    let timeElapsedMs = 0;
    const timer = setInterval(() => {
      // Clear the interval if, for some reason, the readyState never gets to
      // "complete".
      timeElapsedMs = timeElapsedMs + pollingTimeMs;
      if (timeElapsedMs >= pollingTimeMs * 20) {
        clearInterval(timer);
      }

      if (iframeEl.contentDocument.readyState === 'complete') {
        clearInterval(timer);
        iframeEl.contentDocument.addEventListener('keydown', this.onKeyDown);
      }
    }, pollingTimeMs);
  }

  componentWillMount() {
    fetch(this.props.cssHref)
      .then(response => response.blob())
      .then(imageBlob => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.setState({
          cssBlob: objectURL
        })
      });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cssHref !== nextProps.cssHref) {
      fetch(nextProps.cssHref)
        .then(response => response.blob())
        .then(imageBlob => {
          const objectURL = URL.createObjectURL(imageBlob);
          this.setState({
            cssBlob: objectURL
          })
        });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (e) => {
    if (e.keyCode === keyCodes.rightArrow) {
      this.nextPage();
    } else if (e.keyCode === keyCodes.leftArrow) {
      this.prevPage();
    } else if (e.keyCode === keyCodes.f) {
      this.onFullScreen();
    } else if (e.keyCode === keyCodes.esc) {
      e.stopPropagation();
      this.props.onClose();
    }
  };

  hasNextPage = () => {
    if (this.state.currentPage + 1 > this.props.pages.length) {
      return false;
    }

    return true;
  }

  nextPage = () => {
    // Track GA when user has clicked next Page and next page is going to be last Story Page
    if ( this.props.pages[this.state.currentPage].isLastStoryPage ) {
      const {
        offline,
        userEmail,
        book,
        recordBookReadCompleted } = this.props;
      recordBookReadCompleted({offline, userEmail, book});
    }

    if (this.hasNextPage()) {
      this.setState({
        currentPage: this.state.currentPage + 1
      });
    }
  }

  hasPrevPage = () => {
    if (this.state.currentPage - 1 < 1) {
      return false;
    }

    return true;
  }

  prevPage = () => {
    if (this.hasPrevPage()) {
      this.setState({
        currentPage: Math.max(0, this.state.currentPage - 1)
      });
    }
  }

  replaceImages = root => {
    if (!root) {
      return;
    }

    const imageEl = root.querySelector('.responsive_illustration');

    if (imageEl) {
      // TODO: pick the right image size and crop coordinate.

      fetch(imageEl.dataset.size7Src)
        .then(response => response.blob())
        .then(imageBlob => {
          const objectURL = URL.createObjectURL(imageBlob);
          imageEl.setAttribute('src', objectURL);
        });
    }

    const publisherLogoEl = root.querySelector('.publisher-logo');

    if (publisherLogoEl) {
      fetch(publisherLogoEl.dataset.size1Src)
        .then(response => response.blob())
        .then(imageBlob => {
          const objectURL = URL.createObjectURL(imageBlob);
          publisherLogoEl.setAttribute('src', objectURL);
        });
    }

    const bookLevelsEl = root.querySelector('.book-levels');

    if (bookLevelsEl) {
      fetch(bookLevelsEl.dataset.size1Src)
        .then(response => response.blob())
        .then(imageBlob => {
          const objectURL = URL.createObjectURL(imageBlob);
          bookLevelsEl.setAttribute('src', objectURL);
        });
    }
  }

  getFullScreenPropValue = (fullScreenProps, el) => {
    const elToTest = el || ReactDOM.findDOMNode(this.iframeWrapperEl);

    if (!elToTest) {
      return;
    }

    const availableFullScreenProp = fullScreenProps.find(p => p in elToTest);
    if (!availableFullScreenProp) {
      return;
    }

    return { val: elToTest[availableFullScreenProp], el: elToTest };
  }

  isReaderFullScreen = () => {
    const iframeEl = ReactDOM.findDOMNode(this.iframeWrapperEl);
    const { val } = this.getFullScreenPropValue([
      'fullscreenElement',
      'mozFullScreenElement',
      'msFullscreenElement',
      'webkitFullscreenElement',
    ], document);

    if (val && val === iframeEl) {
      return true;
    }

    return false;
  }

  enterFullScreen = () => {
    const { val, el } = this.getFullScreenPropValue([
      'requestFullscreen',
      'mozRequestFullScreen',
      'msRequestFullscreen',
      'webkitRequestFullscreen',
    ]);

    if (val) {
      val.bind(el)();
    }
  }

  exitFullScreen = () => {
    const { val, el } = this.getFullScreenPropValue([
      'exitFullscreen',
      'mozCancelFullScreen',
      'msExitFullscreen',
      'webkitExitFullscreen'
    ], document);

    if (val) {
      val.bind(el)();
    }
  }

  onFullScreen = () => {
    if (this.isReaderFullScreen()) {
      this.exitFullScreen();
    } else {
      this.enterFullScreen();
    }
  }

  render() {
    const { currentPage } = this.state;
    const {
      orientation,
      language,
      onClose,
      offline
    } = this.props;

    const {
      cssBlob
    } = this.state;

    const baseClassName = 'pb-book-reader';

    const mountTarget = 'story';

    const fontHref = fontUrls[language];
    const fontLink = fontHref ? `<link rel="stylesheet" type="text/css" href=${fontHref}>` : '';

    const initialContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_parent">
          ${fontLink}
        </head>
        <body>
          <div id="${mountTarget}"></div>
        </body>
      </html>
    `;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--${orientation}`]: orientation
    };

    const frameClasses = {
      [`${baseClassName}__frame`]: true,
      [`${baseClassName}__frame--no-pointer-events`]: offline,
    }

    return (
      <div
        className={classNames(classes)}
        ref={ref => this.iframeWrapperEl = ref}>
        <div
          className={`${baseClassName}__wrapper`}>
          <Frame
            className={classNames(frameClasses)}
            initialContent={initialContent}
            mountTarget={`#${mountTarget}`}
          >
            <link rel="stylesheet" type="text/css" href={cssBlob} />
            <div
              dangerouslySetInnerHTML={{__html: this.props.pages[currentPage - 1].html}}
              ref={ref => this.replaceImages(ref)}
            />
          </Frame>
          <div className={`${baseClassName}__control ${baseClassName}__control--close`}>
            <ModalControlButton icon="close" label="Close" onClick={onClose}/>
          </div>
          {
            this.hasPrevPage()
            ?
            <div className={`${baseClassName}__control ${baseClassName}__control--prev`}>
              <ModalControlButton icon="chevron-left" label="Previous" onClick={this.prevPage}/>
            </div>
            :
            null
          }
          {
            this.hasNextPage()
            ?
            <div className={`${baseClassName}__control ${baseClassName}__control--next`}>
              <ModalControlButton icon="chevron-right" label="Next" onClick={this.nextPage}/>
            </div>
            :
            null
          }
          <div className={`${baseClassName}__control ${baseClassName}__control--fullscreen`}>
            <ModalControlButton icon="fullscreen" label="Fullscreen" onClick={this.onFullScreen}/>
          </div>
        </div>
      </div>
    );
  }
}

BookReader.propTypes = {
  pages: PropTypes.array.isRequired,
  cssHref: PropTypes.string.isRequired,
  viewport: PropTypes.object.isRequired,
  orientation: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default BookReader;
