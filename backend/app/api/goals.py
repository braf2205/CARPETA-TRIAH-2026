from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalResponse

router = APIRouter(prefix="/goals", tags=["Goals"])


@router.post("/", response_model=GoalResponse)
def create_goal(payload: GoalCreate, db: Session = Depends(get_db)):
    goal = Goal(**payload.dict())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.get("/", response_model=list[GoalResponse])
def get_goals(db: Session = Depends(get_db)):
    return db.query(Goal).all()


@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()

    if goal:
        db.delete(goal)
        db.commit()

    return {"message": "Goal deleted"}