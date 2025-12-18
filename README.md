# Backend

```sh
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "DATABASE_URL=sqlite:///./timetracking.db" > .env
uvicorn main:app --reload
```

http://localhost:8000
http://localhost:8000/docs 

```sh
pytest test_main.py -v
```

