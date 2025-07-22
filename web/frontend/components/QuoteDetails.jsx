import React, { useState } from 'react';
import {
  Page,
  Layout,
  Card,
  Text,
  InlineStack,
  BlockStack,
  Button,
  Tabs,
  TextField,
  Divider,
  Box,
  Badge,
  InlineGrid,
} from '@shopify/polaris';
import {
  EmailIcon,
  SendIcon,
  ProductIcon
} from '@shopify/polaris-icons';
import MakeOfferModal from '../components/Modals/MakeOfferModal';

const QuoteDetails = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const tabs = [
    { id: 'product-details', content: 'Product details' },
    { id: 'submitted-images', content: 'Submitted Images' },
  ];

  // modal function
  const handleMakeOffer = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = (offerData) => {
    console.log('Offer submitted:', offerData);
    // Add your offer submission logic here
  };
  return (
    <Page
      title="Quote Q-001"
      fullWidth
      subtitle="Manage and track all customer quote requests"
      titleMetadata={<Badge tone="info">New</Badge>}
      backAction={{ content: 'index', url: '#' }}>
      <Divider borderWidth="050" borderColor="border"
      />
      <Box paddingBlockStart="400">
        <Layout >
          <Layout.Section >
            <Card title="Customer Information" sectioned>

              <BlockStack spacing="300" gap="200">
                <Text variant="headingMd" as="h6">
                  Customer Information
                </Text>
                <Text variant="bodyMd" fontWeight="medium">Andy Jones</Text>
                <Text variant="bodyMd">Andy@example.com</Text>
                <Text variant="bodyMd">+1 (555) 123-4567</Text>
                <Text variant="bodyMd">123 Main St, New York, NY 10001</Text>
              </BlockStack>
            </Card>

            <Box paddingBlockStart="400" >
              <Card title="Quote Items">
                <Text variant="headingMd" as="h6">
                  Quote Items
                </Text>
                <Box paddingBlockStart="400" maxWidth="700px">
                  <Card>
                    <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
                      <Card sectioned>
                        {selectedTab === 0 && (
                          <BlockStack spacing="tight">
                            <InlineStack alignment="center" spacing="base" gap="100">
                              <img
                                src="https://cdn.shopify.com/s/files/1/0751/5471/8956/files/c337a7010592eba8625418372b36c21d2a40f969.png?v=1752491864"
                                alt="Black Saint Leger Backpack"
                                style={{ borderRadius: 4, maxWidth: '100px' }}
                              />
                              <BlockStack>
                                <Text variant="headingSm">Black Saint Leger Backpack</Text>
                                <Text variant="bodyMd">Condition: Good</Text>
                                <Text variant="bodyMd">
                                  Minor wear on straps, leather in excellent condition
                                </Text>
                              </BlockStack>
                            </InlineStack>
                            <BlockStack spacing="extraTight">
                              <Text variant="bodyMd">Payment type: PayPal</Text>
                              <Text variant="bodyMd">Payment status: Pending</Text>
                              <Text variant="bodyMd">Buyout offer: Pending</Text>
                            </BlockStack>
                          </BlockStack>
                        )}
                        {selectedTab === 1 && (
                          <BlockStack spacing="400">
                            <Text variant="headingSm">Bag</Text>
                            <BlockStack spacing="tight" gap="200">
                              <Text fontWeight="bold" as="h6">Black Saint Leger Backpack</Text>
                              <Text variant="bodyMd" fontWeight="medium">Condition: Good</Text>
                              <Text variant="bodyMd">
                                Minor wear on straps, leather in excellent condition
                              </Text>
                            </BlockStack>
                            <Box paddingBlockStart="400" paddingBlockEnd="400">
                              <Divider borderWidth="050" borderColor="border" />
                            </Box>

                            <Box paddingBlockEnd="400">
                              <Text variant="headingSm">Customer Submitted Images</Text>
                            </Box>


                            <InlineGrid columns={{ xs: 2, sm: 3, md: 6 }} gap="200">
                              {[
                                { label: 'Front', src: 'https://cdn.shopify.com/s/files/1/0751/5471/8956/files/c337a7010592eba8625418372b36c21d2a40f969.png?v=1752491864' },
                                { label: 'Side #1', src: 'https://cdn.shopify.com/s/files/1/0751/5471/8956/files/c337a7010592eba8625418372b36c21d2a40f969.png?v=1752491864' },
                                { label: 'Side #2', src: 'https://cdn.shopify.com/s/files/1/0751/5471/8956/files/c337a7010592eba8625418372b36c21d2a40f969.png?v=1752491864' },
                                { label: 'Back', src: 'https://cdn.shopify.com/s/files/1/0751/5471/8956/files/c337a7010592eba8625418372b36c21d2a40f969.png?v=1752491864' },
                                { label: 'Interior', src: 'https://cdn.shopify.com/s/files/1/0751/5471/8956/files/c337a7010592eba8625418372b36c21d2a40f969.png?v=1752491864' },
                              ].map(({ label, src }) => (
                                <BlockStack spacing="100" key={label} alignment="center">
                                  <Text variant="bodySm" alignment="center">{label}</Text>
                                  <img
                                    src={src}
                                    alt={label}
                                    style={{
                                      borderRadius: 8,
                                      border: '1px dashed #EBEBEB',
                                      padding: 4,
                                      width: 80,
                                      height: 80,
                                      objectFit: 'cover',
                                      backgroundColor: '#f9fafb',
                                    }}
                                  />
                                </BlockStack>
                              ))}
                            </InlineGrid>
                          </BlockStack>
                        )}

                      </Card>
                    </Tabs>
                  </Card>
                </Box>
              </Card>
            </Box>


          </Layout.Section>

          <Layout.Section variant="oneThird">
            <Card title="Quick Actions" sectioned>
              <InlineStack spacing="tight" wrap={false} gap="400">
                <Button icon={EmailIcon} variant="primary" onClick={handleMakeOffer}>Make Offer</Button>
                <Button icon={SendIcon} variant="primary">Resend Offer</Button>
                <Button icon={ProductIcon} variant="primary">Edit Offer</Button>
              </InlineStack>
            </Card>
            <Box paddingBlockStart="400">
              <Card title="Internal Notes">
                <BlockStack gap="400">
                  {/* Scrollable container for messages */}
                  <div style={{
                    maxHeight: '400px', // Set your desired max height
                    overflowY: 'auto', // Enable vertical scrolling
                    paddingRight: '8px' // Add some padding to prevent scrollbar overlap
                  }}>
                    <BlockStack gap="400">
                      <Card sectioned background="bg-surface-secondary">
                        <BlockStack spacing="tight">
                          <Text variant="bodyMd" fontWeight="medium">Alice Johnson</Text>
                          <Text variant="bodyMd">
                            Hi, I would like to get a quote for these items. The bag has some minor wear on the straps but the leather is in excellent condition and all zippers work perfectly.
                          </Text>
                        </BlockStack>
                      </Card>
                      <Card sectioned background="bg-surface-secondary">
                        <BlockStack spacing="tight" background="bg-surface-secondary">
                          <Text variant="bodyMd" fontWeight="medium">John Merchant</Text>
                          <Text variant="bodyMd">
                            Thank you for your request! I've reviewed the bag and prepared a comprehensive quote. The bag looks to be in good condition based on your photos.
                          </Text>
                        </BlockStack>
                      </Card>
                      <Card sectioned background="bg-surface-secondary">
                        <BlockStack spacing="tight" background="bg-surface-secondary">
                          <Text variant="bodyMd" fontWeight="medium">Alice Johnson</Text>
                          <Text variant="bodyMd">
                            Hi, I would like to get a quote for these items. The bag has some minor wear on the straps but the leather is in excellent condition and all zippers work perfectly.
                          </Text>
                        </BlockStack>
                      </Card>
                    </BlockStack>
                  </div>

                  {/* Fixed position text field */}
                  <Box paddingBlockStart="400">

                    <TextField
                      value={message}
                      onChange={setMessage}
                      multiline={4}
                      autoComplete="off"
                      placeholder="Type your message..."
                    />
                    <Box paddingBlockStart="400">
                      <Button variant='primary'>Submit</Button>

                    </Box>
                  </Box>
                </BlockStack>
              </Card>
            </Box>

          </Layout.Section>
        </Layout>
      </Box>

      {/*model */}
      <MakeOfferModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </Page>
  );
};

export default QuoteDetails;