import { DetailsModalProps } from '@/types/historic';
import React from 'react';

function DetailsModal({
  isOpen,
  onClose,
  street,
  neighborhood,
  city,
  state,
  country,
  zipCode,
  temperature,
  lastUpdateDate,
  translation,
}: DetailsModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-textPrimary">
            {translation('modalTitle')}
          </h2>
          <button
            className="text-textPrimary hover:text-textSecondary"
            onClick={onClose}
            id="close-modal-button"
          >
            X
          </button>
        </div>
        <div className="mt-4 text-textPrimary">
          <p>
            <strong>{translation('street')}:</strong> {street}
          </p>
          <p className="pt-1">
            <strong>{translation('neighborhood')}:</strong> {neighborhood}
          </p>
          <p className="pt-1">
            <strong>{translation('city')}:</strong> {city}
          </p>
          <p className="pt-1">
            <strong>{translation('state')}:</strong> {state}
          </p>
          <p className="pt-1">
            <strong>{translation('country')}:</strong> {country}
          </p>
          <p className="pt-1">
            <strong>{translation('zipCode')}:</strong> {zipCode}
          </p>
          <p className="pt-1">
            <strong>{translation('temperature')}:</strong> {temperature}
          </p>
        </div>
        <p className="mt-10 text-sm text-textSecondary">
          *{`${translation('modalAlert')} ${lastUpdateDate}`}
        </p>
      </div>
    </div>
  );
}

export default DetailsModal;
