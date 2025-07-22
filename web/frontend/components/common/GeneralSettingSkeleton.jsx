import { BlockStack, Box, Card, InlineGrid, SkeletonBodyText, SkeletonDisplayText } from "@shopify/polaris";

export default function GeneralSettingSkeleton() {
    return (
        <>
            <Box>
                <BlockStack gap="400">
                    <Box>
                        <InlineGrid gap="400" columns={['oneThird', 'twoThirds']}>
                          <Card>
                                    <BlockStack gap="400">
                                        <SkeletonDisplayText size="medium" />
                                        <SkeletonBodyText />   
                                        <SkeletonDisplayText size="medium" />
                                        <SkeletonBodyText />  
                                        <SkeletonDisplayText size="medium" />
                                        <SkeletonBodyText />   
                                    </BlockStack>                                    
                                </Card>
                            <Box>
                                <Card>
                                    <BlockStack gap="400">
                                        <SkeletonDisplayText size="medium" />
                                        <SkeletonBodyText />   
                                        <SkeletonDisplayText size="medium" />
                                        <SkeletonBodyText />  
                                        <SkeletonDisplayText size="medium" />
                                        <SkeletonBodyText />   
                                    </BlockStack>                                    
                                </Card>
                            </Box>
                        </InlineGrid>
                    </Box>
                    <Box>
                        {/* <InlineGrid gap="400" columns={['oneThird', 'twoThirds']}>
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
                        </InlineGrid> */}
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