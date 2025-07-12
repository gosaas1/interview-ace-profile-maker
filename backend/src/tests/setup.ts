import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { PDFDocument, StandardFonts } from 'pdf-lib';

// Load environment variables from .env file
dotenv.config();

async function createTestFiles() {
  // Create test files directory if it doesn't exist
  const testFilesDir = path.join(__dirname, '../../test-files');
  if (!fs.existsSync(testFilesDir)) {
    fs.mkdirSync(testFilesDir, { recursive: true });
  }

  // Create a sample PDF file if it doesn't exist
  const samplePdfPath = path.join(testFilesDir, 'sample-cv.pdf');
  if (!fs.existsSync(samplePdfPath)) {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.addPage([612, 792]); // US Letter size
    const { height } = page.getSize();
    
    page.drawText('Sample CV Content', {
      x: 50,
      y: height - 50,
      size: 20,
      font,
    });

    page.drawText('Name: John Doe', {
      x: 50,
      y: height - 100,
      size: 12,
      font,
    });

    page.drawText('Email: john@example.com', {
      x: 50,
      y: height - 120,
      size: 12,
      font,
    });

    page.drawText('Experience:', {
      x: 50,
      y: height - 160,
      size: 14,
      font,
    });

    page.drawText('- Software Engineer at XYZ', {
      x: 50,
      y: height - 180,
      size: 12,
      font,
    });

    page.drawText('- Developer at ABC', {
      x: 50,
      y: height - 200,
      size: 12,
      font,
    });

    page.drawText('Education:', {
      x: 50,
      y: height - 240,
      size: 14,
      font,
    });

    page.drawText('- BS Computer Science', {
      x: 50,
      y: height - 260,
      size: 12,
      font,
    });

    page.drawText('Skills:', {
      x: 50,
      y: height - 300,
      size: 14,
      font,
    });

    page.drawText('- JavaScript', {
      x: 50,
      y: height - 320,
      size: 12,
      font,
    });

    page.drawText('- TypeScript', {
      x: 50,
      y: height - 340,
      size: 12,
      font,
    });

    page.drawText('- Node.js', {
      x: 50,
      y: height - 360,
      size: 12,
      font,
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(samplePdfPath, pdfBytes);
  }

  // Create an invalid file if it doesn't exist
  const invalidFilePath = path.join(testFilesDir, 'invalid.txt');
  if (!fs.existsSync(invalidFilePath)) {
    fs.writeFileSync(invalidFilePath, 'This is not a valid CV file');
  }
}

// Set Jest timeout
jest.setTimeout(30000);

// Create test files before running tests
createTestFiles().catch(console.error); 