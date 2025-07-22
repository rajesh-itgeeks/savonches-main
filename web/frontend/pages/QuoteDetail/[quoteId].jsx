import React, { useEffect, useState } from 'react';
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
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonThumbnail,
} from '@shopify/polaris';
import {
  EmailIcon,
  SendIcon,
  ProductIcon,
} from '@shopify/polaris-icons';

import MakeOfferModal from '../../components/Modals/MakeOfferModal';
import { useNavigate, useParams } from 'react-router-dom';
import APIServices from '../../services/ApiServices';
import Skeleton from '../../components/common/Skeleton';
import { getStatusTone } from '../../components/common/StatusTone';

const QuoteDetails = () => {
  const { quoteId } = useParams();
  const ApiServ = new APIServices();
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState({});

  const [selectedTab, setSelectedTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'product-details', content: 'Product details' },
    { id: 'submitted-images', content: 'Submitted Images' },
  ];

  const handleMakeOffer = () => setIsModalOpen(true);
  const handleModalSubmit = (offerData) => {
    console.log('Offer submitted:', offerData);
  };

  useEffect(() => {
    const fetchQuoteData = async () => {
      try {
        setLoading(true);
        const data = await ApiServ.getQuoteDataById(quoteId);
        setQuoteData(data?.result);
        console.log("-------quoteData", data?.result)
      } catch (err) {
        console.error('Error fetching quote data:', err);
        setError('Failed to fetch quote data.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuoteData();
  }, [quoteId]);

  return (
    <Page
      fullWidth
      title={
        loading ? (
          <SkeletonDisplayText size="medium" />
        ) : (
          `Quote ${quoteData?.quoteId}`
        )
      }
      subtitle={
        loading ? (
          <SkeletonBodyText lines={1} />
        ) : (
          'Manage and track all customer quote requests'
        )
      }
      titleMetadata={
        loading ? (
          <SkeletonBodyText lines={1} />
        ) : (
          <Badge tone={getStatusTone(quoteData?.quoteStatus)}>
            {quoteData?.quoteStatus || 'default'}
          </Badge>
        )
      }
      backAction={{
        content: 'Back to Quotes',
        onAction: () => navigate('/'),
      }}
      primaryAction={
        <InlineStack gap="200" wrap={false}>
          <Button icon={EmailIcon} variant="primary" onClick={handleMakeOffer}>
            Make Offer
          </Button>
          <Button icon={SendIcon} variant="primary">
            Resend Offer
          </Button>
          <Button icon={ProductIcon} variant="primary">
            Edit Offer
          </Button>
        </InlineStack>
      }
    >


      <Divider borderWidth="050" borderColor="border" />

      <Box paddingBlockStart="400">
        <Layout>
          <Layout.Section>
            <Card title="Customer Information" sectioned>
              {loading ? (
                <BlockStack spacing="300" gap="200">
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={2} />
                </BlockStack>
              ) : (
                <BlockStack spacing="300" gap="200">
                  <Text variant="headingMd" as="h6">
                    Customer Information
                  </Text>
                  <Text variant="bodyLg" as="p">{quoteData?.customerName}</Text>
                  <Text variant="bodyLg" as="p">{quoteData?.customerEmail}</Text>
                  <Text variant="bodyMd">{quoteData?.contactData?.defaultPhoneNumber ? quoteData?.contactData?.defaultPhoneNumber : "NULL"}</Text>
                  <Text variant="bodyMd">
                    {quoteData?.contactData?.defaultAddress
                      ? [
                        quoteData.contactData.defaultAddress.address1,
                        quoteData.contactData.defaultAddress.city,
                        quoteData.contactData.defaultAddress.provinceCode,
                        quoteData.contactData.defaultAddress.zip,
                        quoteData.contactData.defaultAddress.countryCodeV2,
                      ]
                        .filter(Boolean) // remove any null/undefined values
                        .join(', ')
                      : ''}
                  </Text>

                </BlockStack>
              )}
            </Card>

            <Box paddingBlockStart="400">
              <Card title="Quote Items">
                {loading ? (
                  <Skeleton />
                ) : (
                  <Box>
                    <Text variant="headingMd" as="h6">
                      Quote Items
                    </Text>
                    <Box paddingBlockStart="400">
                      <Card>
                        <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
                          <Card sectioned>
                            {selectedTab === 0 && (
                              <BlockStack spacing="tight">
                                <InlineStack alignment="center" spacing="base" gap="100">
                                  {/* <img
                                    src={quoteData?.images[0].url}
                                    alt="Black Saint Leger Backpack"
                                    style={{ borderRadius: 4, maxWidth: '100px' }}
                                  /> */}
                                  <BlockStack gap="300">
                                    <Text variant="bodyLg" as="p"> <strong>Designer :</strong> {quoteData?.designer}</Text>

                                    <Text variant="bodyLg" as="p"><strong>Product Title :</strong> {quoteData?.productName}</Text>
                                    {/* <Text variant="bodyMd"><strong>Condition:</strong> Good</Text> */}
                                    <Text variant="bodyLg" as="p">
                                      {quoteData?.productDetails}
                                    </Text>
                                  </BlockStack>
                                </InlineStack>
                                <Box paddingBlockStart="200">
                                <BlockStack spacing="extraTight" gap="400">
                                  <Text variant="bodyLg" as="p"> Payment type: {quoteData?.paymentType}</Text>
                                  <Text variant="bodyLg" as="p"> Payment status: {quoteData?.paymentStatus}</Text>
                                  <Text variant="bodyLg" as="p"> Buyout offer: {quoteData?.quotedOffer}</Text>
                                </BlockStack>
                                </Box>
                              </BlockStack>
                            )}

                            {selectedTab === 1 && (
                              <BlockStack gap="400">
                               <BlockStack gap="300">
                                    <Text variant="bodyLg" as="p"> <strong>Designer :</strong> {quoteData?.designer}</Text>

                                    <Text variant="bodyLg" as="p"><strong>Product Title :</strong> {quoteData?.productName}</Text>
                                    {/* <Text variant="bodyMd"><strong>Condition:</strong> Good</Text> */}
                                    <Text variant="bodyLg" as="p">
                                      {quoteData?.productDetails}
                                    </Text>
                                  </BlockStack>
                                <Box paddingBlockStart="400" paddingBlockEnd="400">
                                  <Divider borderWidth="050" borderColor="border" />
                                </Box>

                                <Box paddingBlockEnd="400">
                                  <Text variant="headingSm">Customer Submitted Images</Text>
                                </Box>

                                {/* <InlineGrid columns={{ xs: 2, sm: 3, md: 5 ,lg:5}} gap="400">
                                  {[
                                    { label: 'Front', src: quoteData?.images[0].url },
                                    { label: 'Side #1', src: quoteData?.images[0].url },
                                    { label: 'Side #2', src: quoteData?.images[0].url },
                                    { label: 'Back', src: quoteData?.images[0].url },
                                    { label: 'Interior', src: quoteData?.images[0].url },
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
                                          width: 200,
                                          height: 200,
                                          objectFit: 'cover',
                                          backgroundColor: '#f9fafb',
                                        }}
                                      />
                                    </BlockStack>
                                  ))}
                                </InlineGrid> */}
                                <InlineGrid columns={{ xs: 2, sm: 3, md: 5, lg: 5 }} gap="400">
                                  {quoteData?.images?.map(({ frameKey, name, url }, index) => (
                                    <BlockStack spacing="100" key={index} alignment="center">
                                      <Text variant="bodySm" alignment="center">
                                        {frameKey.charAt(0).toUpperCase() + frameKey.slice(1)}
                                      </Text>
                                      {!loadedImages[index] && <SkeletonThumbnail size="large" />}

                                      <img
                                        src={url}
                                        alt={name}
                                        style={{
                                          display: loadedImages[index] ? 'block' : 'none', // hide image until loaded
                                          borderRadius: 8,
                                          border: '1px dashed #EBEBEB',
                                          padding: 4,
                                          width: 200,
                                          height: 200,
                                          objectFit: 'cover',
                                          backgroundColor: '#f9fafb',
                                        }}
                                        onLoad={() =>
                                          setLoadedImages((prev) => ({
                                            ...prev,
                                            [index]: true,
                                          }))
                                        }
                                      />

                                      {/* <Text variant="bodyXs" alignment="center" tone="subdued">
        {name}
      </Text> */}
                                    </BlockStack>
                                  ))}
                                </InlineGrid>

                              </BlockStack>
                            )}
                          </Card>
                        </Tabs>
                      </Card>
                    </Box>
                  </Box>
                )}
              </Card>
            </Box>
          </Layout.Section>
        </Layout>
      </Box>

      <MakeOfferModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        quoteData={quoteData}
      />
    </Page>
  );
};

export default QuoteDetails;
