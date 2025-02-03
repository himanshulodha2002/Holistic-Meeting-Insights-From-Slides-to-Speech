from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from app.services.audio_processing import extract_audio
from app.services.image_processing import classify_and_remove_duplicates, extract_screenshots
from app.services.openai_integration import get_image_descriptions
from app.utils.file_utils import create_directories, save_json, delete_folder, get_next_id
from app.models.models import whisper_transcribe
from app.utils.vectordb import create_vector_db
from app.utils.similarity_search import perform_similarity_search
import os
import json
from pydantic import BaseModel

router = APIRouter()

@router.post("/process/")
async def processing(
    name: str = Form(...),       
    email: str = Form(...),
    video: UploadFile = File(...),
    meetingName: str = Form(...),
    dateTime: str = Form(...),
    topic: str = Form(...),
    duration: str = Form(...),
    host: str = Form(...),
    attendees: str = Form(...),
    otherInfo: str = Form(...),
):
    try:
        base_path = os.path.dirname(__file__)
        data_dir = os.path.join(base_path, "..", "..", "data")
        
        # Generate a unique ID for the submission
        id = str(get_next_id(data_dir))

        video_dir = os.path.join(data_dir, id, "Video")
        create_directories([video_dir])
        
        video_path = os.path.join(video_dir, f"{id}.mp4")
        audio_path = os.path.join(data_dir, id, "Audio", f"{id}.mp3")
        screenshots_path = os.path.join(data_dir, id, "Screenshots")

        create_directories([screenshots_path, os.path.dirname(audio_path)])
        
        # Save the video file in chunks
        try:
            with open(video_path, "wb") as f:
                while chunk := await video.read(1024 * 1024):  # Read in 1MB chunks
                    f.write(chunk)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save video file: {str(e)}")

        # Process video: extract audio and screenshots
        extract_audio(video_path, audio_path)
        extract_screenshots(video_path, screenshots_path, fps=0.2, id=id)

        # Transcribe audio
        transcription = await whisper_transcribe(audio_path)
        
        # Classify and remove duplicates
        classify_and_remove_duplicates(screenshots_path)
        
        # Generate image descriptions
        descriptions = await get_image_descriptions(screenshots_path, id)

        # Save results
        result = {
            "id": id,
            "name": name,
            "email": email,
            "meetingName": meetingName,
            "dateTime": dateTime,
            "topic": topic,
            "duration": duration,
            "host": host,
            "attendees": attendees,
            "otherinfo": otherInfo,
            "transcription": transcription,
            "descriptions": descriptions,
        }
        result_path = os.path.join(data_dir, id, "result.json")
        save_json(result, result_path)
        create_vector_db(id)

        # Verify and Delete the folders
        png_files_exist = any(file.endswith(".png") for file in os.listdir(screenshots_path)) 
        description_failure = png_files_exist and not descriptions[0].startswith(f"Description for {id}")

        if result["transcription"] != "" and not description_failure:
            delete_folder(os.path.dirname(video_path))
            delete_folder(os.path.dirname(audio_path))
            delete_folder(screenshots_path)
        else:
            result = {"error": "Processing failed"}
        
        return JSONResponse(content={"message": "Form submitted successfully", "id": id}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/getlist")
async def get_meetings_list():
    try:
        base_path = os.path.dirname(__file__)
        data_dir = os.path.join(base_path, "..", "..", "data")
        meetings = []

        for folder_name in os.listdir(data_dir):
            folder_path = os.path.join(data_dir, folder_name)
            if os.path.isdir(folder_path):
                result_file = os.path.join(folder_path, "result.json")
                if os.path.exists(result_file):
                    with open(result_file, "r") as f:
                        result_data = json.load(f)
                        meeting_name = result_data.get("meetingName", "Unknown Meeting")
                        meetings.append({"id": folder_name, "name": meeting_name})

        return JSONResponse(content={"meetings": meetings}, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
class SimilaritySearchRequest(BaseModel):
    query: str
    id: str

@router.post("/similarity_search")
async def similarity_search(request: SimilaritySearchRequest):
    try:
        # print(request.query, request.id)
        results = perform_similarity_search(request.query, request.id)
        # print(results, "after call")
        return JSONResponse(content={"results": [res.page_content for res in results]}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))