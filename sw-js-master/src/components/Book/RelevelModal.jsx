import React from 'react';
import { translate } from 'react-polyglot';

import ButtonGroup from '../ButtonGroup';
import Button from '../Button';
import Modal from '../Modal';
import SelectField from '../SelectField';


const RelevelModal = ({ isVisible, onCloseClicked, t, viewport }) => {
  if (!isVisible) {
    return null;
  }

  const header = <h2>{t('Book.re-level')}</h2>;
  const footer = (
    <ButtonGroup mergeTop mergeBottom={!viewport.large} mergeSides>
      <Button label={t('global.close')} onClick={onCloseClicked} />
      <Button label={t('Book.re-level')} variant="primary" />
    </ButtonGroup>
  );

  return (
    <Modal header={header} footer={footer} onClose={onCloseClicked}>
      <p>Please choose a reading level. We allow you to alter the reading level just before publishing your story!</p>
      <SelectField name="reading-level" label={t('Book.reading-level')} />
    </Modal>
  );
};

export default translate()(RelevelModal);
