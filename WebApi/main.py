from fastapi import FastAPI, Request, HTTPException, Depends, Body
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from code_graph_flow_auto import execute_graph_flow, execute_graph_flow_stream
from fastapi.responses import StreamingResponse
import json
import os
from dotenv import load_dotenv
from user_profile import get_user_profile, UserProfileRequest
from jwt_utils import get_current_user
from redis_client import save_openai_key, save_user_workflow, get_user_workflows, delete_user_workflow, save_user_theme, get_user_theme
from fastapi import Path

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

class NodeInput(BaseModel):
    node_id: str
    node_name: str
    seq: int
    node_input: Optional[str] = None
    node_result: Optional[str] = None

class AdditionalInput(BaseModel):
    node_id: str
    node_input: Optional[str] = None

class GraphFlowRequest(BaseModel):
    graph_flowData: List[NodeInput]
    additional_input: List[AdditionalInput]

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/user-profile")
async def get_user_profile_endpoint(request: UserProfileRequest):
    """
    Get user profile from access token (supports Google OAuth)
    """
    return await get_user_profile(request)

@app.post("/run-graph")
async def run_graph(payload: GraphFlowRequest):
    try:
        user_input = payload.graph_flowData
        additional_input = payload.additional_input
        if not user_input:
            raise ValueError("Missing 'graph_flowData' in request body")
        result = execute_graph_flow([item.model_dump() for item in user_input], [item.model_dump() for item in additional_input])
        return {"status": "completed", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/run-graph-stream")
async def run_graph_stream(payload: GraphFlowRequest):
    try:
        user_input = payload.graph_flowData
        additional_input = payload.additional_input
        if not user_input:
            raise ValueError("Missing 'graph_flowData' in request body")
        return StreamingResponse(execute_graph_flow_stream([item.model_dump() for item in user_input], [item.model_dump() for item in additional_input]), media_type="application/json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/user/update-config")
async def update_user_config(
    data: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Update user config (OpenAI key) for the authenticated user
    """
    openai_key = data.get("openai_api_key")
    if not openai_key:
        raise HTTPException(status_code=400, detail="Missing openai_api_key in request body")
    user_id = current_user["id"]
    saved = await save_openai_key(user_id, openai_key)
    if not saved:
        raise HTTPException(status_code=500, detail="Failed to save OpenAI key")
    return {"success": True}

@app.post("/user/save-workflow")
async def save_workflow(
    data: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Save a workflow for the authenticated user
    """
    name = data.get("name")
    workflow_data = data.get("data")
    if not name or not workflow_data:
        raise HTTPException(status_code=400, detail="Missing workflow name or data")
    user_id = current_user["id"]
    workflow_id = await save_user_workflow(user_id, name, workflow_data)
    if not workflow_id:
        raise HTTPException(status_code=500, detail="Failed to save workflow")
    return {"success": True, "workflow_id": workflow_id}

@app.get("/user/list-workflows")
async def list_workflows(current_user: dict = Depends(get_current_user)):
    """
    List all workflows for the authenticated user
    """
    user_id = current_user["id"]
    workflows = await get_user_workflows(user_id)
    return {"workflows": workflows}

@app.delete("/user/delete-workflow/{workflow_id}")
async def delete_workflow(
    workflow_id: str = Path(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a workflow for the authenticated user
    """
    user_id = current_user["id"]
    deleted = await delete_user_workflow(user_id, workflow_id)
    if not deleted:
        raise HTTPException(status_code=500, detail="Failed to delete workflow")
    return {"success": True}

@app.post("/user/save-theme")
async def save_theme(
    data: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Save the user's selected theme
    """
    theme = data.get("theme")
    if not theme:
        raise HTTPException(status_code=400, detail="Missing theme in request body")
    user_id = current_user["id"]
    saved = await save_user_theme(user_id, theme)
    if not saved:
        raise HTTPException(status_code=500, detail="Failed to save theme")
    return {"success": True}

@app.get("/user/get-theme")
async def get_theme(current_user: dict = Depends(get_current_user)):
    """
    Get the user's selected theme
    """
    user_id = current_user["id"]
    theme = await get_user_theme(user_id)
    return {"theme": theme}

# uvicorn main:app --reload --host 0.0.0.0 --port 8000
# uvicorn main:app --reload --host 0.0.0.0 --port 9000

