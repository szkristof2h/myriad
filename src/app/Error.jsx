import React, { useContext } from 'react';
import { ErrorContext } from './contexts/ErrorContext.jsx';
import Popup from './Popup.jsx';
import { Base, Header } from "./Typography/Typography.style";
import StyledError from "./Error.style";

export default function Error() {
  const { errors, setErrors } = useContext(ErrorContext);
  const dismiss = () => setErrors([]);

  return (
    <Popup show={errors.length > 0} dismiss={dismiss} dismissible={true} modifier="error">
      <StyledError className="errors box box--warn">
        <Header centered size={2}>
          Error
        </Header>
        {errors && errors.map(e => (
          <Base key={`error${e.type}`}>
            {e.type}: {e.errors}
          </Base>
        ))}
      </StyledError>
    </Popup>
  )
}
