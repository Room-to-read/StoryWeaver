import React from 'react';
import { translate } from 'react-polyglot';

import Modal from '../Modal';
import BookReader from '../BookReader';

const BookReaderModal = ({ onCloseClicked, assets, t, viewport, offline, userEmail, book, recordBookReadCompleted }) => {
  return (
    <Modal
      noContentPadding
      noDimensionRestrictions>
      <BookReader
        pages={assets.pages}
        cssHref={assets.css}
        viewport={viewport}
        orientation={assets.orientation}
        onClose={onCloseClicked}
        language={assets.language}
        offline={offline}
        userEmail={userEmail}
        book={book}
        recordBookReadCompleted={recordBookReadCompleted}
      />
    </Modal>
  );
};

export default translate()(BookReaderModal);
