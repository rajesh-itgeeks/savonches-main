// import React, { useState, useCallback, useEffect } from 'react';
// import {
//   Layout,
//   Card,
//   TextField,
//   FormLayout,
//   Text,
//   Select,
//   InlineStack,
//   Box,
//   Spinner,
//   Toast,
//   ContextualSaveBar,
//   Frame,
// } from '@shopify/polaris';
// import { SwitchToggle } from '../common/SwitchToggle';
// import APIServices from '../../services/ApiServices';

// const GeneralSettings = () => {
//   const api = new APIServices();

//   const [businessName, setBusinessName] = useState('');
//   const [contactEmail, setContactEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [currency, setCurrency] = useState('USD');
//   const [expirationDays, setExpirationDays] = useState('');
//   const [quoteReminder, setQuoteReminder] = useState('');
//   const [quoteIdPrefix, setQuoteIdPrefix] = useState('');
//   const [autoExpireEnabled, setAutoExpireEnabled] = useState(false);
//   const [activeTab, setActiveTab] = useState('itemEdits'); // State for active tab

//   const [loading, setLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [toastActive, setToastActive] = useState(false);
//   const [success, showSuccess] = useState('');
//   const [error, setError] = useState('');

//   const [initialValues, setInitialValues] = useState({});

//   const currencyOptions = [
//     { label: 'USD - US Dollar', value: 'USD' },
//     { label: 'EUR - Euro', value: 'EUR' },
//     { label: 'GBP - British Pound', value: 'GBP' },
//     { label: 'INR - Indian Rupee', value: 'INR' },
//   ];

//   const quoteReminderOptions = [
//     { label: '1 Day', value: '1Day' },
//     { label: '3 Days', value: '3Day' },
//     { label: '7 Days', value: '7Day' },
//   ];

//   const fetchSettings = async () => {
//     try {
//       setLoading(true);
//       const result = await api.getAppSettings();
//       if (result.status) {
//         const data = result.result;
//         const values = {
//           businessName: data.businessName || '',
//           contactEmail: data.contactEmail || '',
//           phoneNumber: data.phoneNumber || '',
//           currency: data.currency || 'USD',
//           quoteIdPrefix: data.quoteSettings?.quoteIdPrefix || '',
//           autoExpireEnabled: data.quoteSettings?.autoExpireQuote?.isOn || false,
//           expirationDays: data.quoteSettings?.expirationTime?.time?.replace('Day', '') || '',
//           quoteReminder: data.quoteSettings?.quoteReminderTime?.time || '',
//         };
//         setBusinessName(values.businessName);
//         setContactEmail(values.contactEmail);
//         setPhoneNumber(values.phoneNumber);
//         setCurrency(values.currency);
//         setQuoteIdPrefix(values.quoteIdPrefix);
//         setAutoExpireEnabled(values.autoExpireEnabled);
//         setExpirationDays(values.expirationDays);
//         setQuoteReminder(values.quoteReminder);
//         setInitialValues(values);
//       } else {
//         throw new Error(result.message || 'Failed to fetch settings');
//       }
//     } catch (err) {
//       setError(err.message);
//       setToastActive(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const handleSave = useCallback(async () => {
//     setIsSaving(true);
//     const payload = {
//       businessName,
//       contactEmail,
//       phoneNumber,
//       currency,
//       quoteIdPrefix,
//       quoteSettings: {
//         autoExpireQuote: { isOn: autoExpireEnabled },
//         expirationTime: { time: `${expirationDays}Day` },
//         quoteReminderTime: { time: quoteReminder },
//       },
//     };
//     try {
//       const result = await api.UpdateAppsettings(payload);
//       if (result.status) {
//         setInitialValues({
//           businessName,
//           contactEmail,
//           phoneNumber,
//           currency,
//           quoteIdPrefix,
//           autoExpireEnabled,
//           expirationDays,
//           quoteReminder,
//         });
//         showSuccess('Settings saved successfully.');
//       } else {
//         throw new Error(result.message || 'Update failed');
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsSaving(false);
//       setToastActive(true);
//     }
//   }, [
//     businessName,
//     contactEmail,
//     phoneNumber,
//     currency,
//     quoteIdPrefix,
//     autoExpireEnabled,
//     expirationDays,
//     quoteReminder,
//   ]);

