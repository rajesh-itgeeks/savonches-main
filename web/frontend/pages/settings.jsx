import React, { useState, useCallback } from 'react';
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
} from '@shopify/polaris';
import { BookIcon, CashDollarIcon, ClockIcon, NotificationIcon, PersonIcon, PlusCircleIcon, PlusIcon, SendIcon, ToggleOffIcon, ToggleOnIcon, XCircleIcon } from '@shopify/polaris-icons';
import { SwitchToggle } from '../components/common/SwitchToggle.jsx';
import GeneralSettings from '../components/SettingTabs/GeneralSettings';
import EmailSettings from '../components/SettingTabs/EmailSettings.jsx';
import NotificationSettings from '../components/SettingTabs/NotificationSettings.jsx';
import ProductSettings from '../components/SettingTabs/ProductSettings.jsx';
import DesignSettings from '../components/SettingTabs/DesignSettings.jsx';

const Settings = () => {
  // notifictaion stata
  // email state

  // email functions

  // tab
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { id: 'general', content: 'General' },
    { id: 'emailTemplates', content: 'Email Templates' },
    { id: 'notifications', content: 'Notifications' },
    { id: 'ProductSetting', content: 'ProductSetting' },
     { id: 'DesignSetting', content: 'DesignSetting' },

  ];

  const handleTabChange = useCallback((selectedTabIndex) => setSelectedTab(selectedTabIndex), []);

  // Form state
  

  return (
    <Page fullWidth title="Settings" subtitle="Configure your quote management system">
      <Divider borderWidth="050" borderColor="border" />
      <Box paddingBlockStart="400">
        <Card padding="200">
          <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange} />
        </Card>
        

        <div style={{ marginTop: '20px' }}>
          {selectedTab === 0 && (
          <GeneralSettings/>
          )}

          {selectedTab === 1 && (
         <EmailSettings/>
          )}

          {selectedTab === 2 && (
          <NotificationSettings/>

          )}
          {selectedTab === 3 && (
          <ProductSettings/>

          )}
           {selectedTab === 4 && (
          <DesignSettings/>

          )}
        </div>
      </Box>
    </Page>
  );
};

export default Settings;
