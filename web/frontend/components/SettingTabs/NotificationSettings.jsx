import React, { useState, useEffect, useCallback } from 'react';
import {
  Divider,
  Page,
  Layout,
  Card,
  Tabs,
  TextField,
  FormLayout,
  Text,
  Select,
  Button,
  Box,
  InlineStack,
  Icon,
  Grid,
  BlockStack,
  Checkbox,
  Frame,
  Toast,
} from '@shopify/polaris';
import {
  BookIcon,
  CashDollarIcon,
  ClockIcon,
  NotificationIcon,
  PersonIcon,
  PlusCircleIcon,
  PlusIcon,
  SendIcon,
  ToggleOffIcon,
  ToggleOnIcon,
  XCircleIcon,
} from '@shopify/polaris-icons';
import { SaveBar, useAppBridge } from '@shopify/app-bridge-react';
import { SwitchToggle } from '../common/SwitchToggle';
import APIServices from '../../services/ApiServices';
import Skeleton from '../common/Skeleton';

const NotificationSettings = () => {
  const ApiServ = new APIServices();
  const shopify = useAppBridge();

  const [staffEnabled, setStaffEnabled] = useState(false);
  const [staffEmail, setStaffEmail] = useState('');
  const [customerEnabled, setCustomerEnabled] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastActive, setToastActive] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await ApiServ.getNotificationSettings();
        const settings = data.result;

        const values = {
          staffEnabled: settings.enableStaffNotification || false,
          staffEmail: settings.staffEmail || '',
          customerEnabled: settings.enableCustomerNotification || false,
          customerEmail: settings.customerSenderEmail || '',
        };

        setStaffEnabled(values.staffEnabled);
        setStaffEmail(values.staffEmail);
        setCustomerEnabled(values.customerEnabled);
        setCustomerEmail(values.customerEmail);
        setInitialValues(values);
      } catch (error) {
        setError('Failed to fetch notification settings');
        setToastActive(true);
        console.error('Error fetching notification settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle save action
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    const payload = {
      enableStaffNotification: staffEnabled,
      staffEmail: staffEmail || '',
      enableCustomerNotification: customerEnabled,
      customerSenderEmail: customerEmail || '',
    };

    try {
      const result = await ApiServ.UpdateNotificationSettings(payload);
      if (result.status) {
        setInitialValues({
          staffEnabled,
          staffEmail,
          customerEnabled,
          customerEmail,
        });
        setSuccess('Notification settings saved successfully.');
        shopify.saveBar.hide('notification-save-bar');
      } else {
        throw new Error(result.message || 'Failed to save settings');
      }
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
      setToastActive(true);
    }
  }, [staffEnabled, staffEmail, customerEnabled, customerEmail]);

  // Handle discard action
  const handleDiscard = useCallback(() => {
    setStaffEnabled(initialValues.staffEnabled || false);
    setStaffEmail(initialValues.staffEmail || '');
    setCustomerEnabled(initialValues.customerEnabled || false);
    setCustomerEmail(initialValues.customerEmail || '');
    shopify.saveBar.hide('notification-save-bar');
  }, [initialValues]);

  // Determine if there are unsaved changes
  const isDirty =
    staffEnabled !== initialValues.staffEnabled ||
    staffEmail !== initialValues.staffEmail ||
    customerEnabled !== initialValues.customerEnabled ||
    customerEmail !== initialValues.customerEmail;

  // Show/hide save bar based on isDirty
  useEffect(() => {
    if (isDirty) {
      shopify.saveBar.show('notification-save-bar');
    } else {
      shopify.saveBar.hide('notification-save-bar');
    }
  }, [isDirty]);

  // Toast markup for success/error
  const toastMarkup = toastActive && (success || error) && (
    <Toast
      content={success || error}
      error={!!error}
      onDismiss={() => {
        setSuccess('');
        setError('');
        setToastActive(false);
      }}
    />
  );

 if (loading) {
     return (
         <Skeleton/>
     );
   }

  return (
    <Frame>
      <SaveBar id="notification-save-bar">
        <button onClick={handleDiscard} >Discard</button>
        <button
          variant="primary"
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          {...(isSaving ? { loading: "true" } : {})}
        >
          Save
        </button>
      </SaveBar>
      <Box>
        <Layout>
          <Layout.Section variant="oneThird">
            <Box paddingBlockStart="300">
              <Text variant="headingMd" as="h2">
                Staff email notification settings
              </Text>
            </Box>
            <Text variant="bodyMd" as="p">
              Set up the email addresses that will receive notifications when a
              customer submits a quote.
            </Text>
          </Layout.Section>

          <Layout.Section>
            <Card sectioned>
              <Text variant="bodyLg" fontWeight="semibold">
                Enable staff email notifications
              </Text>
              <Box paddingBlockStart="300" paddingBlockEnd="300">
                <Checkbox
                  label="Email notifications are sent out when customers make important changes to their orders."
                  checked={staffEnabled}
                  onChange={setStaffEnabled}
                />
              </Box>
              <TextField
                label="Send notifications from"
                placeholder="Enter emails..."
                value={staffEmail}
                onChange={setStaffEmail}
                disabled={!staffEnabled}
                helpText="If field is blank, your Shopify store email will be used"
              />
            </Card>
          </Layout.Section>
        </Layout>

        <Box paddingBlockStart="400">
          <Layout>
            <Layout.Section variant="oneThird">
              <Box paddingBlockStart="300">
                <Text variant="headingMd" as="h2">
                  Customer email notification settings
                </Text>
              </Box>
            </Layout.Section>

            <Layout.Section>
              <Card sectioned>
                <Text variant="bodyLg" fontWeight="semibold">
                  Enable customer email notifications
                </Text>
                <Box paddingBlockStart="300">
                  <Checkbox
                    label="Send notification to customers"
                    checked={customerEnabled}
                    onChange={setCustomerEnabled}
                  />
                  <TextField
                    label="Send notifications from"
                    placeholder="Enter sender email"
                    value={customerEmail}
                    onChange={setCustomerEmail}
                    disabled={!customerEnabled}
                    helpText="If field is blank, your Shopify store email will be used"
                  />
                </Box>
              </Card>
            </Layout.Section>
          </Layout>
        </Box>
      </Box>
      {toastMarkup}
    </Frame>
  );
};

export default NotificationSettings;