// import React, { useState, useEffect, useCallback } from 'react';
// import {
//     Box,
//     Button,
//     Card,
//     FormLayout,
//     Grid,
//     InlineStack,
//     Select,
//     Text,
//     TextField,
//     Icon,
//     Toast,
// } from '@shopify/polaris';
// import {
//     PersonIcon,
//     SendIcon,
//     PlusIcon,
//     XCircleIcon,
//     ClockIcon,
//     NotificationIcon,
// } from '@shopify/polaris-icons';
// import APIServices from '../../services/ApiServices';
// import { useAppBridge } from '@shopify/app-bridge-react';

// const QuoteOptions = [
//     { label: 'Quote Submitted By The Customer', value: 'quoteSubmitted', icon: PersonIcon },
//     { label: 'Offer Send To The Customer', value: 'quoteAccepted', icon: PlusIcon },
//     { label: 'Quote Offer Rejected By The Customer', value: 'quoteRejected', icon: XCircleIcon },
//     { label: 'Offer Accepted By The Customer', value: 'quoteQuoted', icon: SendIcon },
//     { label: 'Offer Expiration Reminder', value: 'quoteExpired', icon: NotificationIcon },
//     { label: 'Quote Reminder Expired Quotes Notification', value: 'quoteReminder', icon: ClockIcon },
// ];

// const EmailSettings = () => {
//     const [templateType, setTemplateType] = useState('quoteSubmitted');
//     const [subjectLine, setSubjectLine] = useState('');
//     const [emailBody, setEmailBody] = useState('');
//     const [activeButton, setActiveButton] = useState('sendTest');
//     const [toastActive, setToastActive] = useState(false);
//     const [toastContent, setToastContent] = useState('');
//     const [toastTone, setToastTone] = useState('success');
//     const shopify = useAppBridge();
//     const apiService = new APIServices();

//     const toggleToast = useCallback(() => setToastActive((prev) => !prev), []);

//     const showToast = (message, tone = 'success') => {
//         setToastContent(message);
//         setToastTone(tone);
//         setToastActive(true);
//     };

//     useEffect(() => {
//         const fetchTemplate = async () => {
//             try {
//                 const data = await apiService.getTemplateDetails({ type: templateType });

//                 if (data?.status && data?.result) {
//                     setSubjectLine(data.result.subject || '');
//                     setEmailBody(data.result.emailTemplate || '');
//                 } else {
//                     showToast(data?.message || 'Failed to load template.', 'critical');
//                 }
//             } catch (error) {
//                 showToast('Error fetching template details.', 'critical');
//                 console.error('API error:', error);
//             }
//         };

//         fetchTemplate();
//     }, [templateType]);

//     const handleTemplateChange = (value) => {
//         setTemplateType(value);
//     };

//     const handleSendTest = () => {
//         setActiveButton('sendTest');
//         console.log('Sending test email...', { templateType, subjectLine, emailBody });
//         showToast('Test email sent (simulation).');
//     };

//     const handlePreview = () => {
//         setActiveButton('preview');
//         console.log('Previewing email...', { templateType, subjectLine, emailBody });
//         showToast('Preview opened (simulation).');
//     };

//     const handleSave = async () => {
//         setActiveButton('save');

//         const payload = {
//             type: templateType,
//             subject: subjectLine,
//             emailTemplate: emailBody,
//         };

//         try {
//             const result = await apiService.UpdateTemplateDetails(payload);

//             if (result?.status) {
//                 shopify.toast.show("email updated SuccessFully", {
//                     duration: 1500,
//                 });
//             } else {
//                 showToast(result?.message || 'Failed to save template.', 'critical');
//             }
//         } catch (error) {
//             showToast('Error saving template.', 'critical');
//             console.error('Save error:', error);
//         }
//     };

//     return (
//         <Box>
//             <Grid>
//                 {QuoteOptions.map((option) => {
//                     const isActive = templateType === option.value;
//                     return (
//                         <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }} key={option.value}>
//                             <Box onClick={() => handleTemplateChange(option.value)} cursor="pointer" role="button">
//                                 <Card
//                                     padding="400"
//                                     sectioned
//                                       {...(isActive ? { background: 'bg-surface-secondary' } : {})}
//                                     style={{
//                                         backgroundColor: isActive ? '#eef6ff' : 'white',
//                                         border: isActive ? '2px solid #007ace' : '1px solid #dcdcdc',
//                                         cursor: 'pointer',
//                                         transition: 'all 0.2s ease-in-out',
//                                     }}
//                                 >
//                                     <InlineStack align="space-between" blockAlign="center">
//                                         <Text variant="bodyLg" fontWeight="semibold">{option.label}</Text>
//                                         <div
//                                             style={{
//                                                 backgroundColor: isActive ? '#91c0dfff' : '#f6f6f7',
//                                                 padding: "0.25rem",
//                                                 borderRadius: "6px",
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 justifyContent: "center",
//                                                 transform: "scale(1.5)",
//                                                 height: "30px",
//                                             }}
//                                         >
//                                             <Icon source={option.icon} tone="base" />
//                                         </div>
//                                     </InlineStack>
//                                 </Card>
//                             </Box>
//                         </Grid.Cell>
//                     );
//                 })}
//             </Grid>