//   const handleDiscard = useCallback(() => {
//     setBusinessName(initialValues.businessName || '');
//     setContactEmail(initialValues.contactEmail || '');
//     setPhoneNumber(initialValues.phoneNumber || '');
//     setCurrency(initialValues.currency || 'USD');
//     setQuoteIdPrefix(initialValues.quoteIdPrefix || '');
//     setAutoExpireEnabled(initialValues.autoExpireEnabled || false);
//     setExpirationDays(initialValues.expirationDays || '');
//     setQuoteReminder(initialValues.quoteReminder || '');
//   }, [initialValues]);

//   const toastMarkup = toastActive && (success || error) && (
//     <Toast
//       content={success || error}
//       error={!!error}
//       onDismiss={() => {
//         showSuccess('');
//         setError('');
//         setToastActive(false);
//       }}
//     />
//   );

//   const isDirty =
//     businessName !== initialValues.businessName ||
//     contactEmail !== initialValues.contactEmail ||
//     phoneNumber !== initialValues.phoneNumber ||
//     currency !== initialValues.currency ||
//     quoteIdPrefix !== initialValues.quoteIdPrefix ||
//     autoExpireEnabled !== initialValues.autoExpireEnabled ||
//     expirationDays !== initialValues.expirationDays ||
//     quoteReminder !== initialValues.quoteReminder;

//   const tabs = [
//     { id: 'itemEdits', content: 'Item edits', accessibilityLabel: 'Item edits tab', panelID: 'itemEdits' },
//     { id: 'addressEdits', content: 'Address edits', accessibilityLabel: 'Address edits tab', panelID: 'addressEdits' },
//     { id: 'cancellations', content: 'Cancellations', accessibilityLabel: 'Cancellations tab', panelID: 'cancellations' },
//   ];

//   if (loading) {
//     return (
//       <Frame>
//         <Box padding="500" align="center">
//           <Spinner accessibilityLabel="Loading settings" size="large" />
//         </Box>
//       </Frame>
//     );
//   }

//   return (
//     <Frame>
//       {isDirty && (
//         <ContextualSaveBar
//           message="Unsaved changes"
//           saveAction={{
//             onAction: handleSave,
//             loading: isSaving,
//             disabled: !isDirty,
//           }}
//           discardAction={{
//             onAction: handleDiscard,
//           }}
//           navigation={{
//             items: tabs,
//             onAction: (selectedTabId) => setActiveTab(selectedTabId),
//             activeItemId: activeTab,
//           }}
//         />
//       )}
//       <Layout>
//         <Layout.Section variant="oneHalf">
//           <Card title="Business Information" sectioned>
//             <FormLayout>
//               <TextField label="Business Name" value={businessName} onChange={setBusinessName} />
//               <TextField
//                 label="Contact Email"
//                 value={contactEmail}
//                 onChange={setContactEmail}
//                 type="email"
//               />
//               <TextField label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} />
//               <Select
//                 label="Currency"
//                 options={currencyOptions}
//                 value={currency}
//                 onChange={setCurrency}
//               />
//             </FormLayout>
//           </Card>
//         </Layout.Section>

//         <Layout.Section variant="oneHalf">
//           <Card title="Quote Settings" sectioned>
//             <FormLayout>
//               <Box paddingBlockEnd="300">
//                 <InlineStack align="space-between">
//                   <Text as="span" variant="bodyMd">
//                     Automatically expire quotes after a certain period
//                   </Text>
//                   <SwitchToggle
//                     checked={autoExpireEnabled}
//                     onChange={() => setAutoExpireEnabled(!autoExpireEnabled)}
//                   />
//                 </InlineStack>
//               </Box>

//               <TextField
//                 label="Expiration Days"
//                 type="number"
//                 value={expirationDays}
//                 onChange={setExpirationDays}
//                 disabled={!autoExpireEnabled}
//               />

