SHELL := /bin/bash

BACKEND  := backend
FRONTEND := frontend
VENV     := .venv

install: 
	install-backend install-frontend

install-backend: 
	cd $(BACKEND) && python -m venv $(VENV)
	cd $(BACKEND) && $(VENV)/bin/pip install -r requirements.txt
	@if [ ! -f $(BACKEND)/.env ]; then \
		cp $(BACKEND)/.env.example $(BACKEND)/.env; \
		echo "Создан $(BACKEND)/.env — впишите в DATABASE_URL свой пароль"; \
	fi

install-frontend: 
	cd $(FRONTEND) && npm install

db:
	cd $(BACKEND) && $(VENV)/bin/python -m app.db.init_db --seed

db-reset: ## пересоздать таблицы с нуля 
	cd $(BACKEND) && $(VENV)/bin/python -m app.db.init_db --reset --seed

backend: 
	cd $(BACKEND) && $(VENV)/bin/uvicorn app.main:app --reload

frontend:
	cd $(FRONTEND) && npm run dev

dev:
	$(MAKE) -j2 backend frontend