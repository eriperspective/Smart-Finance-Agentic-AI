import chromadb
from chromadb.config import Settings
from langchain_community.vectorstores import Chroma
from typing import List, Dict, Optional
import os

# Only import OpenAI if available
try:
    from langchain_openai import OpenAIEmbeddings
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


class VectorStoreService:
    """Service for managing ChromaDB vector store operations"""
    
    def __init__(self, persist_directory: str = "./chroma_db"):
        self.persist_directory = persist_directory
        if not OPENAI_AVAILABLE or not os.getenv("OPENAI_API_KEY"):
            raise ValueError("OpenAI API key not available - vector store requires OpenAI")
        self.embeddings = OpenAIEmbeddings()
        self.client = chromadb.PersistentClient(path=persist_directory)
        
    def get_collection(self, collection_name: str) -> Chroma:
        """Get or create a ChromaDB collection"""
        return Chroma(
            client=self.client,
            collection_name=collection_name,
            embedding_function=self.embeddings
        )
    
    def query_documents(
        self, 
        collection_name: str, 
        query: str, 
        k: int = 3,
        filter_dict: Optional[Dict] = None
    ) -> List[str]:
        """Query documents from a specific collection"""
        collection = self.get_collection(collection_name)
        
        if filter_dict:
            results = collection.similarity_search(query, k=k, filter=filter_dict)
        else:
            results = collection.similarity_search(query, k=k)
            
        return [doc.page_content for doc in results]
    
    def add_documents(
        self,
        collection_name: str,
        texts: List[str],
        metadatas: Optional[List[Dict]] = None
    ):
        """Add documents to a collection"""
        collection = self.get_collection(collection_name)
        collection.add_texts(texts=texts, metadatas=metadatas)


# Global instance - only create if OpenAI is available
vector_store = None
if OPENAI_AVAILABLE and os.getenv("OPENAI_API_KEY"):
    try:
        vector_store = VectorStoreService(
            persist_directory=os.getenv("CHROMA_DB_PATH", "./chroma_db")
        )
    except Exception as e:
        print(f"⚠️  Vector store initialization failed: {e}")
        print("⚠️  Running without vector store (mock AI mode)")

