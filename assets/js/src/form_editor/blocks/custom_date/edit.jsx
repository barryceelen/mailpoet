import React from 'react';
import moment from 'moment';
import {
  Panel,
  PanelBody,
  TextControl,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import PropTypes from 'prop-types';
import MailPoet from 'mailpoet';
import { useDispatch, useSelect } from '@wordpress/data';

import CustomFieldSettings from './custom_field_settings.jsx';
import FormFieldDate from '../../../form/fields/date.jsx';
import formatLabel from '../label_formatter.jsx';

const CustomDateEdit = ({ attributes, setAttributes }) => {
  const isSaving = useSelect(
    (sel) => sel('mailpoet-form-editor').getIsCustomFieldSaving(),
    []
  );
  const dateSettings = useSelect(
    (sel) => sel('mailpoet-form-editor').getDateSettingsData(),
    []
  );

  const { saveCustomField } = useDispatch('mailpoet-form-editor');
  const inspectorControls = (
    <InspectorControls>
      <Panel>
        <PanelBody title={MailPoet.I18n.t('customFieldSettings')} initialOpen>
          <CustomFieldSettings
            mandatory={attributes.mandatory}
            dateSettings={dateSettings}
            defaultToday={attributes.defaultToday}
            dateFormat={attributes.dateFormat}
            dateType={attributes.dateType}
            isSaving={isSaving}
            onSave={(params) => saveCustomField({
              customFieldId: attributes.customFieldId,
              data: {
                params: {
                  required: params.mandatory ? '1' : undefined,
                  date_type: params.dateType,
                  date_format: params.dateFormat,
                  is_default_today: params.defaultToday ? '1' : undefined,
                },
              },
              onFinish: () => setAttributes({
                mandatory: params.mandatory,
                dateType: params.dateType,
                dateFormat: params.dateFormat,
                defaultToday: params.defaultToday,
              }),
            })}
          />
        </PanelBody>
      </Panel>
      <Panel>
        <PanelBody title={MailPoet.I18n.t('formSettings')} initialOpen>
          <TextControl
            label={MailPoet.I18n.t('label')}
            value={attributes.label}
            data-automation-id="settings_custom_date_label_input"
            onChange={(label) => (setAttributes({ label }))}
          />
        </PanelBody>
      </Panel>
    </InspectorControls>
  );

  return (
    <>
      {inspectorControls}
      <label className="mailpoet_date_label mailpoet_custom_date" data-automation-id="editor_custom_date_label" htmlFor="custom_text">
        {formatLabel(attributes)}
        <br />
        <FormFieldDate
          field={{
            name: 'field',
            day_placeholder: MailPoet.I18n.t('customFieldDay'),
            month_placeholder: MailPoet.I18n.t('customFieldMonth'),
            year_placeholder: MailPoet.I18n.t('customFieldYear'),
            params: {
              date_type: attributes.dateType,
              date_format: attributes.dateFormat,
            },
          }}
          item={{
            field: attributes.defaultToday ? moment().format('YYYY-MM-DD') : '',
          }}
          onValueChange={() => {}}
        />
      </label>
    </>
  );
};

CustomDateEdit.propTypes = {
  attributes: PropTypes.shape({
    label: PropTypes.string.isRequired,
    dateFormat: PropTypes.string.isRequired,
    dateType: PropTypes.string.isRequired,
    defaultToday: PropTypes.bool,
    mandatory: PropTypes.bool.isRequired,
  }).isRequired,
  setAttributes: PropTypes.func.isRequired,
};

export default CustomDateEdit;
