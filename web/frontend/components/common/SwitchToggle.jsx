
import React from 'react';
import { InlineStack, Text, Box } from '@shopify/polaris';
export function SwitchToggle({ label, checked, onChange }) {
  return (
    <InlineStack align="space-between">
      <Text>{label}</Text>
      <Box
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        style={{
          cursor: 'pointer',
          width: '40px',
          height: '22px',
          backgroundColor: checked ? '#303030' : '#dfe3e8',
          borderRadius: '4px',
          position: 'relative',
          transition: 'background-color 0.3s',
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: '4px',
            left: checked ? '20px' : '2px',
            width: '15px',
            height: '15px',
            backgroundColor: '#fff',
            borderRadius: '4px',
            transition: 'left 0.2s',
          }}
        />
      </Box>
    </InlineStack>
  );
}