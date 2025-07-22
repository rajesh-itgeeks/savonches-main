import React, { useState, useEffect, useCallback } from 'react';
import { Page, Card, Button, Modal, TextField, InlineStack, Text, BlockStack, Layout, Frame, Box, SkeletonPage, SkeletonDisplayText, InlineGrid, Icon } from '@shopify/polaris';
import { ViewIcon, DeleteIcon } from '@shopify/polaris-icons';
import APIServices from '../../services/ApiServices';
import ToastMessage from '../common/ToastMessage';
import { useToast } from '../CustomHooks/useToast';

// Function to chunk array into groups of 2 (though not used for fixed rows anymore)

const DesignSettings = () => {
  const api = new APIServices();
  const { toastActive, success, error, showSuccess, showError, dismiss } = useToast();
  const [designs, setDesigns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [designerName, setDesignerName] = useState('');
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // Renamed from error to avoid conflict with toast error
  const [loading, setLoading] = useState(false);
  console.log("----designs", designs);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        setLoading(true);
        const result = await api.getDesignList({});
        setDesigns(result.result || []);
      } catch (err) {
        showError('Failed to fetch designs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  const handleAddDesign = useCallback(async () => {
    if (!designerName.trim()) {
      setErrorMessage('Designer name cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const data = { designerName };
      const result = await api.AddDesign(data);
      if (result.status) {
        setDesigns([...designs, { designerName, _id: result.id }]);
        setIsModalOpen(false);
        setDesignerName('');
        setErrorMessage(null);
        showSuccess('Design added successfully.');
      } else {
        showError('Failed to add design');
      }
    } catch (err) {
      showError('Failed to add design');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [designerName, designs, showSuccess, showError]);

  const handleEditDesign = useCallback(async () => {
    if (!designerName.trim()) {
      setErrorMessage('Designer name cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const data = { designerName };
      const result = await api.UpdateDesign(editId, data);
      if (result.status) {
        const updatedDesigns = designs.map((design) =>
          design._id === editId ? { ...design, designerName } : design
        );
        setDesigns(updatedDesigns);
        setIsEditModalOpen(false);
        setDesignerName('');
        setEditId(null);
        setErrorMessage(null);
        showSuccess('Design updated successfully.');
      } else {
        showError('Failed to update design');
      }
    } catch (err) {
      showError('Failed to update design');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [designerName, designs, editId, showSuccess, showError]);

  const handleDeleteDesign = useCallback(async (id) => {
    const design = designs.find((d) => d._id === id);
    console.log("------------id to delete", design);

    try {
      setLoading(true);
      const result = await api.DeleteDesign(id);
      if (result.status) {
        setDesigns(designs.filter((d) => d._id !== id));
        showSuccess('Design deleted successfully.');
      } else {
        showError('Failed to delete design');
      }
    } catch (err) {
      showError('Failed to delete design');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [designs, showSuccess, showError]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setDesignerName('');
    setErrorMessage(null);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setDesignerName('');
    setEditId(null);
    setErrorMessage(null);
  }, []);

  const handleDesignerNameChange = useCallback((value) => {
    setDesignerName(value);
    if (value.trim()) {
      setErrorMessage(null);
    }
  }, []);

  const toastMarkup = toastActive && (success || error) && (
    <ToastMessage
      active={toastActive}
      content={success || error}
      error={!!error}
      onDismiss={dismiss}
    />
  );

  if (loading && designs.length === 0) {
    return (
      <SkeletonPage primaryAction fullWidth>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  marginTop: '2rem',
                  flexWrap: 'wrap'
                }}
              >
                {[...Array(13)].map((_, index) => (
                  <div key={index} style={{ minWidth: '120px' }}>
                    <SkeletonDisplayText size="large" />
                  </div>
                ))}
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );
  }

  return (
    <Frame>
      <Layout>
        <Layout.Section>
          <Box paddingBlockEnd="300">
            <InlineStack align="end">
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Add Product Type
              </Button>
            </InlineStack>
          </Box>
          <Card sectioned>
            {errorMessage && <Text variant="bodyMd" color="critical">{errorMessage}</Text>}

            {designs.length > 0 ? (
              <InlineGrid columns={{ xs: 1, sm: 2, md: 3, lg: 3 }} gap="400">
                {designs.map((item) => (
                  <Card key={item._id} sectioned>
                    <InlineStack gap="200" align="space-between">
                      <Text variant="bodyMd" fontWeight="bold">
                        {item.designerName}
                      </Text>
                      <InlineStack gap="200">
                        <Button
                          icon={<Icon source={ViewIcon} />}
                          onClick={() => {
                            setDesignerName(item.designerName);
                            setEditId(item._id);
                            setIsEditModalOpen(true);
                          }}
                          tone="base"
                        />
                        <Button
                          icon={<Icon source={DeleteIcon} />}
                          tone="critical"
                          onClick={() => handleDeleteDesign(item._id)}
                        />
                      </InlineStack>
                    </InlineStack>
                  </Card>
                ))}
              </InlineGrid>
            ) : (
              <Text variant="bodyMd">No designs found.</Text>
            )}
          </Card>

          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            title="Add New Design"
            primaryAction={{
              content: 'Add',
              onAction: handleAddDesign,
              disabled: loading || !designerName.trim(),
              loading: loading,
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: handleCloseModal,
                disabled: loading,
              },
            ]}
          >
            <Modal.Section>
              <BlockStack gap="400">
                <TextField
                  label="Designer Name"
                  value={designerName}
                  onChange={handleDesignerNameChange}
                  placeholder="Enter designer name"
                  error={errorMessage}
                  disabled={loading}
                />
              </BlockStack>
            </Modal.Section>
          </Modal>

          <Modal
            open={isEditModalOpen}
            onClose={handleCloseEditModal}
            title="Edit Design"
            primaryAction={{
              content: 'Save',
              onAction: handleEditDesign,
              disabled: loading || !designerName.trim(),
              loading: loading,
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: handleCloseEditModal,
                disabled: loading,
              },
            ]}
          >
            <Modal.Section>
              <BlockStack gap="400">
                <TextField
                  label="Designer Name"
                  value={designerName}
                  onChange={handleDesignerNameChange}
                  placeholder="Enter designer name"
                  error={errorMessage}
                  disabled={loading}
                />
              </BlockStack>
            </Modal.Section>
          </Modal>
        </Layout.Section>
      </Layout>
      {toastMarkup}
    </Frame>
  );
};

export default DesignSettings;