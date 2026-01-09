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


def extract_text_from_txt(file_content: bytes) -> tuple[str, int]:
    """
    Extract text from TXT file content.
    
    Args:
        file_content: Raw TXT file bytes
        
    Returns:
        Tuple of (extracted_text, page_count=1)
    """
    try:
        text = file_content.decode('utf-8')
        return text, 1
    except UnicodeDecodeError:
        # Try with different encodings
        try:
            text = file_content.decode('latin-1')
            return text, 1
        except Exception as e:
            raise Exception(f"Error decoding text file: {str(e)}")
    except Exception as e:
        raise Exception(f"Error extracting text from TXT: {str(e)}")


def extract_text_from_file(file_content: bytes, filename: str) -> tuple[str, int]:
    """
    Extract text from various file formats (PDF, TXT).
    
    Args:
        file_content: Raw file bytes
        filename: Name of the file (used to determine file type)
        
    Returns:
        Tuple of (extracted_text, page/section_count)
    """
    filename_lower = filename.lower()
    
    if filename_lower.endswith('.pdf'):
        return extract_text_from_pdf(file_content)
    elif filename_lower.endswith('.txt'):
        return extract_text_from_txt(file_content)
    else:
        raise Exception(f"Unsupported file format. Please upload PDF or TXT files.")
