from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from code_graph_flow_auto import execute_graph_flow_stream, stream_graph_flow
from fastapi.responses import StreamingResponse
import json

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

@app.post("/run-graph")
async def run_graph(payload: GraphFlowRequest):
    try:
        user_input = payload.graph_flowData
        additional_input = payload.additional_input
        if not user_input:
            raise ValueError("Missing 'graph_flowData' in request body")
        result = execute_graph_flow_stream([item.model_dump() for item in user_input], [item.model_dump() for item in additional_input])
        return {"status": "completed", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/run-graph-stream")
async def run_graph_stream(payload: GraphFlowRequest):
    try:
        user_input = payload.graph_flowData
        if not user_input:
            raise ValueError("Missing 'graph_flowData' in request body")
        return StreamingResponse(stream_graph_flow([item.model_dump() for item in user_input]), media_type="application/json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# uvicorn main:app --reload --host 0.0.0.0
#uvicorn main:app --host 0.0.0.0 --port 9000

