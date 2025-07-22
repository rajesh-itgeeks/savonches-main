import { BlockStack, Box, Card, InlineGrid, SkeletonBodyText, SkeletonDisplayText } from "@shopify/polaris";

export default function Skeleton() {
    return (
        <>
            <Box>
                <BlockStack gap="400">
                    <Box>
                        <InlineGrid gap="400" columns={['oneThird', 'twoThirds']}>
                            <Box paddingBlockStart="400">
                                <SkeletonBodyText />
                            </Box>
                            <Box>
                                <Card>
                                    <BlockStack gap="400">
                                        <SkeletonDisplayText size="medium" />
                                        <SkeletonBodyText />    
                                    </BlockStack>                                    
                                </Card>
                            </Box>
                        </InlineGrid>
                    </Box>
                    <Box>
                        <InlineGrid gap="400" columns={['oneThird', 'twoThirds']}>
                            <Box paddingBlockStart="400">
                                <SkeletonBodyText />
                            </Box>
                            <Box>
                                <Card>
                                    <BlockStack gap="400">
                                        <SkeletonDisplayText size="medium" />
                                        <SkeletonBodyText />    
                                    </BlockStack>                                    
                                </Card>
                            </Box>
                        </InlineGrid>
                    </Box>
                    {/* <Box>
                        <InlineGrid gap="400" columns={['oneThird', 'twoThirds']}>
                            <Box paddingBlockStart="400">
                                <SkeletonBodyText />
                            </Box>
                            <Box>
                                <Card>
                                    <BlockStack gap="400">
                                        <SkeletonDisplayText size="medium" />
                                        <SkeletonBodyText />    
                                    </BlockStack>                                    
                                </Card>
                            </Box>
                        </InlineGrid>
                    </Box> */}
                    
                </BlockStack>
            </Box>
        </>
    )
}