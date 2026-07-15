from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Dict, List, Optional

router = APIRouter()

# In-memory mock database for resume project tasks
db: Dict[int, dict] = {
    1: {"id": 1, "name": "EC2 Instance Setup", "description": "Launch Ubuntu 22.04 LTS instance", "completed": True},
    2: {"id": 2, "name": "ECR Repository", "description": "Create Amazon Elastic Container Registry repo", "completed": True},
    3: {"id": 3, "name": "CI/CD Pipeline", "description": "Configure GitHub Actions workflow and deploy script", "completed": False}
}

class Item(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, example="My Dev Task")
    description: Optional[str] = Field(None, max_length=500, example="Steps to perform")
    completed: bool = Field(default=False, example=False)

class ItemResponse(Item):
    id: int

@router.get("/items", response_model=List[ItemResponse], status_code=status.HTTP_200_OK)
def get_items():
    """Retrieve all tasks/items from the database."""
    return list(db.values())

@router.get("/items/{item_id}", response_model=ItemResponse, status_code=status.HTTP_200_OK)
def get_item(item_id: int):
    """Retrieve a single task/item by its ID."""
    if item_id not in db:
        raise HTTPException(status_code=404, detail=f"Task with ID {item_id} not found")
    return db[item_id]

@router.post("/items", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(item: Item):
    """Create a new task/item in the database."""
    new_id = max(db.keys()) + 1 if db else 1
    new_item = {
        "id": new_id,
        "name": item.name,
        "description": item.description,
        "completed": item.completed
    }
    db[new_id] = new_item
    return new_item

@router.delete("/items/{item_id}", status_code=status.HTTP_200_OK)
def delete_item(item_id: int):
    """Delete a task/item by its ID."""
    if item_id not in db:
        raise HTTPException(status_code=404, detail=f"Task with ID {item_id} not found")
    deleted_item = db.pop(item_id)
    return {"message": "Task successfully deleted", "deleted_item": deleted_item}
