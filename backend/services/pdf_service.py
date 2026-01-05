from pypdf import PdfReader
from io import BytesIO


def extract_text_from_pdf(file_content: bytes) -> tuple[str, int]:
    """
    Extract text from PDF file content.
    
    Args:
        file_content: Raw PDF file bytes
        
    Returns:
        Tuple of (extracted_text, page_count)
    """
    try:
        pdf_file = BytesIO(file_content)
        reader = PdfReader(pdf_file)
        
        page_count = len(reader.pages)
        text_parts = []
        
        for page in reader.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
        
        full_text = "\n\n".join(text_parts)
        
        return full_text, page_count
        
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")
