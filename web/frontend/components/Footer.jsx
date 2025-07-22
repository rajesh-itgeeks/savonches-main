import { Box, Text } from '@shopify/polaris';

export default function Footer() {
  return (
    // <Box
    //   as="div"
    //   padding="400"
    //   background="bg"
    //   position="fixed"
    //   bottom="0"
    //   width="100%"
    //   zIndex="5"
    //   borderBlockStart="100"
    //   style={{ textAlign: 'center' }}
    //   paddingBlockStart="600"
    // >
    //   <Text variant="bodySm" tone="subdued">
    //     © All rights reserved | savonches | 2025
    //   </Text>
    // </Box>

    <Box
  as="div"
 
  style={{
    backgroundColor: '#ffffff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 5,
    textAlign: 'center',
    borderTop: '1px solid #ddd',
    padding:"10px"

  }}
>
  <Text variant="bodyMd" tone="subdued">
    © All rights reserved | savonches | 2025
  </Text>
</Box>
  );
}
