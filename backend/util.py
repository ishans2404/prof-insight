import os
import json
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores.faiss import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def extract_text(json_path):
    with open(json_path, 'r') as file:
        data = json.load(file)
        
    text = ""
    for professor in data['professors']:
        professor_id = professor.get('professor_id')
        name = professor.get('name')
        course = professor.get('course')
        reviews = professor.get('reviews', [])
                
        text += f'\nProfessor ID: {professor_id}, Professor Name: {name}, Course: {course}\n '
        if reviews:
            for review in reviews:
                rating = review.get('rating')
                review_text = review.get('review_text')
                text += f"Rating: {rating}, Review: {review_text}\n"
        else:
            print("No reviews available.")
    return text

def split_text_into_chunks(text):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    text_chunks = splitter.split_text(text)
    return text_chunks

def create_vector_store(chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(chunks, embedding=embeddings)
    vector_store.save_local("reviews_index")

def main(json_path):
    text = extract_text(json_path)
    chunks = split_text_into_chunks(text)
    create_vector_store(chunks)

json_path = 'reviews.json'
main(json_path)