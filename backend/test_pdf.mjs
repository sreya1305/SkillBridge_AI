import { PDFParse } from 'pdf-parse'

console.log('PDFParse class imported successfully:', typeof PDFParse === 'function')

async function testPdf() {
  try {
    // Dummy 1-page PDF Uint8Array header
    const dummyPdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF')
    const parser = new PDFParse({ data: dummyPdfBuffer })
    const result = await parser.getText()
    console.log('Extracted PDF Text length:', result.text.length)
    console.log('✅ PDFParse works perfectly!')
  } catch (err) {
    console.error('PDFParse Error:', err.message)
  }
}

testPdf()
