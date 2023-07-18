import { useEffect } from 'react';
import { useFormikContext } from 'formik';

export default function AutoSubmitToken() {
  // Grab values and submitForm from context
  const { values, submitForm } = useFormikContext();
  useEffect(() => {
    // Submit the form imperatively as an effect as soon as form values.token are 6 digits long
    if (values.token.length === 6) {
      submitForm();
    }
  }, [values, submitForm]);

  return null;
}
