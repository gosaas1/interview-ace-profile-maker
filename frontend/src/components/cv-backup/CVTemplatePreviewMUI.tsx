import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function CVTemplatePreviewMUI({ templateId }: { templateId: string }) {
  const theme = useTheme();
  // Ensure borderRadius is a number for arithmetic
  const borderRadius = typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : 16;
  return (
    <Card
      sx={{
        borderRadius,
        boxShadow: 8,
        minHeight: 600,
        minWidth: 420,
        maxWidth: 600,
        mx: 'auto',
        my: 2,
        background: theme.palette.background.paper,
        // Placeholder for animation/3D effect
        transform: 'perspective(1200px) rotateY(0deg)',
        transition: 'transform 0.3s',
      }}
    >
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={500}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            CV Preview (Template: {templateId})
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: 400,
              bgcolor: theme.palette.grey[100],
              borderRadius: theme.shape.borderRadius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: theme.palette.text.secondary,
              boxShadow: 2,
            }}
          >
            [Live preview will render here]
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
} 