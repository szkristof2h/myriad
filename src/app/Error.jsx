import React, { useContext } from 'react';
import { ErrorContext } from './contexts/ErrorContext.jsx';
import Popup from './Popup.jsx';
import './error.css';

export default function Error() {
  const { errors, setErrors } = useContext(ErrorContext);
  const dismiss = () => setErrors([]);

  return (
    <Popup show={errors.length > 0} dismiss={dismiss} dismissible={true} modifier="error">
      <div className="errors box box--warn">
        <div className="errors__header">
          Error
        </div>
        {errors && errors.map(e => (
          <div className="errors__message" key={`error${e.type}`}>
            {e.type}: {e.errors}
          </div>
        ))}
      </div>
    </Popup>
  )
}
