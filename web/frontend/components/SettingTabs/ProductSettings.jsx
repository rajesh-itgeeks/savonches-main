import React, { useEffect, useRef, useState } from 'react';
import {
    Page,
    Card,
    Button,
    Modal,
    TextField,
    Checkbox,
    Layout,
    Icon,
    IndexTable,
    useIndexResourceState,
    Text,
    BlockStack,
    InlineStack,
    Box,
    Frame,
    SkeletonBodyText,
    Badge,
    Spinner,
} from '@shopify/polaris';
import { DeleteIcon, EditIcon } from '@shopify/polaris-icons';
import APIServices from '../../services/ApiServices';
import { useToast } from '../CustomHooks/useToast';
import ToastMessage from '../common/ToastMessage';

const ProductSettings = () => {
    const ApiServ = new APIServices();
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [typeName, setTypeName] = useState('');
    const [typeImages, setTypeImages] = useState([{ label: '', isRequired: false }]);
    const [editId, setEditId] = useState(null);
    const [formErrors, setFormErrors] = useState({
        typeName: '',
        typeImages: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusLastLabel, setFocusLastLabel] = useState(false);
    const [deletingIds, setDeletingIds] = useState(new Set()); // Track IDs being deleted

    const {
        toastActive,
        success,
        error,
        showError,
        showSuccess,
        dismiss,
    } = useToast();

    const resetForm = () => {
        setTypeName('');
        setTypeImages([{ label: '', isRequired: false }]);
        setEditId(null);
        setFormErrors({ typeName: '', typeImages: [] });
    };

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const result = await ApiServ.getProductSettings({});
            if (result.status) {
                setSettings(result.result || []);
            } else {
                throw new Error(result.message || 'Failed to load settings');
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

    // Reset the label focus after render
    useEffect(() => {
        if (focusLastLabel) {
            setFocusLastLabel(false);
        }
    }, [focusLastLabel]);

    const handleAddImageField = () => {
        setTypeImages((prev) => [...prev, { label: '', isRequired: false }]);
        setFocusLastLabel(true); // Trigger autofocus for the last label
    };

    const handleImageChange = (index, field, value) => {
        const updatedImages = [...typeImages];
        updatedImages[index][field] = value;
        setTypeImages(updatedImages);
    };

    const handleSubmit = async () => {
        const errors = {
            typeName: '',
            typeImages: [],
        };

        let hasError = false;

        if (!typeName.trim()) {
            errors.typeName = 'Type Name is required';
            hasError = true;
        }

        const imageErrors = typeImages.map((img) => {
            if (!img.label.trim()) {
                hasError = true;
                return 'Label is required';
            }
            return '';
        });

        errors.typeImages = imageErrors;

        if (hasError) {
            setFormErrors(errors);
            return;
        }

        setIsSubmitting(true);

        const payload = { typeName, typeImages };

        try {
            const result = editId
                ? await ApiServ.UpdateProductTypeSettings(editId, payload)
                : await ApiServ.AddProductTypeSettings(payload);

            if (result.status) {
                showSuccess(editId ? 'Product Type updated' : 'Product Type added');
                resetForm();
                setModalOpen(false);
                fetchSettings();
            } else {
                throw new Error(result.message || 'Operation failed');
            }
        } catch (err) {
            showError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        setDeletingIds((prev) => new Set(prev).add(id)); // Start loading for this ID
        try {
            const result = await ApiServ.DeleteProductTypeSettings(id);
            if (result.status) {
                showSuccess('Product Type deleted');
                fetchSettings();
            } else {
                throw new Error(result.message || 'Delete failed');
            }
        } catch (err) {
            showError(err.message);
        } finally {
            setDeletingIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            }); // Stop loading for this ID
        }
    };

    const handleEdit = (setting) => {
        setTypeName(setting.typeName);
        setTypeImages(setting.typeImages || []);
        setEditId(setting._id);
        setModalOpen(true);
    };

    const handleRemoveImageField = (index) => {
        if (index === 0) return; // Prevent deletion of first label
        const updated = [...typeImages];
        updated.splice(index, 1);
        setTypeImages(updated);
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(settings);

    return (
        <Frame>
            <Layout>
                <Layout.Section>
                    <Box paddingBlockEnd="300">
                        <InlineStack align="end">
                            <Button variant="primary" onClick={() => setModalOpen(true)}>
                                Add Product Type
                            </Button>
                        </InlineStack>
                    </Box>

                    <Card padding="0">
                        <BlockStack gap="200">
                            {loading ? (
                                <Card padding="300">
                                    <SkeletonBodyText lines={9} />
                                </Card>
                            ) : (
                                <IndexTable
                                    resourceName={{ singular: 'type', plural: 'types' }}
                                    itemCount={settings.length}
                                    selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                                    onSelectionChange={handleSelectionChange}
                                    selectable={false}
                                    headings={[
                                        { title: 'SNO' },
                                        { title: 'Type Name' },
                                        { title: 'Images' },
                                        { title: 'Actions' },
                                    ]}
                                >
                                    {settings.map((item, index) => (
                                        <IndexTable.Row
                                            id={item._id}
                                            key={item._id}
                                            selected={selectedResources.includes(item._id)}
                                            position={index}
                                        >
                                            <IndexTable.Cell>
                                                <Text as="span">{index + 1}</Text>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Text as="span" fontWeight="semibold">
                                                    {item.typeName}
                                                </Text>
                                            </IndexTable.Cell>

                                            <IndexTable.Cell>
                                                <Box as="div" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '8px', columnGap: '4px' }}>
                                                    {item.typeImages?.map((img, i) => (
                                                        <React.Fragment key={i}>
                                                            <Text as="span" breakWord>
                                                                {img.label}
                                                            </Text>
                                                            <Box width="22px">
                                                                <Badge tone={img.isRequired ? 'success' : ''}>
                                                                    {img.isRequired ? 'Required' : 'Optional'}
                                                                </Badge>
                                                            </Box>
                                                        </React.Fragment>
                                                    ))}
                                                </Box>
                                            </IndexTable.Cell>

                                            <IndexTable.Cell>
                                                <InlineStack gap="200">
                                                    <Button
                                                        icon={<Icon source={EditIcon} tone="base" />}
                                                        onClick={() => handleEdit(item)}
                                                    />
                                                    <Button
                                                        icon={deletingIds.has(item._id) ? <Spinner size="small" /> : <Icon source={DeleteIcon} tone="critical" />}
                                                        onClick={() => handleDelete(item._id)}
                                                        disabled={deletingIds.has(item._id)}
                                                    />
                                                </InlineStack>
                                            </IndexTable.Cell>
                                        </IndexTable.Row>
                                    ))}
                                </IndexTable>
                            )}
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>

            <Modal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    resetForm();
                }}
                title={editId ? 'Edit Product Type' : 'Add Product Type'}
                primaryAction={{
                    content: editId ? 'Update' : 'Add',
                    onAction: handleSubmit,
                    disabled: isSubmitting,
                    loading: isSubmitting,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => {
                            setModalOpen(false);
                            resetForm();
                        },
                    },
                ]}
            >
                <Modal.Section>
                    <BlockStack gap="300">
                        <TextField
                            label="Type Name"
                            value={typeName}
                            onChange={(val) => {
                                setTypeName(val);
                                setFormErrors((prev) => ({ ...prev, typeName: '' }));
                            }}
                            autoComplete="off"
                            error={formErrors.typeName}
                            autoFocus={!focusLastLabel}
                        />

                        <BlockStack gap="200">
                            {typeImages.map((img, idx) => (
                                <InlineStack key={idx} gap="300" >
                                    <Box width="70%">
                                        <TextField
                                            label={`Label ${idx + 1}`}
                                            value={img.label}
                                            onChange={(val) => {
                                                handleImageChange(idx, 'label', val);
                                                setFormErrors((prev) => {
                                                    const updatedErrors = [...prev.typeImages];
                                                    updatedErrors[idx] = '';
                                                    return { ...prev, typeImages: updatedErrors };
                                                });
                                            }}
                                            autoComplete="off"
                                            labelHidden
                                            placeholder={`Label ${idx + 1}`}
                                            error={formErrors.typeImages[idx]}
                                            autoFocus={focusLastLabel && idx === typeImages.length - 1}
                                        />
                                    </Box>
                                    <Checkbox
                                        label="Required"
                                        checked={img.isRequired}
                                        onChange={(val) => handleImageChange(idx, 'isRequired', val)}
                                    />
                                    <Button
                                        variant="plain"
                                        tone="critical"
                                        icon={<Icon source={DeleteIcon} tone="critical" />}
                                        onClick={() => handleRemoveImageField(idx)}
                                        accessibilityLabel={`Remove field ${idx + 1}`}
                                        disabled={idx === 0} // Disable delete for first label
                                    />
                                </InlineStack>
                            ))}
                            <Box paddingBlockStart="200">
                                <Button fullWidth onClick={handleAddImageField}>
                                    Add More
                                </Button>
                            </Box>
                        </BlockStack>
                    </BlockStack>
                </Modal.Section>
            </Modal>

            {toastActive && (success || error) && (
                <ToastMessage
                    active={toastActive}
                    content={success || error}
                    error={!!error}
                    onDismiss={dismiss}
                />
            )}
        </Frame>
    );
};

export default ProductSettings;