//             <Box paddingBlockStart="400">
//                 <Card title="Email Template" sectioned>
//                     <FormLayout>
//                         <Select
//                             label="Template Type"
//                             options={QuoteOptions.map(({ label, value }) => ({ label, value }))}
//                             value={templateType}
//                             onChange={handleTemplateChange}
//                         />
//                         <TextField
//                             label={<Text variant="headingSm" as="h6">Subject Line</Text>}
//                             value={subjectLine}
//                             onChange={setSubjectLine}
//                         />
//                         <TextField
//                             label={<Text variant="headingSm" as="h6">Email Body</Text>}
//                             value={emailBody}
//                             onChange={setEmailBody}
//                             multiline={6}
//                         />
//                     </FormLayout>

//                     <Box paddingBlockStart="400">
//                         <InlineStack gap="200">
//                             <Button
//                                 {...(activeButton === 'sendTest' ? { variant: 'primary' } : {})}
//                                 onClick={handleSendTest}
//                             >
//                                 Send Test
//                             </Button>
//                             <Button
//                                 {...(activeButton === 'preview' ? { variant: 'primary' } : {})}
//                                 onClick={handlePreview}
//                             >
//                                 Preview
//                             </Button>
//                             <Button
//                                 {...(activeButton === 'save' ? { variant: 'primary' } : {})}
//                                 onClick={handleSave}
//                             >
//                                 Save
//                             </Button>
//                         </InlineStack>
//                     </Box>
//                 </Card>
//             </Box>

//             {/* {toastActive && (
//         <Toast content={toastContent} onDismiss={toggleToast} tone={toastTone} />
//       )} */}
//         </Box>
//     );
// };

// export default EmailSettings;
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  FormLayout,
  Grid,
  InlineStack,
  Select,
  Text,
  TextField,
  Icon,
  SkeletonBodyText,
  SkeletonDisplayText,
  Modal,
  Spinner,
} from '@shopify/polaris';
import {
  PersonIcon,
  SendIcon,
  PlusIcon,
  XCircleIcon,
  ClockIcon,
  NotificationIcon,
} from '@shopify/polaris-icons';
import APIServices from '../../services/ApiServices';
import { useAppBridge } from '@shopify/app-bridge-react';

const QuoteOptions = [
  { label: 'Quote Submitted By The Customer', value: 'quoteSubmitted', icon: PersonIcon },
  { label: 'Offer Send To The Customer', value: 'quoteAccepted', icon: PlusIcon },
  { label: 'Quote Offer Rejected By The Customer', value: 'quoteRejected', icon: XCircleIcon },
  { label: 'Offer Accepted By The Customer', value: 'quoteQuoted', icon: SendIcon },
  { label: 'Offer Expiration Reminder', value: 'quoteExpired', icon: NotificationIcon },
  { label: 'Quote Reminder Expired Quotes Notification', value: 'quoteReminder', icon: ClockIcon },
];

