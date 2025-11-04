"""
Data Ingestion Pipeline for SmartFinance AI
Processes mock documents and loads them into ChromaDB with embeddings
"""

import os
import sys
from pathlib import Path
from typing import List, Dict
from dotenv import load_dotenv

# Add app directory to path
sys.path.append(str(Path(__file__).parent))

from app.services.vector_store import vector_store
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load environment variables
load_dotenv()


class DataIngestionPipeline:
    """Pipeline for ingesting financial documents into vector database"""
    
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
        self.documents_dir = Path(__file__).parent / "data" / "mock_documents"
    
    def load_document(self, file_path: Path) -> str:
        """Load text content from a file"""
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    def chunk_document(self, text: str, source: str, doc_type: str) -> List[Dict]:
        """Split document into chunks with metadata"""
        chunks = self.text_splitter.split_text(text)
        
        return [
            {
                "text": chunk,
                "metadata": {
                    "source": source,
                    "type": doc_type,
                    "chunk_index": idx
                }
            }
            for idx, chunk in enumerate(chunks)
        ]
    
    def ingest_billing_documents(self):
        """Ingest billing and transaction documents"""
        print("Ingesting billing documents...")
        
        file_path = self.documents_dir / "billing_policies.txt"
        content = self.load_document(file_path)
        chunks = self.chunk_document(
            text=content,
            source="billing_policies.txt",
            doc_type="billing"
        )
        
        # Extract texts and metadata
        texts = [chunk["text"] for chunk in chunks]
        metadatas = [chunk["metadata"] for chunk in chunks]
        
        # Add to vector store
        vector_store.add_documents(
            collection_name="billing_documents",
            texts=texts,
            metadatas=metadatas
        )
        
        print(f"  Added {len(texts)} billing document chunks")
    
    def ingest_technical_documents(self):
        """Ingest technical support FAQs and troubleshooting guides"""
        print("Ingesting technical support documents...")
        
        # Technical FAQs
        file_path = self.documents_dir / "technical_faqs.txt"
        content = self.load_document(file_path)
        chunks = self.chunk_document(
            text=content,
            source="technical_faqs.txt",
            doc_type="technical"
        )
        
        # Savings and Goals Guide
        savings_file = self.documents_dir / "savings_and_goals.txt"
        savings_content = self.load_document(savings_file)
        savings_chunks = self.chunk_document(
            text=savings_content,
            source="savings_and_goals.txt",
            doc_type="financial_planning"
        )
        
        # Combine all chunks
        all_chunks = chunks + savings_chunks
        texts = [chunk["text"] for chunk in all_chunks]
        metadatas = [chunk["metadata"] for chunk in all_chunks]
        
        vector_store.add_documents(
            collection_name="technical_documents",
            texts=texts,
            metadatas=metadatas
        )
        
        print(f"  Added {len(texts)} technical document chunks (including savings & goals guide)")
    
    def ingest_policy_documents(self):
        """Ingest policy and compliance documents"""
        print("Ingesting policy and compliance documents...")
        
        file_path = self.documents_dir / "fraud_prevention.txt"
        content = self.load_document(file_path)
        chunks = self.chunk_document(
            text=content,
            source="fraud_prevention.txt",
            doc_type="policy"
        )
        
        texts = [chunk["text"] for chunk in chunks]
        metadatas = [chunk["metadata"] for chunk in chunks]
        
        vector_store.add_documents(
            collection_name="policy_documents",
            texts=texts,
            metadatas=metadatas
        )
        
        print(f"  Added {len(texts)} policy document chunks")
    
    def run(self):
        """Run the complete ingestion pipeline"""
        print("Starting data ingestion pipeline...")
        print(f"Documents directory: {self.documents_dir}")
        print(f"ChromaDB path: {os.getenv('CHROMA_DB_PATH', './chroma_db')}")
        print("-" * 60)
        
        try:
            # Verify documents exist
            if not self.documents_dir.exists():
                raise FileNotFoundError(f"Documents directory not found: {self.documents_dir}")
            
            # Ingest each document collection
            self.ingest_billing_documents()
            self.ingest_technical_documents()
            self.ingest_policy_documents()
            
            print("-" * 60)
            print("Data ingestion completed successfully!")
            print(f"Vector database persisted at: {os.getenv('CHROMA_DB_PATH', './chroma_db')}")
            
        except Exception as e:
            print(f"Error during ingestion: {str(e)}")
            raise


def main():
    """Main entry point"""
    # Check for OpenAI API key
    if not os.getenv("OPENAI_API_KEY"):
        print("ERROR: OPENAI_API_KEY not found in environment variables")
        print("Please create a .env file with your OpenAI API key")
        sys.exit(1)
    
    # Run pipeline
    pipeline = DataIngestionPipeline()
    pipeline.run()


if __name__ == "__main__":
    main()

