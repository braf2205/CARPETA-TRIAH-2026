from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    APP_NAME: str = "TRIAH API"

    OPENAI_API_KEY: str | None = None

    DATABASE_URL: str

    SECRET_KEY: str

    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120

    class Config:
        env_file = ".env"


settings = Settings()