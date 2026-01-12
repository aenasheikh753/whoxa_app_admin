import React from 'react';
import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import type { ConfigData } from '../../services/configService';

interface SMSSettingsProps {
  data: ConfigData;
  onChange: (field: keyof ConfigData, value: any) => void;
}

export const SMSSettings: React.FC<SMSSettingsProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-extrabold text-table-header-text mb-6">SMS Configuration</h3>

      <div className="grid grid-cols-1 gap-6 border-1 border-table-divider p-4 rounded-lg">
        <div>
          <div className='w-full flex justify-between items-center mb-6'>

            <div className='text-md font-bold text-table-header-text '>
              Twilio Settings
            </div>
            <Toggle
              id="is_twilio_enabled"
              checked={data.is_twilio_enabled=="true"? true:false}
              onChange={(checked) => onChange('is_twilio_enabled', checked.toString())}
              label="Twilio"
            />


          </div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Twilio Account SID
          </label>
          <Input
            type="text"
            value={data.twilio_account_sid || ''}
            onChange={(e) => onChange('twilio_account_sid', e.target.value)}
            placeholder="Enter Twilio Account SID"
            className="w-full border border-table-divider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Twilio Auth Token
          </label>
          <Input
            type="password"
            value={data.twilio_auth_token || ''}
            onChange={(e) => onChange('twilio_auth_token', e.target.value)}
            placeholder="Enter Twilio Auth Token"
            className="w-full border border-table-divider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Twilio Phone Number
          </label>
          <Input
            type="tel"
            value={data.twilio_phone_number || ''}
            onChange={(e) => onChange('twilio_phone_number', e.target.value)}
            placeholder="Enter Twilio Phone Number"
            className="w-full border border-table-divider"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 border-1 border-table-divider p-4 rounded-lg">
        <div>
          <div className='w-full flex justify-between items-center mb-6'>

            <div className='text-md font-bold text-table-header-text '>
              MSG 91 Settings
            </div>
              <Toggle
              id="is_msg91_enabled"
              checked={data.is_msg91_enabled == "true" ? true : false }
              onChange={(checked) => onChange('is_msg91_enabled', checked.toString())}
                label="MSG 91"
              />

            
          </div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            MSG 91 Sender ID
          </label>
          <Input
            type="text"
            value={data.msg91_sender_id || ''}
            onChange={(e) => onChange('msg91_sender_id', e.target.value)}
            placeholder="Enter  MSG 91 Sender ID"
            className="w-full border border-table-divider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            MSG 91 API Key
          </label>
          <Input
            type="password"
            value={data.msg91_api_key || ''}
            onChange={(e) => onChange('msg91_api_key', e.target.value)}
            placeholder="Enter MSG 91 API Key"
            className="w-full border border-table-divider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            MSG 91 Template ID
          </label>
          <Input
            type="tel"
            value={data.msg91_template_id || ''}
            onChange={(e) => onChange('msg91_template_id', e.target.value)}
            placeholder="Enter MSG 91 Template ID"
            className="w-full border border-table-divider"
          />
        </div>
      </div>

      {/* <div className="mt-8">
        <h4 className="text-md font-medium text-text-muted mb-4">Authentication Settings</h4>
        <div className="space-y-4 ">
          <Toggle
            id="phone_auth"
            checked={data.phone_authentication || false}
            onChange={(checked) => onChange('phone_authentication', checked)}
            label="Enable Phone Authentication"
          />

          <Toggle
            id="email_auth"
            checked={data.email_authentication || false}
            onChange={(checked) => onChange('email_authentication', checked)}
            label="Enable Email Authentication"
          />
        </div>
      </div> */}
    </div>
  );
};
