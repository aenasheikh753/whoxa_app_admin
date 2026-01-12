import React from 'react';
import { Input } from '../ui/Input';
import { ColorPicker } from '../ui/ColorPicker';
import type { ConfigData } from '../../services/configService';

interface GeneralSettingsProps {
  data: ConfigData;
  onChange: (field: keyof ConfigData, value: any) => void;
  onFileChange: (field: keyof ConfigData, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  data,
  onChange,
  onFileChange,
}) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-extrabold text-table-header-text mb-4 px-2">
        General Settings
      </h3>

      {/* App/Website Info */}
      <div className="border border-table-divider rounded-md grid grid-cols-1 md:grid-cols-2 gap-6 p-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            App/Website Name
          </label>
          <Input
            type="text"
            value={data.app_name || ''}
            onChange={(e) => onChange('app_name', e.target.value)}
            placeholder="Enter app/website name"
            className="w-full border border-table-divider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Contact Email
          </label>
          <Input
            type="email"
            value={data.app_email || ''}
            onChange={(e) => onChange('app_email', e.target.value)}
            placeholder="Enter contact email"
            className="w-full border border-table-divider"
          />
        </div>
      </div>

      {/* Logo Uploads */}
      <div className="border border-table-divider rounded-md grid grid-cols-1 md:grid-cols-2 gap-6 p-4 mb-4">
        {[
          { label: 'Web Logo Light', field: 'web_logo_light' },
          { label: 'Web Logo Dark', field: 'web_logo_dark' },
          { label: 'App Logo Light', field: 'app_logo_light' },
          { label: 'App Logo Dark', field: 'app_logo_dark' },
        ].map(({ label, field }) => (
          <div key={field}>
            <label className="block text-sm font-medium text-text-muted mb-2">
              {label}
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <input
                type="file"
                id={`${field}-upload`}
                accept="image/*"
                className="hidden"
                onChange={(e) => onFileChange(field as keyof ConfigData, e)}
              />
              <label
                htmlFor={`${field}-upload`}
                className="px-3 py-2  text-sm text-black bg-gray-200 rounded-lg cursor-pointer hover:opacity-90 transition"
              >
                Choose File
              </label>
              <span className="text-sm text-text-muted truncate max-w-[200px]">
                {data[field as keyof ConfigData]
                  ? String(data[field as keyof ConfigData]).split('/').pop()
                  : 'No file chosen'}
              </span>
            </div>
            {data[field as keyof ConfigData] && (
              <div className="mt-3">
                <img
                  src={String(data[field as keyof ConfigData])}
                  alt={label}
                  className="h-16 w-auto object-contain"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Colors & Copyright */}
      <div className="border border-table-divider rounded-md grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* Primary Color Picker */}
        <ColorPicker
          label="Primary Color"
          value={data.app_primary_color || '#FCC604'}
          onChange={(color) => onChange('app_primary_color', color)}
          className="text-text-muted"
        />

        {/* Secondary Color Options */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-text-muted mb-2">
            Button Text Color
          </label>
          <div className="flex gap-4">
            {[
              { color: '#FFFFFF', label: 'White' },
              { color: '#000000', label: 'Black' },
            ].map(({ color, label }) => {
              const isSelected = data.app_secondary_color === color;
              return (
                <div
                  key={color}
                  onClick={() => onChange('app_secondary_color', color)}
                  className={`relative w-12 h-12 rounded-md border-2 cursor-pointer transition 
              ${isSelected ? 'border-primary shadow-md' : 'border-table-divider'}
            `}
                  style={{ backgroundColor: color }}
                >
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute top-1 right-1 h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Copyright Field */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-text-muted mb-2">
            Copyright Text
          </label>
          <Input
            type="text"
            value={data.copyright_text || ''}
            onChange={(e) => onChange('copyright_text', e.target.value)}
            placeholder="Enter copyright text"
            className="w-full border border-table-divider"
          />
        </div>
      </div>

    </div>
  );
};
