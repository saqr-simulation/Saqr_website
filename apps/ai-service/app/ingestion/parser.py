import re
from pathlib import Path
from app.ingestion.models import DocumentChunk


def read_document(file_path: Path | str) -> str:
    """Read raw text from a document file."""
    path = Path(file_path)
    if not path.is_file():
        raise FileNotFoundError(f"Document file not found at: {file_path}")
    return path.read_text(encoding="utf-8")


def clean_text(text: str) -> str:
    """Normalize whitespace and remove excessive blank lines."""
    text = re.sub(r"\n{3,}", "\n\n", text)
    lines = [line.strip() for line in text.split("\n")]
    return "\n".join(lines).strip()


def chunk_markdown(
    text: str,
    document_id: str,
    document_title: str,
    max_chunk_chars: int = 1000,
    overlap_chars: int = 150,
) -> list[DocumentChunk]:
    """
    Split markdown text into coherent chunks based on hierarchical section headers (## and ###)
    and paragraphs. Preserves parent header context for sub-sections.
    """
    cleaned = clean_text(text)
    header_pattern = re.compile(r"^(#{2,3}\s+.+)$", re.MULTILINE)
    splits = header_pattern.split(cleaned)

    sections: list[tuple[str, str]] = []
    current_h2 = "Introduction"

    idx = 0
    if splits:
        first_part = splits[0].strip()
        if first_part and not header_pattern.match(first_part):
            sections.append((current_h2, first_part))
            idx = 1

    while idx < len(splits):
        header_line = splits[idx].strip()
        content = splits[idx + 1].strip() if idx + 1 < len(splits) else ""

        if header_line.startswith("### "):
            sub_title = re.sub(r"^###\s*", "", header_line)
            full_section_title = f"{current_h2} > {sub_title}"
        elif header_line.startswith("## "):
            current_h2 = re.sub(r"^##\s*", "", header_line)
            full_section_title = current_h2
        else:
            full_section_title = re.sub(r"^#+\s*", "", header_line)

        if content:
            sections.append((full_section_title, content))
        idx += 2

    chunks: list[DocumentChunk] = []
    chunk_counter = 0

    for section_name, section_text in sections:
        if len(section_text) <= max_chunk_chars:
            chunk_counter += 1
            chunk_id = f"{document_id}-chk-{chunk_counter:03d}"
            source_ref = f"{document_title} > {section_name}"
            chunk_content = f"[{section_name}]\n{section_text}"
            chunks.append(
                DocumentChunk(
                    chunk_id=chunk_id,
                    document_id=document_id,
                    document_title=document_title,
                    section=section_name,
                    chunk_index=chunk_counter,
                    content=chunk_content,
                    source_ref=source_ref,
                )
            )
        else:
            paragraphs = [p.strip() for p in section_text.split("\n\n") if p.strip()]
            current_buffer: list[str] = []
            current_len = 0

            for para in paragraphs:
                if current_len + len(para) > max_chunk_chars and current_buffer:
                    chunk_counter += 1
                    chunk_id = f"{document_id}-chk-{chunk_counter:03d}"
                    body = "\n\n".join(current_buffer)
                    chunk_content = f"[{section_name}]\n{body}"
                    source_ref = f"{document_title} > {section_name} (Part {chunk_counter})"
                    chunks.append(
                        DocumentChunk(
                            chunk_id=chunk_id,
                            document_id=document_id,
                            document_title=document_title,
                            section=section_name,
                            chunk_index=chunk_counter,
                            content=chunk_content,
                            source_ref=source_ref,
                        )
                    )
                    overlap_item = current_buffer[-1] if len(current_buffer[-1]) < overlap_chars else ""
                    current_buffer = [overlap_item, para] if overlap_item else [para]
                    current_len = sum(len(p) for p in current_buffer)
                else:
                    current_buffer.append(para)
                    current_len += len(para)

            if current_buffer:
                chunk_counter += 1
                chunk_id = f"{document_id}-chk-{chunk_counter:03d}"
                body = "\n\n".join(current_buffer)
                chunk_content = f"[{section_name}]\n{body}"
                source_ref = f"{document_title} > {section_name} (Part {chunk_counter})"
                chunks.append(
                    DocumentChunk(
                        chunk_id=chunk_id,
                        document_id=document_id,
                        document_title=document_title,
                        section=section_name,
                        chunk_index=chunk_counter,
                        content=chunk_content,
                        source_ref=source_ref,
                    )
                )

    return chunks
