import os
from langchain_community.document_loaders import TextLoader
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import Chroma
from app.core.config import settings

class VectorStoreManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VectorStoreManager, cls).__new__(cls)
            cls._instance.vector_store = None
        return cls._instance

    def initialize_db(self):
        if self.vector_store is not None:
            return

        embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
        
        # In a real scenario, we might want to check if the DB already exists on disk
        if os.path.exists(settings.CHROMA_DB_DIR) and os.listdir(settings.CHROMA_DB_DIR):
            self.vector_store = Chroma(
                persist_directory=settings.CHROMA_DB_DIR,
                embedding_function=embeddings
            )
        else:
            # Load and split the knowledge base
            if os.path.exists(settings.KNOWLEDGE_BASE_FILE):
                loader = TextLoader(settings.KNOWLEDGE_BASE_FILE, encoding='utf-8')
                documents = loader.load()
                text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
                docs = text_splitter.split_documents(documents)
                
                self.vector_store = Chroma.from_documents(
                    documents=docs,
                    embedding=embeddings,
                    persist_directory=settings.CHROMA_DB_DIR
                )
            else:
                # Create an empty vector store if no knowledge base is found
                self.vector_store = Chroma(
                    persist_directory=settings.CHROMA_DB_DIR,
                    embedding_function=embeddings
                )

    def get_retriever(self):
        if self.vector_store is None:
            self.initialize_db()
        return self.vector_store.as_retriever()

vector_store_manager = VectorStoreManager()
