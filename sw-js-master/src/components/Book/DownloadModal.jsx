import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import Modal from '../Modal';
import Button from '../Button';
import './DownloadModal.scss';

class DownloadModal extends Component {
  
  render(){
    const baseClassName = 'pb-download-modal';
    const { isVisible, onCloseClicked, onFormLinkClicked, t } = this.props;

    if (!isVisible) {
      return null;
    }

    const footer = (
      <Button
        fullWidth
        label={t('DownloadModal.popup-footer')}
        variant="primary"
        onClick={onFormLinkClicked}
      />
    );

    return (
      <Modal footer={footer} onClose={onCloseClicked}>
        <h2 className={`${baseClassName}__title`}>{t('DownloadModal.link')}</h2>
        <p>{t('DownloadModal.popup')}</p>
        <p>{t('DownloadModal.popup-1')}</p>
      </Modal>
    );
  }
};

export default translate()(DownloadModal);