const EmailSettings = () => {
  const [templateType, setTemplateType] = useState('quoteSubmitted');
  const [subjectLine, setSubjectLine] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [initialSubjectLine, setInitialSubjectLine] = useState('');
  const [initialEmailBody, setInitialEmailBody] = useState('');
  const [activeButton, setActiveButton] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewError, setPreviewError] = useState(null);
  const shopify = useAppBridge();
  const apiService = new APIServices();

  const fetchTemplate = async (type) => {
    setLoading(true);
    try {
      const data = await apiService.getTemplateDetails({ type });
      if (data?.status && data?.result) {
        const subject = data.result.subject || '';
        const body = data.result.emailTemplate || '';
        setSubjectLine(subject);
        setEmailBody(body);
        setInitialSubjectLine(subject);
        setInitialEmailBody(body);
      }
    } catch (error) {
      console.error('API error:', error);
      shopify.toast.show('Error fetching template details.', { duration: 1500, isError: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplate(templateType);
  }, [templateType]);

  const handleTemplateChange = (value) => {
    setTemplateType(value);
  };

  const handleSendTest = () => {
    setActiveButton('sendTest');
    console.log('Sending test email...', { templateType, subjectLine, emailBody });
    shopify.toast.show('Test email sent (simulation).', { duration: 1500 });
  };

  const handlePreview = async () => {
    setActiveButton('preview');
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const payload = {
        emailTemplate: emailBody,
        subject: subjectLine,
      };
      const result = await apiService.PreviewTemplate(payload);
      if (result?.status && result?.result) {
        setPreviewData(result.result);
      } else {
        setPreviewError(result?.message || 'Failed to fetch preview.');
      }
    } catch (error) {
      setPreviewError('Error fetching preview.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSave = async () => {
    setActiveButton('save');
    const payload = {
      type: templateType,
      subject: subjectLine,
      emailTemplate: emailBody,
    };
    try {
      const result = await apiService.UpdateTemplateDetails(payload);
      if (result?.status) {
        shopify.toast.show('Email updated successfully', { duration: 1500 });
        setInitialSubjectLine(subjectLine);
        setInitialEmailBody(emailBody);
      } else {
        shopify.toast.show(result?.message || 'Failed to save template.', { duration: 1500, isError: true });
      }
    } catch (error) {
      shopify.toast.show('Error saving template.', { duration: 1500, isError: true });
      console.error('Save error:', error);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewData(null);
    setPreviewError(null);
  };

  const isDirty = subjectLine !== initialSubjectLine || emailBody !== initialEmailBody;

  return (
    <Box>
      <Grid>
        {QuoteOptions.map((option) => {
          const isActive = templateType === option.value;
          return (
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }} key={option.value}>
              <Box onClick={() => handleTemplateChange(option.value)} cursor="pointer" role="button">
                <Card
                  padding="400"
                  sectioned
                  style={{
                    backgroundColor: isActive ? '#eef6ff' : 'white',
                    border: isActive ? '2px solid #007ace' : '1px solid #dcdcdc',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <InlineStack align="space-between" blockAlign="center">
                    <Text variant="bodyLg" fontWeight="semibold">{option.label}</Text>
                    <div
                      style={{
                        backgroundColor: isActive ? '#91c0dfff' : '#f6f6f7',
                        padding: '0.25rem',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'scale(1.5)',
                        height: '30px',
                      }}
                    >
                      <Icon source={option.icon} tone="base" />
                    </div>
                  </InlineStack>
                </Card>
              </Box>
            </Grid.Cell>
          );
        })}
      </Grid>

      <Box paddingBlockStart="400">
        <Card title="Email Template" sectioned>
          {loading ? (
            <Box>
              <SkeletonDisplayText size="small" />
              <Box paddingBlockStart="400">
                <SkeletonBodyText lines={1} />
              </Box>
              <Box paddingBlockStart="400" />
              <SkeletonDisplayText size="small" />
              <Box paddingBlockStart="400">
                <SkeletonBodyText lines={1} />
              </Box>
              <Box paddingBlockStart="400" />
              <InlineStack gap="200">
                <SkeletonBodyText lines={12} />
              </InlineStack>
            </Box>
          ) : (
            <FormLayout>
              <Select
                label="Template Type"
                options={QuoteOptions.map(({ label, value }) => ({ label, value }))}
                value={templateType}
                onChange={handleTemplateChange}
              />
              <TextField
                label={<Text variant="headingSm" as="h6">Subject Line</Text>}
                value={subjectLine}
                onChange={setSubjectLine}
              />
              <TextField
                label={<Text variant="headingSm" as="h6">Email Body</Text>}
                value={emailBody}
                onChange={setEmailBody}
                multiline={6}
              />
              <Box paddingBlockStart="400">
                <InlineStack gap="200">
                  <Button
                    {...(activeButton === 'sendTest' ? { variant: 'primary' } : {})}
                    onClick={handleSendTest}
                  >
                    Send Test
                  </Button>
                  <Button
                    {...(activeButton === 'preview' ? { variant: 'primary' } : {})}
                    onClick={handlePreview}
                  >
                    Preview
                  </Button>
                  <Button
                    {...(activeButton === 'save' ? { variant: 'primary' } : {})}
                    onClick={handleSave}
                    disabled={!isDirty}
                  >
                    Save
                  </Button>
                </InlineStack>
              </Box>
            </FormLayout>
          )}
        </Card>
      </Box>

      <Modal
        open={previewOpen}
        onClose={handleClosePreview}
        title="Email Preview"
        primaryAction={{
          content: 'Close',
          onAction: handleClosePreview,
        }}
      >
        <Modal.Section>
          {previewLoading ? (
            <Box padding="400" style={{ textAlign: 'center' }}>
              <Spinner accessibilityLabel="Loading preview" size="large" />
            </Box>
          ) : previewError ? (
            <Box padding="400">
              <Text variant="bodyMd" color="critical">
                {previewError}
              </Text>
            </Box>
          ) : previewData ? (
            <Box padding="400">
              <Text variant="headingSm" as="h6">Subject:</Text>
              <Text variant="bodyMd">{previewData.subject}</Text>
              <Box paddingBlockStart="400">
                <Text variant="headingSm" as="h6">Email Content:</Text>
                <Box
                  style={{
                    border: '1px solid #dcdcdc',
                    borderRadius: '4px',
                    maxHeight: '500px',
                    overflow: 'auto',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: previewData.emailHtml }}
                  />
                </Box>
              </Box>
            </Box>
          ) : null}
        </Modal.Section>
      </Modal>
    </Box>
  );
};

export default EmailSettings;
