import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores.faiss import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
import google.generativeai as genai
from dotenv import load_dotenv

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv()

# Configure Google API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class QuestionInput(BaseModel):
    question: str

class UploadInput(BaseModel):
    url: str = Form(None)

def scrape_data(url):

    return "scraped data"

def split_text_into_chunks(text):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    text_chunks = splitter.split_text(text)
    return text_chunks

def create_vector_store(chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")

def setup_conversation_chain(template):
    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
    prompt = PromptTemplate(template=template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

@app.post("/upload")
async def upload_files(url: str = Form(None)):
    try:
        # print(url)
        # all_text = ""
        
        # # Process URL
        # if url:
        #     # check if url is valid (request doesnt give error)
        #     if # doesnt give error
        #         all_text = scrape_data(url)
        #     else:
        #         raise HTTPException(status_code=400, detail="Invalid URL")

        # if not all_text:
        #     raise HTTPException(status_code=400, detail="No content to process")

        # chunks = split_text_into_chunks(all_text)
        # create_vector_store(chunks)

        return {"message": "Content uploaded and processed successfully"}
    except HTTPException as http_exc:
        print(f"HTTP Exception: {http_exc.detail}")
        raise http_exc
    except Exception as e:
        print(f"Unhandled Exception: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/ask")
async def ask_question(question_input: QuestionInput):
    try:
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        indexed_data = FAISS.load_local("reviews_index", embeddings, allow_dangerous_deserialization=True)
        docs = indexed_data.similarity_search(question_input.question)
        
        prompt_template = """
        Your alias is AI Rate Professor. Your task is to provide a thorough response based on the given context, ensuring all relevant details are included. 
        If the requested information isn't available, simply state, "answer not available in context," then answer based on your understanding, connecting with the context. 
        Don't provide incorrect information.\n\n
        Context: \n {context}?\n
        Question: \n {question}\n
        Answer:
        """
        
        chain = setup_conversation_chain(prompt_template)
        response = chain({"input_documents": docs, "question": question_input.question}, return_only_outputs=True)
        
        print(response["output_text"])
        return {"answer": response["output_text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# prompt_template = """
#         Your alias is AI Rate Professor. Your task is to provide a thorough response based on the given context, ensuring all relevant details are included. 
#         If the requested information isn't available, simply state, "answer not available in context," then answer based on your understanding, connecting with the context. 
#         Don't provide incorrect information.\n\n
#         Context: \n {context}?\n
#         Question: \n {question}\n
#         Answer:
#         """