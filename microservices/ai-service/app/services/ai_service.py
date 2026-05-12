from langchain_openai import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from app.core.config import settings
from app.db.vector_store import vector_store_manager

class AIService:
    def __init__(self):
        self.llm = ChatOpenAI(
            model=settings.OPENAI_MODEL,
            openai_api_key=settings.OPENAI_API_KEY,
            temperature=0.7
        )
        
        # Medical Chatbot System Prompt
        self.medical_system_prompt = (
            "You are a helpful medical assistant for MediConnect. "
            "Use the provided context to answer questions about symptoms and medical terms. "
            "IMPORTANT: Do not provide a formal medical diagnosis or prescribe specific treatments. "
            "Always suggest consulting a professional doctor for serious concerns. "
            "If you don't know the answer based on the context, say that you don't know. "
            "\n\n"
            "{context}"
        )

        # Appointment Assistant System Prompt
        self.appointment_system_prompt = (
            "You are a friendly appointment assistant for MediConnect. "
            "Help the user schedule a medical appointment. "
            "Ask for their name, preferred date, and the reason for the visit. "
            "Guide them naturally through the conversation."
        )

    async def get_medical_chat_response(self, query: str, chat_history=None):
        retriever = vector_store_manager.get_retriever()
        
        contextualize_q_system_prompt = (
            "Given a chat history and the latest user question "
            "which might reference context in the chat history, "
            "formulate a standalone question which can be understood "
            "without the chat history. Do NOT answer the question, "
            "just reformulate it if needed and otherwise return it as is."
        )
        
        contextualize_q_prompt = ChatPromptTemplate.from_messages([
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])
        
        history_aware_retriever = create_history_aware_retriever(
            self.llm, retriever, contextualize_q_prompt
        )
        
        qa_prompt = ChatPromptTemplate.from_messages([
            ("system", self.medical_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])
        
        question_answer_chain = create_stuff_documents_chain(self.llm, qa_prompt)
        rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
        
        response = rag_chain.invoke({"input": query, "chat_history": chat_history or []})
        return response["answer"]

    async def get_appointment_assistance(self, query: str, chat_history=None):
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.appointment_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])
        
        chain = prompt | self.llm
        
        # In a real app, we would manage session-based history
        response = chain.invoke({"input": query, "chat_history": chat_history or []})
        return response.content

ai_service = AIService()