//               <Select
//                 label="Quote Reminder Time"
//                 options={quoteReminderOptions}
//                 value={quoteReminder}
//                 onChange={setQuoteReminder}
//                 disabled={!autoExpireEnabled}
//               />

//               <TextField
//                 label="Quote ID Prefix"
//                 value={quoteIdPrefix}
//                 onChange={setQuoteIdPrefix}
//                 disabled={!autoExpireEnabled}
//               />
//             </FormLayout>
//           </Card>
//         </Layout.Section>
//       </Layout>

//       {toastMarkup}
//     </Frame>
//   );
// };

// export default GeneralSettings;
// ================================
import React, { useState, useCallback, useEffect } from 'react';
import {
  Layout,
  Card,
  TextField,
  FormLayout,
  Text,
  Select,
  InlineStack,
  Box,

  Frame,
  SkeletonPage,
  LegacyCard,
  SkeletonBodyText,
  BlockStack,
  SkeletonDisplayText,
} from '@shopify/polaris';
import { SwitchToggle } from '../common/SwitchToggle';
import APIServices from '../../services/ApiServices';
import { SaveBar, useAppBridge } from '@shopify/app-bridge-react';
import Skeleton from '../common/Skeleton';
import ToastMessage from '../common/ToastMessage';
import { useToast } from '../CustomHooks/useToast';
import GeneralSettingSkeleton from '../common/GeneralSettingSkeleton';

