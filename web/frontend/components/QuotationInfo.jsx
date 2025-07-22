import React, { useState } from 'react';
import {
  Card,
  Page,
  Text,
  Layout,
  Tabs,
  InlineStack  ,
  Button,
  BlockStack  ,
} from '@shopify/polaris';

const QuotationInfo = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    {
      id: 'product-details',
      content: 'Product details',
      panelID: 'product-details-content',
    },
    {
      id: 'submitted-images',
      content: 'Submitted Images',
      panelID: 'submitted-images-content',
    },
  ];

  return (
    <Page title="Quote Review">
      <Layout>
        {/* Customer Info */}
        <Layout.Section>
          <Card title="Customer Information" sectioned>
            <Text variant="bodyMd" fontWeight="medium">Andy Jones</Text>
            <Text variant="bodyMd">Andy@example.com</Text>
            <Text variant="bodyMd">+1 (555) 123-4567</Text>
            <Text variant="bodyMd">123 Main St, New York, NY 10001</Text>
          </Card>
        </Layout.Section>

        {/* Quote Items */}
        <Layout.Section oneHalf>
          <Card title="Quote Items">
            <Tabs
              tabs={tabs}
              selected={selectedTab}
              onSelect={setSelectedTab}
            >
              <Card.Section>
                {selectedTab === 0 && (
                  <InlineStack   alignment="center" spacing="loose">
                    <img
                      src="https://via.placeholder.com/100x120.png?text=Bag"
                      alt="Backpack"
                      style={{ borderRadius: 4 }}
                    />
                    <InlineStack   vertical spacing="tight">
                      <Text variant="headingSm">Black Saint Leger Backpack</Text>
                      <Text variant="bodyMd">Condition: Good</Text>
                      <Text variant="bodyMd">
                        Minor wear on straps, leather in excellent condition
                      </Text>
                      <Text variant="bodyMd">Payment type: Paypal</Text>
                      <Text variant="bodyMd">Payment status: Pending</Text>
                      <Text variant="bodyMd">Buyout offer: Pending</Text>
                    </InlineStack  >
                  </InlineStack  >
                )}
                {selectedTab === 1 && (
                  <Text variant="bodyMd">Submitted images will appear here.</Text>
                )}
              </Card.Section>
            </Tabs>
          </Card>
        </Layout.Section>

        {/* Quick Actions and Internal Notes */}
        <Layout.Section oneHalf>
          <Card title="Quick Actions" sectioned>
            <InlineStack   spacing="tight">
              <Button>Make Offer</Button>
              <Button>Resend Offer</Button>
              <Button>Edit Offer</Button>
            </InlineStack  >
          </Card>

          <Card title="Internal Notes">
            <Card.Section>
              <BlockStack   spacing="tight">
                <Text variant="bodyMd" fontWeight="medium">Alice Johnson</Text>
                <Text variant="bodyMd">
                  Hi, I would like to get a quote for these items. The bag has some minor wear on the straps but the leather is in excellent condition and all zippers work perfectly.
                </Text>
              </BlockStack  >
            </Card.Section>
            <Card.Section>
              <BlockStack   spacing="tight">
                <Text variant="bodyMd" fontWeight="medium">John Merchant</Text>
                <Text variant="bodyMd">
                  Thank you for your request! I've reviewed the bag and prepared a comprehensive quote. The bag looks to be in good condition based on your photos.
                </Text>
              </BlockStack  >
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default QuotationInfo;