const GeneralSettings = () => {
  const api = new APIServices();
  const shopify = useAppBridge();
  const {
    toastActive,
    success,
    error,
    showSuccess,
    showError,
    dismiss,
  } = useToast();
  const [businessName, setBusinessName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [expirationDays, setExpirationDays] = useState('');
  const [quoteReminder, setQuoteReminder] = useState('');
  const [quoteIdPrefix, setQuoteIdPrefix] = useState('');
  const [autoExpireEnabled, setAutoExpireEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState('itemEdits');
  const [touchedFields, setTouchedFields] = useState({
    contactEmail: false,
    phoneNumber: false,
    expirationDays: false,
  });


  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [errors, setErrors] = useState({
    contactEmail: '',
    phoneNumber: '',
    expirationDays: '',
  });

  const [initialValues, setInitialValues] = useState({});

  const currencyOptions = [
    { label: 'USD - US Dollar', value: 'USD' },
    { label: 'EUR - Euro', value: 'EUR' },
    { label: 'GBP - British Pound', value: 'GBP' },
    { label: 'INR - Indian Rupee', value: 'INR' },
  ];

  const quoteReminderOptions = [
    { label: '1 Day', value: '1days' },
    { label: '3 Days', value: '3days' },
    { label: '7 Days', value: '7days' },
  ];

  const validateField = (field, value, touched = true) => {
    let error = '';

    switch (field) {
      case 'contactEmail':
        if (touched) {
          if (!value) {
            error = 'Email is required';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = 'Enter a valid email';
          }
        }
        break;
      case 'phoneNumber':
        if (touched) {
          if (!value) {
            error = 'Phone number is required';
          } else if (!/^[0-9]{10,15}$/.test(value)) {
            error = 'Enter a valid phone number';
          }
        }
        break;
      case 'expirationDays':
        if (touched && autoExpireEnabled && (!value || isNaN(value) || Number(value) <= 0)) {
          error = 'Enter valid expiration days';
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };


  const handleEmailChange = (value) => {
    setContactEmail(value);
    if (touchedFields.contactEmail) {
      validateField('contactEmail', value);
    }
  };

  const handleEmailBlur = () => {
    setTouchedFields((prev) => ({ ...prev, contactEmail: true }));
    validateField('contactEmail', contactEmail);
  };


  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
    if (touchedFields.phoneNumber) {
      validateField('phoneNumber', value);
    }
  };

  const handlePhoneBlur = () => {
    setTouchedFields((prev) => ({ ...prev, phoneNumber: true }));
    validateField('phoneNumber', phoneNumber);
  };

  const handleExpirationChange = (value) => {
    setExpirationDays(value);
    if (touchedFields.expirationDays) {
      validateField('expirationDays', value);
    }
  };

  const handleExpirationBlur = () => {
    setTouchedFields((prev) => ({ ...prev, expirationDays: true }));
    validateField('expirationDays', expirationDays);
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const result = await api.getAppSettings();
      console.log("---------sett", result)
      if (result.status) {
        const data = result?.result;
        const values = {
          businessName: data?.businessName || '',
          contactEmail: data?.contactEmail || '',
          phoneNumber: data?.phoneNumber || '',
          currency: data?.currency || 'USD',
          quoteIdPrefix: data?.quoteIdPrefix || '',
          autoExpireEnabled: data?.quoteSettings?.autoExpireQuote?.isOn || false,
          expirationDays: data?.quoteSettings?.expirationTime?.time?.replace(/days/, '') || '',
          quoteReminder: data?.quoteSettings?.quoteReminderTime?.time || '',
        };
        setBusinessName(values.businessName);
        setContactEmail(values.contactEmail);
        setPhoneNumber(values.phoneNumber);
        setCurrency(values.currency);
        setQuoteIdPrefix(values.quoteIdPrefix);
        setAutoExpireEnabled(values.autoExpireEnabled);
        setExpirationDays(values.expirationDays);
        setQuoteReminder(values.quoteReminder);
        setInitialValues(values);
      } else {
        throw new Error(result.message || 'Failed to fetch settings');
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    const payload = {
      businessName,
      contactEmail,
      phoneNumber,
      currency,
      quoteIdPrefix,
      quoteSettings: {
        autoExpireQuote: { isOn: autoExpireEnabled },
        expirationTime: { time: `${expirationDays}days` },
        quoteReminderTime: { time: quoteReminder },
      },
    };
    try {
      const result = await api.UpdateAppsettings(payload);
      if (result.status) {
        setInitialValues({
          businessName,
          contactEmail,
          phoneNumber,
          currency,
          quoteIdPrefix,
          autoExpireEnabled,
          expirationDays,
          quoteReminder,
        });
        showSuccess('Settings saved successfully.');
        shopify.saveBar.hide('timeframe-save-bar');
      } else {
        throw new Error(result.error || 'Update failed');
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setIsSaving(false);
    }
  }, [
    businessName,
    contactEmail,
    phoneNumber,
    currency,
    quoteIdPrefix,
    autoExpireEnabled,
    expirationDays,
    quoteReminder,
  ]);

  const handleDiscard = useCallback(() => {
    setBusinessName(initialValues.businessName || '');
    setContactEmail(initialValues.contactEmail || '');
    setPhoneNumber(initialValues.phoneNumber || '');
    setCurrency(initialValues.currency || 'USD');
    setQuoteIdPrefix(initialValues.quoteIdPrefix || '');
    setAutoExpireEnabled(initialValues.autoExpireEnabled || false);
    setExpirationDays(initialValues.expirationDays || '');
    setQuoteReminder(initialValues.quoteReminder || '');
    shopify.saveBar.hide('timeframe-save-bar');
  }, [initialValues]);

  const toastMarkup = toastActive && (success || error) && (
    <ToastMessage
      active={toastActive}
      content={success || error}
      error={!!error}
      onDismiss={dismiss}
    />

  );

  const isDirty =
    businessName !== initialValues.businessName ||
    contactEmail !== initialValues.contactEmail ||
    phoneNumber !== initialValues.phoneNumber ||
    currency !== initialValues.currency ||
    quoteIdPrefix !== initialValues.quoteIdPrefix ||
    autoExpireEnabled !== initialValues.autoExpireEnabled ||
    expirationDays !== initialValues.expirationDays ||
    quoteReminder !== initialValues.quoteReminder;

  const hasErrors = Object.values(errors).some((e) => e);

  useEffect(() => {
    if (isDirty) {
      shopify.saveBar.show('timeframe-save-bar');
    } else {
      shopify.saveBar.hide('timeframe-save-bar');
    }
  }, [isDirty]);

  const tabs = [
    { id: 'itemEdits', content: 'Item edits', accessibilityLabel: 'Item edits tab', panelID: 'itemEdits' },
    { id: 'addressEdits', content: 'Address edits', accessibilityLabel: 'Address edits tab', panelID: 'addressEdits' },
    { id: 'cancellations', content: 'Cancellations', accessibilityLabel: 'Cancellations tab', panelID: 'cancellations' },
  ];

  if (loading) {
    return (
    //  <SkeletonPage primaryAction>
    //   <Layout>
    //     <Layout.Section>
    //       <Card sectioned>
    //         <SkeletonBodyText />
    //       </Card>
    //       <Card sectioned>
    //         <BlockStack>
    //           <SkeletonDisplayText size="small" />
    //           <SkeletonBodyText />
    //         </BlockStack>
    //       </Card>
    //       <Card sectioned>
    //         <BlockStack>
    //           <SkeletonDisplayText size="small" />
    //           <SkeletonBodyText />
    //         </BlockStack>
    //       </Card>
    //     </Layout.Section>
    //     <Layout.Section variant="oneThird">
    //       <Card>
    //         <Card.Section>
    //           <BlockStack>
    //             <SkeletonDisplayText size="small" />
    //             <SkeletonBodyText lines={2} />
    //           </BlockStack>
    //         </Card.Section>
    //         <Card.Section>
    //           <SkeletonBodyText lines={1} />
    //         </Card.Section>
    //       </Card>
    //       <Card subdued>
    //         <Card.Section>
    //           <BlockStack>
    //             <SkeletonDisplayText size="small" />
    //             <SkeletonBodyText lines={2} />
    //           </BlockStack>
    //         </Card.Section>
    //         <Card.Section>
    //           <SkeletonBodyText lines={2} />
    //         </Card.Section>
    //       </Card>
    //     </Layout.Section>
    //   </Layout>
    // </SkeletonPage>);
    <GeneralSettingSkeleton/>);
  }

  return (
    <Frame>
      <SaveBar id="timeframe-save-bar">
        <button onClick={handleDiscard}>Discard</button>
        <button variant="primary" onClick={handleSave} disabled={!isDirty || isSaving || hasErrors} {...(isSaving ? { loading: "true" } : {})}>
          Save
        </button>
      </SaveBar>
      <Layout>
        <Layout.Section variant="oneHalf">
          <Card title="Business Information" sectioned>
            <FormLayout>
              <TextField label="Business Name" value={businessName} onChange={setBusinessName} />
              <TextField
                label="Contact Email"
                value={contactEmail}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                type="email"
                error={touchedFields.contactEmail ? errors.contactEmail : ''}
              />

              <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                error={touchedFields.phoneNumber ? errors.phoneNumber : ''}
              />
              <Select
                label="Currency"
                options={currencyOptions}
                value={currency}
                onChange={setCurrency}
              />
            </FormLayout>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneHalf">
          <Card title="Quote Settings" sectioned>
            <FormLayout>
              <Box paddingBlockEnd="300">
                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd">
                    Automatically expire quotes after a certain period
                  </Text>
                  <SwitchToggle
                    checked={autoExpireEnabled}
                    onChange={() => setAutoExpireEnabled(!autoExpireEnabled)}
                  />
                </InlineStack>
              </Box>

              <TextField
                label="Expiration Days"
                value={expirationDays}
                onChange={handleExpirationChange}
                onBlur={handleExpirationBlur}
                disabled={!autoExpireEnabled}
                error={touchedFields.expirationDays ? errors.expirationDays : ''}
              />

              <Select
                label="Quote Reminder Time"
                options={quoteReminderOptions}
                value={quoteReminder}
                onChange={setQuoteReminder}
                disabled={!autoExpireEnabled}
              />

              <TextField
                label="Quote ID Prefix"
                value={quoteIdPrefix}
                onChange={setQuoteIdPrefix}
                disabled={!autoExpireEnabled}
              />
            </FormLayout>
          </Card>
        </Layout.Section>
      </Layout>

      {toastMarkup}
    </Frame>
  );
};

export default GeneralSettings;
